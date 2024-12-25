import { User } from "@prisma/client";
import { UUID } from "crypto";
import Joi from "joi";

export const createPortfolioSchema = Joi.object({
    name: Joi.string().required().messages({
        "any.required": "Property name is required"
    }),
    members: Joi.array()
});


export const portfolioMemberSchema = Joi.object({
    portfolioId: Joi.string().uuid().required(),
    userId: Joi.string().uuid().required(),
    role: Joi.string().valid('MANAGER', 'CONTRIBUTOR', 'VIEWER').default('VIEWER')
});

export const portfolioPropertySchema = Joi.object({
    propertyIds: Joi.array<UUID>().required(),
});

export const portfolioActivitySchema = Joi.object({
    portfolioId: Joi.string().uuid().required(),
    userId: Joi.string().uuid().required(),
    actionType: Joi.string()
        .valid(
            'PORTFOLIO_CREATED',
            'MEMBERS_UPDATED',
            'PROPERTIES_ADDED',
            'PROPERTY_REMOVED',
            'MEMBER_JOINED',
            'MEMBER_LEFT')
        .required(),
    details: Joi.object().optional()
});
