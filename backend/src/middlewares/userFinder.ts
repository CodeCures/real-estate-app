import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { findUserByEmail } from '../helpers/authHelpers';

/**
 * Middleware to find a user by email (if email exists in the request body).
 */
export const validateEmailExists = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
        res.status(400).json({ message: "Email is required" });
        return
    }

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return
        }

        req.user = user;

        next();
    } catch (error) {
        console.error("Error finding user by email:", error);
        res.status(500).json({ message: "Server error while fetching user" });
    }
};

/**
 * Middleware to find a user by resetPasswordToken (if token exists in the request body).
 */
export const findUserByResetToken = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.body;

    if (!token) {
        res.status(400).json({ message: "Reset token is required" });
        return
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { gt: new Date() }
            }
        });

        if (!user) {
            res.status(400).json({ message: "Invalid or expired reset token" });
            return
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error finding user by reset token:", error);
        res.status(500).json({ message: "Server error while fetching user" });
    }
};
