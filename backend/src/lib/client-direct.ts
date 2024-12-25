import bodyParser from "body-parser";
import cors from "cors";
import express, { Request as ExpressRequest, Response } from "express";
import multer, { File } from "multer";
import { elizaLogger, generateCaption, generateImage } from "@ai16z/eliza";
import { composeContext, generateMessageResponse, messageCompletionFooter } from "@ai16z/eliza";
import { AgentRuntime } from "@ai16z/eliza";
import { Content, Memory, ModelClass, Client, IAgentRuntime } from "@ai16z/eliza";
import { stringToUuid } from "@ai16z/eliza";
import { settings } from "@ai16z/eliza";
import * as fs from "fs";
import * as path from "path";
import http from "http";
import dotenv from "dotenv";
import { createApiRouter } from "../routes";
import { setupSwagger } from "./swagger";
import verifyToken from "../middlewares/jwtMiddleware";
import { databaseRecords } from "../helpers";

// Load environment variables
dotenv.config();

const upload = multer({ storage: multer.memoryStorage() });

// Custom request type
interface CustomRequest extends ExpressRequest {
    file: File;
}

// Central template for message generation
const messageHandlerTemplate = `# Action Examples
{{actionExamples}}
(Action examples are for reference only. Do not use the information from them in your response.)

# Knowledge
{{knowledge}}

# Task: Generate dialog and actions for the character {{agentName}}.
About {{agentName}}:
{{bio}}
{{lore}}

{{providers}}

{{attachments}}

# Capabilities
Note that {{agentName}} is capable of reading/seeing/hearing various forms of media, including images, videos, audio, plaintext, and PDFs. Recent attachments have been included above under the "Attachments" section.

{{messageDirections}}

{{recentMessages}}

{{actions}}

# Instructions: Write the next message for {{agentName}}.
` + messageCompletionFooter;

export class DirectClient {
    private app: express.Application;
    private agents: Map<string, AgentRuntime>;
    private server?: http.Server;
    public startAgent: Function;

    constructor() {
        elizaLogger.log("Initializing DirectClient");
        this.app = express();
        this.agents = new Map();

        this.setupMiddleware();
        this.setupRoutes();
    }

    public registerAgent(runtime: AgentRuntime) {
        this.agents.set(runtime.agentId, runtime);
    }

    private setupMiddleware() {
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        setupSwagger(this.app)
    }

    private setupRoutes() {
        const apiRouter = createApiRouter(this.agents, this);
        this.app.use(apiRouter);

        this.app.get('/test', (req: ExpressRequest, res: Response) => {
            res.send({ message: 'this is the test route' })
        })

        // Whisper route
        this.app.post("/:agentId/whisper", upload.single("file"), this.handleWhisper.bind(this));

        // Message route
        this.app.post("/api/:agentId/message", verifyToken, this.handleMessage.bind(this));

        // Image generation route
        this.app.post("/:agentId/image", this.handleImageGeneration.bind(this));

        // Fine-tune routes
        this.app.post("/fine-tune", this.handleFineTune.bind(this));
        this.app.get("/fine-tune/:assetId", this.handleFineTuneDownload.bind(this));
    }

