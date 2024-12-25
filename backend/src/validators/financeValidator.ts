import Joi from "joi";

// FinancialTransactionSchema
export const FinancialTransactionSchema = Joi.object({
    amount: Joi.number().positive().required(),
    date: Joi.date().required(),
    description: Joi.string().min(2).required(),
    category: Joi.string().valid('INCOME', 'EXPENSE').required(),
    type: Joi.string().required(),
    relatedDocumentId: Joi.string().optional(),
});

// CashflowReportSchema
export const CashflowReportSchema = Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    propertyIds: Joi.array().items(Joi.string()).optional(),
});