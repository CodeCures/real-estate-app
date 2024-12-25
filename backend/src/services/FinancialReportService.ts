import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import { CashflowReport } from '../types';

export class FinancialReportService {


    // Calculate ROI for a property
    async calculateROI(propertyId: string): Promise<{
        roi: number;
        annualizedRoi: number;
        breakdown: Record<string, number>;
    }> {
        const property = await prisma.property.findUnique({
            where: { id: propertyId },
            include: {
                expenses: true,
                rentalAgreements: true,
                performanceReports: true
            }
        })

        if (!property) throw new Error('Property not found')

        const totalInvestment = property.purchasePrice

        const totalRentalIncome = property.rentalAgreements.reduce(
            (sum, agreement) => sum.plus(agreement.monthlyRent),
            new Prisma.Decimal(0)
        )

        const totalExpenses = property.expenses.reduce(
            (sum, expense) => sum.plus(expense.amount),
            new Prisma.Decimal(0)
        )

        const appreciation = property.currentValue.minus(property.purchasePrice)
        const netIncome = totalRentalIncome.minus(totalExpenses)
        const totalReturn = netIncome.plus(appreciation)

        // Calculate ROI
        const roi = totalReturn.dividedBy(totalInvestment).times(100)

        // Calculate annualized ROI
        const years = (new Date().getTime() - property.purchaseDate.getTime()) /
            (365 * 24 * 60 * 60 * 1000)
        const annualizedRoi = (Math.pow(1 + roi.toNumber() / 100, 1 / years) - 1) * 100

        return {
            roi: roi.toNumber(),
            annualizedRoi,
            breakdown: {
                rentalIncome: totalRentalIncome.toNumber(),
                expenses: totalExpenses.toNumber(),
                appreciation: appreciation.toNumber(),
                netIncome: netIncome.toNumber()
            }
        }
    }

    // Generate cashflow report
    async generateCashflowReport(params: CashflowReport) {
        const { startDate, endDate, propertyIds } = params

        const whereClause = {
            AND: [
                { date: { gte: startDate } },
                { date: { lte: endDate } },
                ...(propertyIds ? [{ propertyId: { in: propertyIds } }] : [])
            ]
        }

        const [expenses, rentalIncome] = await Promise.all([
            prisma.expense.groupBy({
                by: ['type'],
                where: whereClause,
                _sum: { amount: true }
            }),
            prisma.rentalAgreement.aggregate({
                where: {
                    AND: [
                        { startDate: { lte: endDate } },
                        { endDate: { gte: startDate } },
                        ...(propertyIds ? [{ propertyId: { in: propertyIds } }] : [])
                    ]
                },
                _sum: { monthlyRent: true }
            })
        ])

        return {
            period: { startDate, endDate },
            income: {
                rental: rentalIncome._sum.monthlyRent || new Prisma.Decimal(0),
            },
            expenses: expenses.reduce((acc, curr) => ({
                ...acc,
                [curr.type]: curr._sum.amount
            }), {}),
            summary: {
                totalIncome: rentalIncome._sum.monthlyRent || new Prisma.Decimal(0),
                totalExpenses: expenses.reduce(
                    (sum, exp) => sum.plus(exp._sum.amount || 0),
                    new Prisma.Decimal(0)
                )
            }
        }
    }

    // Calculate property value appreciation
    async calculateAppreciation(propertyId: string): Promise<{
        totalAppreciation: number;
        annualAppreciation: number;
        appreciationHistory: Array<{ date: Date; value: number }>
    }> {
        const property = await prisma.property.findUnique({
            where: { id: propertyId }
        })

        if (!property) throw new Error('Property not found')

        const totalAppreciation = property.currentValue
            .minus(property.purchasePrice)
            .toNumber()

        const years = (new Date().getTime() - property.purchaseDate.getTime()) /
            (365 * 24 * 60 * 60 * 1000)
        const annualAppreciation = (totalAppreciation / property.purchasePrice.toNumber()) / years * 100

        // Get historical property values
        const appreciationHistory = await prisma.propertyPerformanceReport.findMany({
            where: { propertyId },
            select: { reportPeriod: true, netIncome: true },
            orderBy: { reportPeriod: 'asc' }
        })

        return {
            totalAppreciation,
            annualAppreciation,
            appreciationHistory: appreciationHistory.map(report => ({
                date: report.reportPeriod,
                value: report.netIncome.toNumber()
            }))
        }
    }
}