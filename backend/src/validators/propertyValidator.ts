import Joi from 'joi'
import { PropertyType, PropertyStatus, ExpenseType, RentalStatus } from '@prisma/client'

const convertEnumToJoiEnum = (enumObj: any) =>
    Object.values(enumObj).map(value => value.toString())

export const propertyCreateValidator = Joi.object({
    userId: Joi.string()
        .guid({ version: ['uuidv4'] })
        .required()
        .messages({
            'string.guid': 'Invalid user ID format',
            'any.required': 'User ID is required'
        }),

    // Property Details Validation
    name: Joi.string()
        .min(2)
        .max(100)
        .trim()
        .required()
        .messages({
            'string.min': 'Property name must be at least 2 characters',
            'string.max': 'Property name cannot exceed 100 characters',
            'any.required': 'Property name is required'
        }),

    description: Joi.string()
        .optional()
        .allow('')
        .max(500)
        .messages({
            'string.max': 'Description cannot exceed 500 characters'
        }),

    type: Joi.string()
        .valid(...convertEnumToJoiEnum(PropertyType))
        .required()
        .messages({
            'any.only': 'Invalid property type',
            'any.required': 'Property type is required'
        }),

    status: Joi.string()
        .valid(...convertEnumToJoiEnum(PropertyStatus))
        .optional()
        .default(PropertyStatus.AVAILABLE)
        .messages({
            'any.only': 'Invalid property status'
        }),

    rentalStatus: Joi.string()
        .valid(...convertEnumToJoiEnum(RentalStatus))
        .optional()
        .default(RentalStatus.VACANT)
        .messages({
            'any.only': 'Invalid property rental status'
        }),

    // Location Validation
    address: Joi.string()
        .min(5)
        .max(200)
        .trim()
        .required()
        .messages({
            'string.min': 'Address must be at least 5 characters',
            'string.max': 'Address cannot exceed 200 characters',
            'any.required': 'Address is required'
        }),

    city: Joi.string()
        .min(2)
        .max(100)
        .trim()
        .required()
        .messages({
            'string.min': 'City must be at least 2 characters',
            'string.max': 'City cannot exceed 100 characters',
            'any.required': 'City is required'
        }),

    state: Joi.string()
        .min(2)
        .max(100)
        .trim()
        .required()
        .messages({
            'string.min': 'State must be at least 2 characters',
            'string.max': 'State cannot exceed 100 characters',
            'any.required': 'State is required'
        }),

    country: Joi.string()
        .min(2)
        .max(100)
        .trim()
        .required()
        .messages({
            'string.min': 'Country must be at least 2 characters',
            'string.max': 'Country cannot exceed 100 characters',
            'any.required': 'Country is required'
        }),

    zipCode: Joi.string()
        .pattern(/^\d{5}(-\d{4})?$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid ZIP code format',
            'any.required': 'ZIP code is required'
        }),

    // Financial Validation
    purchasePrice: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
            'number.positive': 'Purchase price must be a positive number',
            'any.required': 'Purchase price is required'
        }),

    currentValue: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
            'number.positive': 'Current value must be a positive number',
            'any.required': 'Current value is required'
        }),

    // Optional Appreciation Rate
    appreciationRate: Joi.number()
        .optional()
        .min(-100)
        .max(100)
        .precision(2)
        .messages({
            'number.min': 'Appreciation rate cannot be less than -100%',
            'number.max': 'Appreciation rate cannot exceed 100%'
        }),

    // Rental Details
    monthlyRent: Joi.number()
        .optional()
        .positive()
        .precision(2)
        .messages({
            'number.positive': 'Monthly rent must be a positive number'
        }),

    // Dates
    purchaseDate: Joi.date()
        .max('now')
        .required()
        .messages({
            'date.max': 'Purchase date cannot be in the future',
            'any.required': 'Purchase date is required'
        })
})

// Expense Validator
export const expenseCreateValidator = Joi.object({
    // Constrain User ID
    userId: Joi.string()
        .guid({ version: ['uuidv4'] })
        .required()
        .messages({
            'string.guid': 'Invalid user ID format',
            'any.required': 'User ID is required'
        }),

    // Property ID validation
    propertyId: Joi.string()
        .guid({ version: ['uuidv4'] })
        .required()
        .messages({
            'string.guid': 'Invalid property ID format',
            'any.required': 'Property ID is required'
        }),

    type: Joi.string()
        .valid(...convertEnumToJoiEnum(ExpenseType))
        .required()
        .messages({
            'any.only': 'Invalid expense type',
            'any.required': 'Expense type is required'
        }),

    amount: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
            'number.positive': 'Expense amount must be a positive number',
            'any.required': 'Expense amount is required'
        }),

    date: Joi.date()
        .max('now')
        .required()
        .messages({
            'date.max': 'Expense date cannot be in the future',
            'any.required': 'Expense date is required'
        }),

    description: Joi.string()
        .optional()
        .allow('')
        .max(500)
        .messages({
            'string.max': 'Description cannot exceed 500 characters'
        }),

    vendor: Joi.string()
        .optional()
        .max(100)
        .messages({
            'string.max': 'Vendor name cannot exceed 100 characters'
        })
})