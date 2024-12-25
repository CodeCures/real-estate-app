import express from "express";

declare global {
    namespace Express {
        interface Request {
            user?: Record<string, any>
            validated: Record<string, any>
            error: Record<string, any> | Record<string, any>[] | null
        }
    }
}