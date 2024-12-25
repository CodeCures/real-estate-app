import Joi from "joi";

export const LogEntrySchema = Joi.object({
    type: Joi.string()
        .valid('MAINTENANCE', 'INSPECTION', 'RENOVATION', 'INCIDENT', 'OTHER')
        .required(),
    description: Joi.string().min(5).required(),
    cost: Joi.number().optional(),
    severity: Joi.string().valid('LOW', 'MEDIUM', 'HIGH').optional(),
    status: Joi.string()
        .valid('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')
        .optional(),
    assignedTo: Joi.string().optional(),
    completionDate: Joi.date().optional(),
});