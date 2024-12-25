import { Prisma } from '@prisma/client'
import { LogEntry } from '../types';
import prisma from '../lib/prisma';

export class ReportService {

    async createLogEntry(propertyId: string, data: LogEntry) {

        return prisma.maintenanceLog.create({
            data: {
                propertyId,
                description: data.description,
                cost: data.cost ? new Prisma.Decimal(data.cost) : new Prisma.Decimal(0),
                performedBy: data.assignedTo,
                date: data.completionDate || new Date()
            }
        })
    }

    // Get maintenance history for a property
    async getMaintenanceHistory(
        propertyId: string,
        options: {
            startDate?: Date;
            endDate?: Date;
            type?: string;
            status?: string;
        } = {}
    ) {
        const { startDate, endDate, type, status } = options

        return prisma.maintenanceLog.findMany({
            where: {
                propertyId,
                ...(startDate && { date: { gte: startDate } }),
                ...(endDate && { date: { lte: endDate } }),
                ...(type && { description: { contains: type } })
            },
            orderBy: { date: 'desc' }
        })
    }

    // Track maintenance costs over time
    async getMaintenanceCostAnalysis(propertyId: string) {
        const logs = await prisma.maintenanceLog.findMany({
            where: { propertyId },
            select: { cost: true, date: true }
        })

        // Group costs by month
        const monthlyCosts = logs.reduce((acc, log) => {
            const monthKey = log.date.toISOString().slice(0, 7) // YYYY-MM
            acc[monthKey] = (acc[monthKey] || new Prisma.Decimal(0)).plus(log.cost)
            return acc
        }, {} as Record<string, Prisma.Decimal>)

        // Calculate trends
        const monthlyArray = Object.entries(monthlyCosts)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([month, cost]) => ({
                month,
                cost: cost.toNumber()
            }))

        return {
            monthlyCosts: monthlyArray,
            totalCost: logs.reduce((sum, log) => sum.plus(log.cost), new Prisma.Decimal(0)),
            averageMonthlyCost: monthlyArray.length > 0
                ? monthlyArray.reduce((sum, { cost }) => sum + cost, 0) / monthlyArray.length
                : 0
        }
    }

    // Generate maintenance schedule
    async generateMaintenanceSchedule(propertyId: string) {
        const property = await prisma.property.findUnique({
            where: { id: propertyId },
            include: { maintenanceLogs: true }
        })

        if (!property) throw new Error('Property not found')

        // Define maintenance intervals based on property type
        const maintenanceIntervals = {
            RESIDENTIAL: {
                inspection: 6,
                hvac: 6,
                plumbing: 12,
                electrical: 12,
                exterior: 12
            },
            COMMERCIAL: {
                inspection: 3,
                hvac: 3,
                plumbing: 6,
                electrical: 6,
                exterior: 6
            }
        }

        const intervals = maintenanceIntervals[property.type] || maintenanceIntervals.RESIDENTIAL

        // Generate schedule
        const lastMaintenance = property.maintenanceLogs.reduce((acc, log) => {
            const type = log.description.toLowerCase()
            Object.keys(intervals).forEach(key => {
                if (type.includes(key) && (!acc[key] || acc[key] < log.date)) {
                    acc[key] = log.date
                }
            })
            return acc
        }, {} as Record<string, Date>)

        // Calculate next maintenance dates
        const schedule = Object.entries(intervals).map(([type, interval]) => {
            const lastDate = lastMaintenance[type] || property.purchaseDate
            const nextDate = new Date(lastDate)
            nextDate.setMonth(nextDate.getMonth() + interval)

            return {
                type,
                lastMaintenance: lastMaintenance[type] || null,
                nextDue: nextDate,
                interval: `${interval} months`,
                status: new Date() > nextDate ? 'OVERDUE' : 'SCHEDULED'
            }
        })

        return schedule
    }
}