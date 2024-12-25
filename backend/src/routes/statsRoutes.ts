import express from "express";
import verifyToken from "../middlewares/jwtMiddleware";
import { StatisticsController } from "../controllers/StatisticsController";

const router = express.Router();

router.get("/", verifyToken, StatisticsController.getStats);

export default router;