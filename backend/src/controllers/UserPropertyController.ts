import { Request, Response } from 'express'
import { PropertyStatus, PropertyType } from '@prisma/client'
import { PropertyService } from '../services/PropertyService'

export class UserProperyController {

    static async listProperties(req: Request, res: Response) {
        try {
            const { userId } = req.params
            const { page, limit, type, status } = req.query

            const result = await PropertyService.listUserProperties(userId, {
                page: page ? Number(page) : undefined,
                limit: limit ? Number(limit) : undefined,
                type: type as PropertyType,
                status: status as PropertyStatus
            })

            res.json(result)
        } catch (error) {
            res.status(500).json({
                message: error instanceof Error ? error.message : 'Failed to retrieve properties'
            })
        }
    }
}