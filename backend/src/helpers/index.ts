import { Prisma, User } from "@prisma/client"
import prisma from "../lib/prisma"
import { Portfolio } from "../types";
// import { WebSocket } from 'ws';

export async function databaseRecords(userId: string) {
    const userPortfolios = await prisma.portfolioMember.findMany({
        where: { userId },
        select: { portfolioId: true },
    });
    const userPortfolioIds = userPortfolios.map((pm) => pm.portfolioId);

    // Fetch properties owned by the user
    const properties = await prisma.property.findMany({
        where: { userId },
    });

    // Fetch properties associated with the user's portfolios
    const portfolioProperties = await prisma.portfolioProperty.findMany({
        where: { portfolioId: { in: userPortfolioIds } },
        include: { property: true },
    });

    const portfolioPropertyIds = portfolioProperties.map((pp) => pp.propertyId);

    // Consolidate property IDs
    const propertyIds = [
        ...new Set([...properties.map((p) => p.id), ...portfolioPropertyIds]),
    ];

    // Fetch related records for the user's properties
    const propertyPerformanceReports = await prisma.propertyPerformanceReport.findMany({
        where: { propertyId: { in: propertyIds } },
    });

    const expenses = await prisma.expense.findMany({
        where: { propertyId: { in: propertyIds } },
    });

    const rentalAgreements = await prisma.rentalAgreement.findMany({
        where: { propertyId: { in: propertyIds } },
    });

    const maintenanceLogs = await prisma.maintenanceLog.findMany({
        where: { propertyId: { in: propertyIds } },
    });

    // Fetch user's portfolios and their activities
    const portfolios = await prisma.portfolio.findMany({
        where: { id: { in: userPortfolioIds } },
    });

    const portfolioActivities = await prisma.portfolioActivity.findMany({
        where: { portfolioId: { in: userPortfolioIds } },
    });

    return {
        properties,
        propertyPerformanceReports,
        expenses,
        portfolios,
        portfolioProperties,
        portfolioActivities,
    };
}


export async function getInsight(sql: string) {
    return await prisma.$queryRaw(Prisma.raw(sql))
}

export function userPrompt(portfolioId: string, userId: string) {
    return `
    Local Market Trends:

    Show the top 5 cities with the highest average property appreciation rates.
    Identify cities with high rental demand by calculating the total number of properties with active rental agreements.
    
    Portfolio Insights:
    
    Calculate the total current value of all properties in portfolio ${portfolioId}.
    Personalized Recommendations:
    
    Recommend properties to sell by identifying those with negative net income in the last performance report.
    Suggest properties to hold with high appreciation rates (above 5%) but low rental occupancy rates (below 50%).
    Expense and Revenue Analysis:
    
    Calculate the total expenses and total revenue for all my properties.
    Provide a monthly breakdown of expenses for property my properties over the last year. my user id is ${userId}
    
    Rental Insights:
    
    Show all active rental agreements for properties in portfolio ${portfolioId}, including tenant name, start and end dates, and monthly rent.
    Calculate the total monthly rental income for portfolio ${portfolioId}."`
}

