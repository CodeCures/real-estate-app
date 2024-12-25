import express from "express";
import verifyToken from "../middlewares/jwtMiddleware";
import PortfolioController from "../controllers/PortfolioController";
import { validateRequest } from "../validators";
import { createPortfolioSchema, portfolioPropertySchema } from "../validators/portfolioValidator";
const router = express.Router()

router.post('/',
    validateRequest(createPortfolioSchema),
    verifyToken,
    PortfolioController.createPortfolio);

router.get('/', verifyToken, PortfolioController.getUserPortfolios);
router.get('/:id', verifyToken, PortfolioController.getPortfolioDetails);

router.put('/:id/members', verifyToken, PortfolioController.updateMembers);

router.post('/:id/properties',
    verifyToken,
    validateRequest(portfolioPropertySchema),
    PortfolioController.addProperties);

router.get('/:id/properties', verifyToken, PortfolioController.getProperties);
router.get('/:id/activities', verifyToken, PortfolioController.getActivities);

export default router
