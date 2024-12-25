import { Request, Response } from 'express'
import {
    PropertyCreateDTO,
    PropertyUpdateDTO,
} from '../types'
import { PropertyStatus, PropertyType } from '@prisma/client'
import { PropertyService } from '../services/PropertyService'

export class PropertyController {

    static async createProperty(req: Request, res: Response) {
        try {
            const userId = req.user.id
            const propertyData: PropertyCreateDTO = req.validated as PropertyCreateDTO

            const property = await PropertyService.createProperty(userId, propertyData)
            res.status(201).json(property)
        } catch (error) {
            res.status(400).json({
                message: error instanceof Error ? error.message : 'Failed to create property'
            })
        }
    }

    static async listProperties(req: Request, res: Response) {
        try {
            const userId = req.user.id
            const { page, limit, type, status } = req.query

            const result = await PropertyService.listProperties({
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

    static async getPropertyDetails(req: Request, res: Response) {
        try {
            const user = req.user
            const { propertyId } = req.params

            const property = await PropertyService.getPropertyDetails(user.id, propertyId)
            res.json(property)
        } catch (error) {
            res.status(404).json({
                message: error instanceof Error ? error.message : 'Property not found'
            })
        }
    }

    async updateProperty(req: Request, res: Response) {
        try {
            const userId = req.user.id
            const { propertyId } = req.params
            const updateData: PropertyUpdateDTO = req.body

            const property = await PropertyService.updateProperty(userId, propertyId, updateData)
            res.json(property)
        } catch (error) {
            res.status(400).json({
                message: error instanceof Error ? error.message : 'Failed to update property'
            })
        }
    }

    async deleteProperty(req: Request, res: Response) {
        try {
            const userId = req.user.id
            const { propertyId } = req.params

            await PropertyService.deleteProperty(userId, propertyId)
            res.json({ message: 'Property deleted successfully' })
        } catch (error) {
            res.status(400).json({
                message: error instanceof Error ? error.message : 'Failed to delete property'
            })
        }
    }
}