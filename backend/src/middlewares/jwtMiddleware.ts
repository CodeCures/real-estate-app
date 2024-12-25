import { User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();

const secretKey = process.env.JWT_SECRET || 'your-jwt-secret'

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {

    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({ message: 'Access Denied. No token provided.' });
        return;
    }

    try {
        const decoded = jwt.verify(token, secretKey) as User;

        req.user = decoded;

        next();
    } catch (err) {
        console.log(err.message);

        res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

export default verifyToken;
