import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./authRoutes";
import propertyRoutes from "./propertyRoutes";
import userRoutes from "./userRoutes";
import portfolioRoutes from "./portfolioRoutes";
import statsRoutes from "./statsRoutes";

import {
    AgentRuntime,
} from "@ai16z/eliza";

export function createApiRouter(
    agents: Map<string, AgentRuntime>,
    directClient
) {
    const router = express.Router();

    router.use(cors());
    router.use(bodyParser.json());
    router.use(bodyParser.urlencoded({ extended: true }));

    router.get("/", (req, res) => {
        res.send("Welcome, this is the REST API!");
    });

    router.get("/hello", (req, res) => {
        res.json({ message: "Hello World!" });
    });

    router.get("/agents", (req, res) => {
        const agentsList = Array.from(agents.values()).map((agent) => ({
            id: agent.agentId,
            name: agent.character.name,
            clients: Object.keys(agent.character.clients)
        }));
        res.json({ agents: agentsList });
    });

    router.get("/agents/:agentId", (req, res) => {
        const agentId = req.params.agentId;
        const agent = agents.get(agentId);

        if (!agent) {
            res.status(404).json({ error: "Agent not found" });
            return;
        }

        res.json({
            id: agent.agentId,
            character: agent.character,
        });
    });


    router.use("/api/auth", authRoutes);
    router.use("/api/properties", propertyRoutes);
    router.use("/api/users", userRoutes);
    router.use("/api/portfolios", portfolioRoutes);
    router.use('/api/dashboard-stats', statsRoutes);

    return router;
}