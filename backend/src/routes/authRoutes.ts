import express from "express";
import { AuthController } from "../controllers/AuthController";
import { loginSchema, registerSchema } from "../validators/authValidator";
import { validateRequest } from "../validators";
import { findUserByResetToken, validateEmailExists } from "../middlewares/userFinder";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), AuthController.register);
router.post("/login", validateRequest(loginSchema), AuthController.login);
router.post("/reset-password", validateEmailExists, AuthController.resetPassword);
router.post("/confirm-reset", findUserByResetToken, AuthController.confirmResetPassword);


export default router;