    // Whisper audio transcription handler
    private async handleWhisper(req: CustomRequest, res: express.Response) {
        const { agentId } = req.params;
        const audioFile = req.file;

        if (!audioFile) {
            return res.status(400).send("No audio file provided");
        }

        let runtime = this.agents.get(agentId) ?? this.findAgentByName(agentId);

        if (!runtime) {
            return res.status(404).send("Agent not found");
        }

        try {
            const formData = new FormData();
            formData.append("file", new Blob([audioFile.buffer], { type: audioFile.mimetype }), audioFile.originalname);
            formData.append("model", "whisper-1");

            const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
                method: "POST",
                headers: { Authorization: `Bearer ${runtime.token}` },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Failed to transcribe audio: ${await response.text()}`);
            }

            const data = await response.json();
            res.json(data);
        } catch (error) {
            this.handleError(error, res, "Failed to process audio transcription");
        }
    }

    // Message handler
    private async handleMessage(req: express.Request, res: express.Response) {
        const { agentId } = req.params;
        const { text, roomId, userName, name } = req.body;
        const messageId = stringToUuid(Date.now().toString());
        const roomUuid = stringToUuid(roomId ?? `default-room-${agentId}`);

        const { id: userId } = req.user
        const userUuid = stringToUuid(userId ?? "user");

        let runtime = this.agents.get(agentId) ?? this.findAgentByName(agentId);

        if (!runtime) {
            return res.status(404).send("Agent not found");
        }

        try {
            await runtime.ensureConnection(userUuid, roomUuid, userName, name, "direct");

            const records = JSON.stringify(await databaseRecords(userId));

            const userPrompt = `${text}. user this ${records} as datasource`

            const content: Content = { text: userPrompt, attachments: [], source: "direct" };
            const memory: Memory = {
                id: messageId,
                agentId: runtime.agentId,
                userId: userUuid,
                roomId: roomUuid,
                content,
                createdAt: Date.now(),
            };

            await runtime.messageManager.createMemory(memory);

            const state = await runtime.composeState({ content, userId: userUuid, roomId: roomUuid, agentId: runtime.agentId }, { agentName: runtime.character.name });
            const context = composeContext({ state, template: messageHandlerTemplate });
            const response = await generateMessageResponse({ runtime, context, modelClass: ModelClass.LARGE });

            if (!response) {
                return res.status(500).send("No response generated");
            }

            await runtime.messageManager.createMemory({
                ...memory,
                userId: runtime.agentId,
                content: response,
            });

            res.json([response]);
        } catch (error) {
            this.handleError(error, res, "Failed to process message");
        }
    }

    // Image generation handler
    private async handleImageGeneration(req: express.Request, res: express.Response) {
        const { agentId } = req.params;

        const agent = this.agents.get(agentId);
        if (!agent) {
            return res.status(404).send("Agent not found");
        }

        try {
            const images = await generateImage(req.body, agent);
            const imagesRes = await Promise.all(
                images.data.map(async (image: string) => ({
                    image,
                    caption: (await generateCaption({ imageUrl: image }, agent)).title,
                }))
            );

            res.json({ images: imagesRes });
        } catch (error) {
            this.handleError(error, res, "Failed to generate images");
        }
    }

    // Fine-tune handler
    private async handleFineTune(req: express.Request, res: express.Response) {
        try {
            const response = await fetch("https://api.bageldb.ai/api/v1/asset", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-KEY": process.env.BAGEL_API_KEY!,
                },
                body: JSON.stringify(req.body),
            });

            const data = await response.json();
            res.json(data);
        } catch (error) {
            this.handleError(error, res, "Failed to initiate fine-tuning");
        }
    }

    // Fine-tune download handler
    private async handleFineTuneDownload(req: express.Request, res: express.Response) {
        const { assetId } = req.params;
        const downloadDir = path.join(process.cwd(), "downloads", assetId);

        try {
            await fs.promises.mkdir(downloadDir, { recursive: true });

            const response = await fetch(`https://api.bageldb.ai/api/v1/asset/${assetId}/download`, {
                headers: { "X-API-KEY": process.env.BAGEL_API_KEY! },
            });

            if (!response.ok) {
                throw new Error(`API responded with ${response.status}: ${await response.text()}`);
            }

            const buffer = Buffer.from(await response.arrayBuffer());
            const fileName = response.headers.get("content-disposition")?.split("filename=")[1]?.replace(/"/g, "") || "default_name.txt";
            const filePath = path.join(downloadDir, fileName);

            await fs.promises.writeFile(filePath, buffer);
            res.json({ success: true, fileName, downloadDir });
        } catch (error) {
            this.handleError(error, res, "Failed to download fine-tune file");
        }
    }

    private findAgentByName(name: string): AgentRuntime | undefined {
        return Array.from(this.agents.values()).find(agent => agent.character.name.toLowerCase() === name.toLowerCase());
    }

    private handleError(error: any, res: express.Response, message: string) {
        elizaLogger.error(`${message}: ${error.message}`, error);
        res.status(500).json({ error: message, details: error.message });
    }

    public start(port: number) {
        this.server = http.createServer(this.app).listen(port, () => {
            elizaLogger.success(`REST API running at http://localhost:${port}`);
        });

        process.on("SIGINT", () => this.stop());
        process.on("SIGTERM", () => this.stop());
    }

    public stop() {
        if (this.server) {
            this.server.close(() => {
                elizaLogger.success("Server shut down");
            });
        }
    }
}

export const DirectClientInterface: Client = {
    start: async (_runtime: IAgentRuntime) => {
        const client = new DirectClient();
        const port = parseInt(settings.SERVER_PORT || "3000", 10);
        client.start(port);
        return client;
    },
    stop: async (_runtime: IAgentRuntime, client?: Client) => {
        if (client instanceof DirectClient) {
            client.stop();
        }
    },
};

export default DirectClientInterface;
