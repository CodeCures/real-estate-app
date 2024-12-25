import Joi from 'joi';


export const registerSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required"
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters long",
        "any.required": "Password is required"
    }),
    name: Joi.string().required().messages({
        "any.required": "Name is required"
    }),
    role: Joi.string().valid('TENANT', 'ADMIN', 'INVESTOR', 'LANDLORD').required().messages({
        "any.required": "User role is required"
    })
});


export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required"
    }),
    password: Joi.string().required().messages({
        "any.required": "Password is required"
    })
});
