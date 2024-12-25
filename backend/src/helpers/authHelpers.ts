import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '@prisma/client';

/**
 * Check if a user exists by email.
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
    return await prisma.user.findUnique({ where: { email } });
};

/**
 * Generate a hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

/**
 * Compare a plain text password with a hashed password.
 */
export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};

/**
 * Generate a JWT for the user.
 */
export const generateJWT = (payload: Record<string, any>): string => {
    return jwt.sign(
        { ...payload },
        process.env.JWT_SECRET || "your_jwt_secret",
        { expiresIn: "1d" }
    );
};

/**
 * Generate a password reset token and expiry.
 */
export const generatePasswordResetToken = () => {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
    return { resetToken, resetTokenExpiry };
};

/**
 * Update a user's reset password token and expiry in the database.
 */
export const updatePasswordResetToken = async (userId: string, resetToken: string, resetTokenExpiry: Date) => {
    return await prisma.user.update({
        where: { id: userId },
        data: {
            resetPasswordToken: resetToken,
            resetPasswordExpires: resetTokenExpiry
        }
    });
};
