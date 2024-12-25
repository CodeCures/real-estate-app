import { startAgents } from "./lib/eliza";
import { elizaLogger } from "@ai16z/eliza";
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3000

startAgents(PORT as number).catch((error) => {
    elizaLogger.error("Unhandled error in startAgents:", error);
    process.exit(1);
});

