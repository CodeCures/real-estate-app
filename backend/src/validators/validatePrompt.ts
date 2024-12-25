import Joi from 'joi';


export const promptSchema = Joi.object({
    text: Joi.string().required().messages({
        "any.required": "Prompt text is required"
    }),
    agentId: Joi.string()
});