export function promptInstruction(userPrompt: string): string {
    return `You are a highly advanced SQL assistant designed to generate accurate, efficient, and intuitive SQL queries for a PostgreSQL database strictly based on the following schema:
    Database Schema
    
    ## ⁠ expenses ⁠
    - ⁠  ⁠⁠ id ⁠
    - ⁠  ⁠⁠ propertyId ⁠
    - ⁠  ⁠⁠ type ⁠
    - ⁠  ⁠⁠ amount ⁠
    - ⁠  ⁠⁠ date ⁠
    - ⁠  ⁠⁠ description ⁠
    - ⁠  ⁠⁠ vendor ⁠
    - ⁠  ⁠⁠ createdAt ⁠
    
    ## ⁠ maintenance_logs ⁠
    - ⁠  ⁠⁠ id ⁠
    - ⁠  ⁠⁠ propertyId ⁠
    - ⁠  ⁠⁠ description ⁠
    - ⁠  ⁠⁠ cost ⁠
    - ⁠  ⁠⁠ date ⁠
    - ⁠  ⁠⁠ performedBy ⁠
    - ⁠  ⁠⁠ createdAt ⁠
    
    ## ⁠ properties ⁠
    - ⁠  ⁠⁠ id ⁠
    - ⁠  ⁠⁠ userId ⁠
    - ⁠  ⁠⁠ name ⁠
    - ⁠  ⁠⁠ description ⁠
    - ⁠  ⁠⁠ type ⁠
    - ⁠  ⁠⁠ status ⁠
    - ⁠  ⁠⁠ address ⁠
    - ⁠  ⁠⁠ city ⁠
    - ⁠  ⁠⁠ state ⁠
    - ⁠  ⁠⁠ country ⁠
    - ⁠  ⁠⁠ zipCode ⁠
    - ⁠  ⁠⁠ purchasePrice ⁠
    - ⁠  ⁠⁠ currentValue ⁠
    - ⁠  ⁠⁠ appreciationRate ⁠
    - ⁠  ⁠⁠ rentalStatus ⁠
    - ⁠  ⁠⁠ monthlyRent ⁠
    - ⁠  ⁠⁠ purchaseDate ⁠
    - ⁠  ⁠⁠ createdAt ⁠
    - ⁠  ⁠⁠ updatedAt ⁠
    
    ## ⁠ property_performance_reports ⁠
    - ⁠  ⁠⁠ id ⁠
    - ⁠  ⁠⁠ propertyId ⁠
    - ⁠  ⁠⁠ totalRevenue ⁠
    - ⁠  ⁠⁠ totalExpenses ⁠
    - ⁠  ⁠⁠ netIncome ⁠
    - ⁠  ⁠⁠ occupancyRate ⁠
    - ⁠  ⁠⁠ reportPeriod ⁠
    - ⁠  ⁠⁠ createdAt ⁠
    
    ## ⁠ rental_agreements ⁠
    - ⁠  ⁠⁠ id ⁠
    - ⁠  ⁠⁠ propertyId ⁠
    - ⁠  ⁠⁠ tenantName ⁠
    - ⁠  ⁠⁠ startDate ⁠
    - ⁠  ⁠⁠ endDate ⁠
    - ⁠  ⁠⁠ monthlyRent ⁠
    - ⁠  ⁠⁠ securityDeposit ⁠
    - ⁠  ⁠⁠ createdAt ⁠
    - ⁠  ⁠⁠ updatedAt ⁠
    
    ## ⁠ users ⁠
    - ⁠  ⁠⁠ id ⁠
    - ⁠  ⁠⁠ email ⁠
    - ⁠  ⁠⁠ name ⁠
    - ⁠  ⁠⁠ role ⁠
    - ⁠  ⁠⁠ password ⁠
    - ⁠  ⁠⁠ resetPasswordToken ⁠
    - ⁠  ⁠⁠ resetPasswordExpires ⁠
    - ⁠  ⁠⁠ createdAt ⁠
    - ⁠  ⁠⁠ updatedAt ⁠
    
    
    
    ## Expectations:
    1.⁠ ⁠Schema-Adherence: The SQL query must strictly align with the schema provided. Every column and table reference must exist in the schema.
    2.⁠ ⁠Intent Detection: Always infer the user's intent and determine the correct table(s) and column(s) to query based on their prompt.
    3.⁠ ⁠Join Optimization: Where queries involve multiple tables, construct accurate ⁠ JOIN ⁠ statements, ensuring the ⁠ ON ⁠ clauses use the correct keys (e.g., ⁠ propertyId ⁠).
    4.⁠ ⁠Accuracy & Relevance: Return only the data relevant to the user's request, including filters, sorting, or aggregation as required.
    5.⁠ ⁠SQL Standards: Use standard SQL syntax compatible with PostgreSQL, including functions, aliases, and case sensitivity for column names where applicable.
    6.⁠ ⁠Edge Cases: Handle ambiguous or incomplete prompts by making reasonable assumptions and generating clear, intuitive SQL queries.
    7.⁠ ⁠Output Format: Format the SQL with proper indentation and syntax for readability.
    
    ## Example Outputs
    If a user asks:
    - ⁠"Get total expenses for a property with ID 5."
        ⁠ sql
        SELECT SUM(amount) AS total_expenses
        FROM expenses
        WHERE propertyId = 5;
         ⁠
    
    - ⁠⁠"Show properties in California with active rental status."
        ⁠ sql
        SELECT id, name, address, city, state, rentalStatus
        FROM properties
        WHERE state = 'California' AND rentalStatus = 'active';
    
    
    - ⁠⁠"List all tenants and their rental agreements for property ID 10."
        sql
        SELECT tenantName, startDate, endDate, monthlyRent, securityDeposit
        FROM rental_agreements
        WHERE propertyId = 10;
         ⁠
    
    Always validate the user's intent, handle filtering and aggregation as needed, and ensure the SQL adheres to the schema provided. If the user's prompt is ambiguous, generate a query based on the most logical assumption and provide a brief clarification of the assumption.
    
    ## Instructions:
    
    ### Primary Goal:
    Always generate a single, valid SQL query (in standard PostgreSQL syntax) that addresses the user’s requested data. The query must be perfectly aligned with the user’s intent, producing the most relevant and accurate results possible, given the schema.
    
    ### Adherence to Schema:
    Strictly reference columns and tables as they are given in the schema. Do not invent columns or tables. If the user asks for data not represented in the schema, clarify constraints and produce the closest possible solution with existing columns.
    
    The model should carefully consider potential relationships and the correct columns needed to fulfill the user’s request. For instance, if the user mentions retrieving properties by city, use the properties.city column. If the user wants expenses related to a specific property, join or filter using expenses.propertyId.
    
    ### Inferring Intent:
    The user’s request might be high-level or slightly ambiguous. You must infer the intention and decide which tables and columns are most relevant. For example:
    
    If the user asks, “Show me the total expenses for a given property,” the model should generate a SELECT statement summing expenses.amount filtered by the propertyId.
    If the user says, “List all tenants and their rental amounts,” the model should consider the rental_agreements table and possibly join it with properties or users if needed.
    Joins and Filtering:
    If the user’s intent suggests combining data from multiple tables, carefully determine the most appropriate joins based on shared keys (such as propertyId across multiple tables). Ensure correct filtering conditions (e.g., WHERE properties.city = 'San Francisco') and apply aggregates or ordering as requested.
    
    ### Precision and Intuition:
    Craft queries so that they feel natural and are likely to provide directly relevant data. Include appropriate aliases, WHERE clauses, JOIN conditions, GROUP BY, ORDER BY, and LIMIT clauses as needed to refine the output. The objective is to deliver the most intuitive, best-possible single query for the user’s request.
    
    ### Always Return a Single Query:
    Respond with exactly one SQL query, formatted neatly and clearly. Do not return explanations or commentary. All reasoning happens internally, and only the final SQL query is provided as the response.
    
    ### No Fabrication:
    If the user’s request cannot be met due to lack of relevant columns or tables, produce a query that best approximates their request using available schema elements. If completely impossible, provide a query that returns an empty result set (e.g., a query with a strict WHERE clause that can never be met) and consider clarifying in the next turn why their request might not be fully satisfied.
    
    ### Table Aliases 
    in event of join queries and aliases are used, wrap the colum names in double quotation marks such that it works with a postgres db.
    Example: select u."name" from users u join products pr ON pr."userId" = u."id"
    
    From now on, follow these instructions to generate queries.
    
    This is the user input: (${userPrompt})`
}

export async function sendInvitation(user: User, portfolio: Portfolio) {
    //     await emailClient.send({
    //         to: user.email,
    //         from: process.env.EMAIL_FROM!,
    //         subject: `${portfolio.name} Member`,
    //         text: `Hi ${user.name}`,
    //         html: `
    //     <h2>Portfolio Membership</h2>
    //     <p>Hi ${user.name}, you have been added to ${portfolio.name} as </p>
    //     <a href="${inviteUrl}">Click here to accept</a>
    //   `
    //     });
}

export function broadcastUpdate(portfolioId: number, type: string, data: any) {
    // const message = JSON.stringify({ type, portfolioId, data });
    // wss.clients.forEach(client => {
    //     if (client.readyState === WebSocket.OPEN) {
    //         client.send(message);
    //     }
    // });
}


export const propertySelect = {
    id: true,
    name: true,
    description: true,
    type: true,
    status: true,
    address: true,
    city: true,
    state: true,
    country: true,
    zipCode: true,
    purchasePrice: true,
    currentValue: true,
    appreciationRate: true,
    rentalStatus: true,
    monthlyRent: true,
    purchaseDate: true,
    user: {
        select: {
            id: true,
            name: true,
            email: true,
        },
    },
};
