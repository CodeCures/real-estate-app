import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { LoginPayload, UserPayload } from '../types';
import { getInsight } from '../helpers';
import openai from '../helpers/openai'

export class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const { user, token } = await AuthService.registerUser(req.validated as UserPayload);

            res.status(201).json({
                message: "User registered successfully",
                token,
                user
            });
        } catch (error: any) {
            console.error(error);
            res.status(400).json({ message: error.message });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { token, userData } = await AuthService.loginUser(req.validated as LoginPayload);

            res.json({ token, userData });
        } catch (error: any) {
            console.error(error);
            res.status(401).json({ message: error.message });
        }
    }

    static async resetPassword(req: Request, res: Response) {
        try {
            const userId = req.user.id;
            const resetToken = await AuthService.initiatePasswordReset(userId);

            const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
            // Send reset email logic here...

            res.json({ message: "Password reset link sent to email", resetUrl });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error during password reset" });
        }
    }

    static async confirmResetPassword(req: Request, res: Response) {
        try {
            const userId = req.user.id;
            const { newPassword } = req.body;

            const message = await AuthService.resetPassword(userId, newPassword);

            res.json({ message });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error during password confirmation" });
        }
    }
}
