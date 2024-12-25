import prisma from '../lib/prisma';
import {
    findUserByEmail,
    hashPassword,
    comparePasswords,
    generateJWT,
    generatePasswordResetToken,
    updatePasswordResetToken
} from '../helpers/authHelpers';
import { UserDTO } from '../dtos/user.dto';
import { User } from '@prisma/client';
import { LoginPayload, UserPayload } from '../types';

export class AuthService {
    static async registerUser(userPayload: UserPayload) {
        const existingUser = await findUserByEmail(userPayload.email);
        if (existingUser) {
            throw new Error("User already exists");
        }

        userPayload.password = await hashPassword(userPayload.password);

        const user = await prisma.user.create({
            data: userPayload as User
        });

        const token = generateJWT(user);

        return { user, token };
    }

    static async loginUser(loginRequest: LoginPayload) {
        const user = await findUserByEmail(loginRequest.email);
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isMatch = await comparePasswords(loginRequest.password, user.password);
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        const userData = new UserDTO(user);
        const token = generateJWT(userData);

        return { token, userData };
    }

    static async initiatePasswordReset(userId: string) {
        const { resetToken, resetTokenExpiry } = generatePasswordResetToken();
        await updatePasswordResetToken(userId, resetToken, resetTokenExpiry);
        return resetToken;
    }

    static async resetPassword(userId: string, newPassword: string) {
        const hashedPassword = await hashPassword(newPassword);

        await prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null
            }
        });

        return "Password reset successful";
    }
}
