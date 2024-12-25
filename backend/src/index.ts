import express from "express";
import cors from "cors";
import dotenv from 'dotenv';

import authRoutes from "./routes/authRoutes";
import propertyRoutes from "./routes/propertyRoutes";
import userRoutes from "./routes/userRoutes";
import portfolioRoutes from "./routes/portfolioRoutes";
import statsRoutes from "./routes/statsRoutes";
import { startAgents } from "./lib/eliza";
import { elizaLogger } from "@ai16z/eliza";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/portfolios", portfolioRoutes);
app.use('/api/dashboard-stats', statsRoutes)

const PORT = process.env.PORT || 4100;

startAgents().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((error) => {
    elizaLogger.error("Unhandled error in startAgents:", error);
    process.exit(1); // Exit the process after logging
});


