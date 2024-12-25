import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'

export function validateRequest(validator: Joi.ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = validator.validate(req.body, {
            abortEarly: false,
            convert: true
        })

        if (error) {
            const errorDetails = error.details.map(err => ({
                message: err.message,
                path: err.path
            }))

            res.status(422).json({
                message: 'Validation failed',
                errors: errorDetails
            })
            return
        }

        req.validated = value
        next()
    }
}