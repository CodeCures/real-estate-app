import { Expense, Prisma } from "@prisma/client";
import prisma from "../lib/prisma";
import { BarChartData, LineChartData, PropIds } from "../types";
import { UUID } from "crypto";


export class StatsService {
    static async generatePropertyPerformanceLineChartData(userId: string) {

        // Extract property IDs
        const propertyIdList = await this.getPropertyIdList(userId);
        // // Group and aggregate performance data
        const performanceData: LineChartData[] = await prisma.$queryRaw`SELECT 
                "reportPeriod",
                CAST(SUM("totalRevenue") AS FLOAT) AS totalRevenue,
                CAST(SUM("totalExpenses") AS FLOAT) AS totalExpenses,
                CAST(SUM("netIncome") AS FLOAT) AS netIncome,
                CAST(SUM("occupancyRate") AS FLOAT) AS occupancyRate
            FROM property_performance_reports
            WHERE "propertyId" = ANY (${propertyIdList})
            GROUP BY "reportPeriod"
            ORDER BY "reportPeriod" ASC;`;

        // // Map results into chart data format
        const labels = performanceData.map(data =>
            new Date(data.reportPeriod).toLocaleString('default', { month: 'long' })
        );

        const totalRevenue = performanceData.map(data => data.totalrevenue || 0);
        const totalExpenses = performanceData.map(data => data.totalexpenses || 0);
        const netIncome = performanceData.map(data => data.netincome || 0);
        const occupancyRate = performanceData.map(data => data.occupancyrate || 0);

        return {
            labels,
            datasets: [
                {
                    label: 'Total Revenue',
                    data: totalRevenue,
                    fill: false,
                    tension: 0.4,
                    borderColor: 'rgba(54, 162, 235, 1)',
                },
                {
                    label: 'Total Expenses',
                    data: totalExpenses,
                    fill: false,
                    tension: 0.4,
                    borderDash: [5, 5],
                    borderColor: 'rgba(75, 192, 192, 1)',
                },
                {
                    label: 'Net Income',
                    data: netIncome,
                    fill: true,
                    tension: 0.4,
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                },
                {
                    label: 'Occupancy Rate (%)',
                    data: occupancyRate,
                    fill: false,
                    tension: 0.4,
                    borderColor: 'rgba(153, 102, 255, 1)',
                },
            ],
        };

    }

    static async generateUserExpenseBarChartData(userId: string) {
        // Fetch all related property IDs
        const propertyIds = await this.getPropertyIdList(userId)

        if (propertyIds.length === 0) {
            return {
                labels: [],
                datasets: [],
            };
        }

        // Aggregate expenses by month
        const expenses: BarChartData[] = await prisma.$queryRaw`
            SELECT 
            CAST("amount" AS FLOAT) as amount,
            "date"
            FROM "expenses"
            WHERE "propertyId" = ANY (${propertyIds});
        `;


        const monthlyExpenses = expenses.reduce((acc, expense) => {
            const month = new Date(expense.date).toLocaleString('default', { month: 'long' });
            acc[month] = (acc[month] || 0) + expense.amount;
            return acc;
        }, {} as Record<string, number>);



        const labels = [
            'January', 'February', 'March', 'April',
            'May', 'June', 'July', 'August',
            'September', 'October', 'November', 'December'
        ];

        const data = labels.map(month => monthlyExpenses[month] || 0);
        return {
            labels,
            datasets: [
                {
                    label: 'Total Expenses',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    data,
                },
            ],
        };
    }

    static async generateStats(userId: string) {
        const rawResult = await prisma.$queryRaw`
            SELECT 
                COALESCE(SUM(e."amount")::numeric, 0) AS totalExpenses,
                COALESCE(SUM(ppr."netIncome")::numeric, 0) AS totalNetIncome,
                COUNT(DISTINCT p."id")::numeric AS numberOfProperties
            FROM "properties" p
            LEFT JOIN "expenses" e ON e."propertyId" = p."id"
            LEFT JOIN "property_performance_reports" ppr ON ppr."propertyId" = p."id"
            WHERE p."userId" = ${userId};
        `;

        return rawResult[0];
    }

    private static async getPropertyIdList(userId: string): Promise<UUID[]> {
        const propertyIdList: PropIds[] = await prisma.$queryRaw`
            SELECT "id"
            FROM "properties"
            WHERE "userId" = ${userId}
                OR EXISTS (
                    SELECT 1
                    FROM "portfolio_properties" pp
                    JOIN "portfolios" p ON pp."portfolioId" = p."id"
                    JOIN "portfolio_members" m ON p."id" = m."portfolioId"
                    WHERE pp."propertyId" = "properties"."id"
                    AND m."userId" = ${userId}
                );`;

        // Map the result to an array of IDs
        return propertyIdList.map(row => row.id);
    }

    static async getFirst5ExpensesAndReports(userId: string) {
        const expenses = await prisma.$queryRaw`
            SELECT 
                e."amount", 
                e."type", 
                e."vendor", 
                p."name" AS "propertyName", 
                p."type" AS "propertyType", 
                TO_CHAR(e."date", 'FMDDth Mon, YYYY HH12:MIAM') AS "date"
            FROM "expenses" e
            JOIN "properties" p ON e."propertyId" = p."id"
            WHERE p."userId" = ${userId}
            LIMIT 5;
        `;

        const propertyPerformanceReports = await prisma.$queryRaw`
            SELECT 
                ppr."netIncome", 
                ppr."occupancyRate", 
                p."name" AS "propertyName", 
                TO_CHAR(ppr."reportPeriod", 'FMDDth Mon, YYYY HH12:MIAM') AS "date"
            FROM "property_performance_reports" ppr
            JOIN "properties" p ON ppr."propertyId" = p."id"
            WHERE p."userId" = ${userId}
            LIMIT 5;
        `;

        return {
            expenses,
            propertyPerformanceReports,
        };
    }



}