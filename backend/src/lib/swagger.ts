import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from "express";
import path from 'path';
import dotenv from 'dotenv'
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

dotenv.config()

// Swagger definition options
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Real Estate Management API',
            description: 'API documentation for the Real Estate Management system.',
            version: '1.0.0',
        },
        servers: [
            {
                url: `${process.env.BASE_URL}/api`,
                description: 'Local server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: [path.join(__dirname, '..', 'docs', '*.ts')],
};

// Initialize Swagger docs
const swaggerDocs = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app: express.Application) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
