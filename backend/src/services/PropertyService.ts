import { Prisma, PropertyType, PropertyStatus, RentalStatus } from '@prisma/client'
import prisma from '../lib/prisma'
import {
    PropertyCreateDTO,
    PropertyExpenseDTO,
    PropertyUpdateDTO,
    RentalAgreementDTO,
    MaintenanceLogDTO,
    PropertySearchFilters
} from '../types'

export class PropertyService {

    static async createProperty(userId: string, data: PropertyCreateDTO) {
        return await prisma.property.create({
            data: {
                ...data,
                userId,
                purchasePrice: new Prisma.Decimal(data.purchasePrice),
                currentValue: new Prisma.Decimal(data.currentValue)
            }
        })
    }

    static async addPropertyExpense(userId: string, expenseData: PropertyExpenseDTO) {
        const property = await prisma.property.findFirst({
            where: {
                id: expenseData.propertyId,
                userId
            }
        })

        if (!property) {
            throw new Error('Property not found or access denied')
        }

        return await prisma.expense.create({
            data: {
                ...expenseData,
                amount: new Prisma.Decimal(expenseData.amount)
            }
        })
    }

    static async listUserProperties(
        userId: string,
        options: {
            page?: number
            limit?: number
            type?: PropertyType
            status?: PropertyStatus
        } = {}
    ) {
        const {
            page = 1,
            limit = 10,
            type,
            status
        } = options

        const where: Prisma.PropertyWhereInput = {
            userId,
            ...(type && { type }),
            ...(status && { status })
        }

        const [total, properties] = await Promise.all([
            prisma.property.count({ where }),
            prisma.property.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    _count: {
                        select: {
                            expenses: true,
                            maintenanceLogs: true,
                            rentalAgreements: true
                        }
                    }
                }
            })
        ])

        return {
            properties,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }
    }

    static async listProperties(
        options: {
            page?: number;
            limit?: number;
            type?: PropertyType;
            status?: PropertyStatus;
        } = {}
    ) {
        const {
            page = 1,
            limit = 10,
            type,
            status
        } = options;

        const where: Prisma.PropertyWhereInput = {
            ...(type && { type }),
            ...(status && { status })
        };

        const [total, properties] = await Promise.all([
            prisma.property.count({ where }),
            prisma.property.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    user: true,
                    _count: {
                        select: {
                            expenses: true,
                            maintenanceLogs: true,
                            rentalAgreements: true
                        }
                    }
                }
            })
        ]);

        return {
            properties,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }


    // Get single property with full details
    static async getPropertyDetails(userId: string, propertyId: string) {
        const property = await prisma.property.findFirst({
            where: {
                id: propertyId,
                userId
            },
            include: {
                expenses: {
                    orderBy: { date: 'desc' },
                    take: 10
                },
                maintenanceLogs: {
                    orderBy: { date: 'desc' },
                    take: 10
                },
                rentalAgreements: {
                    orderBy: { startDate: 'desc' },
                    take: 1
                },
                performanceReports: {
                    orderBy: { reportPeriod: 'desc' },
                    take: 1
                }
            }
        })

        if (!property) {
            throw new Error('Property not found or access denied')
        }

        return property
    }

    static async updateProperty(userId: string, propertyId: string, data: PropertyUpdateDTO) {
        const property = await prisma.property.findFirst({
            where: {
                id: propertyId,
                userId
            }
        })

        if (!property) {
            throw new Error('Property not found or access denied')
        }

        return await prisma.property.update({
            where: { id: propertyId },
            data: {
                ...data,
                ...(data.purchasePrice && {
                    purchasePrice: new Prisma.Decimal(data.purchasePrice)
                }),
                ...(data.currentValue && {
                    currentValue: new Prisma.Decimal(data.currentValue)
                })
            }
        })
    }

    static async deleteProperty(userId: string, propertyId: string) {
        const property = await prisma.property.findFirst({
            where: {
                id: propertyId,
                userId
            }
        })

        if (!property) {
            throw new Error('Property not found or access denied')
        }

        await prisma.$transaction([
            prisma.expense.deleteMany({ where: { propertyId } }),
            prisma.maintenanceLog.deleteMany({ where: { propertyId } }),
            prisma.rentalAgreement.deleteMany({ where: { propertyId } }),
            prisma.propertyPerformanceReport.deleteMany({ where: { propertyId } }),
            prisma.property.delete({ where: { id: propertyId } })
        ])

        return { success: true }
    }

    static async addRentalAgreement(userId: string, data: RentalAgreementDTO) {
        const property = await prisma.property.findFirst({
            where: {
                id: data.propertyId,
                userId
            }
        })

        if (!property) {
            throw new Error('Property not found or access denied')
        }

        const [agreement] = await prisma.$transaction([
            prisma.rentalAgreement.create({
                data: {
                    ...data,
                    monthlyRent: new Prisma.Decimal(data.monthlyRent),
                    securityDeposit: new Prisma.Decimal(data.securityDeposit)
                }
            }),
            prisma.property.update({
                where: { id: data.propertyId },
                data: {
                    rentalStatus: RentalStatus.LEASED,
                    monthlyRent: new Prisma.Decimal(data.monthlyRent)
                }
            })
        ])

        return agreement
    }

    static async generatePropertyReport(userId: string, propertyId: string) {
        const property = await this.getPropertyDetails(userId, propertyId)

        const [expenses, currentRental] = await Promise.all([
            prisma.expense.groupBy({
                by: ['type'],
                where: { propertyId },
                _sum: { amount: true }
            }),
            prisma.rentalAgreement.findFirst({
                where: {
                    propertyId,
                    endDate: { gte: new Date() }
                },
                orderBy: { startDate: 'desc' }
            })
        ])

        const expensesByType = expenses.reduce((acc, curr) => ({
            ...acc,
            [curr.type]: curr._sum.amount
        }), {})

        const totalExpenses = expenses.reduce(
            (sum, exp) => sum.plus(exp._sum.amount || 0),
            new Prisma.Decimal(0)
        )

        const monthlyRent = currentRental?.monthlyRent || new Prisma.Decimal(0)
        const annualRent = monthlyRent.times(12)
        const netIncome = annualRent.minus(totalExpenses)
        const roi = netIncome.dividedBy(property.purchasePrice).times(100)

        return {
            propertyDetails: {
                id: property.id,
                name: property.name,
                type: property.type,
                address: property.address,
                purchasePrice: property.purchasePrice,
                currentValue: property.currentValue
            },
            financials: {
                totalExpenses,
                expensesByType,
                monthlyRent,
                annualRent,
                netIncome,
                roi
            },
            occupancy: {
                status: property.rentalStatus,
                currentTenant: currentRental?.tenantName || null,
                leaseEnd: currentRental?.endDate || null
            },
            maintenance: {
                // recentLogs: property.maintenanceLogs,
                // totalLogs: property.maintenanceLogs
            }
        }
    }
}