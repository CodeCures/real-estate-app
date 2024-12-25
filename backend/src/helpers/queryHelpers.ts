//Show the top 5 cities with the highest average property appreciation rates.

export function topFiveCittiesWithHighAvg() {
    return `SELECT 
            "city", 
            AVG("appreciationRate") AS avg_appreciation_rate
        FROM properties
        GROUP BY "city"
        ORDER BY avg_appreciation_rate DESC
        LIMIT 5;`
}

// Identify cities with high rental demand by calculating the total number of properties with active rental agreements.
export function HighRentalDemand() {
    return `SELECT 
            p."city", 
            CAST(COUNT(p."id") AS INT) AS active_rental_properties
        FROM properties p
        JOIN rental_agreements ra ON p."id" = ra."propertyId"
        WHERE 
            ra."startDate" <= NOW() 
            AND (ra."endDate" IS NULL OR ra."endDate" >= NOW())
        GROUP BY p."city"
        ORDER BY active_rental_properties DESC;`
}



// Calculate the total current value of all properties in portfolio.
export function portfolioTotalPropValue(userId: string) {
    return `SELECT
    SUM(pt."currentValue") AS total_current_value
    FROM portfolio_members pm
    JOIN portfolios p ON pm."portfolioId" = p."id"
    JOIN portfolio_properties ppt ON ppt."portfolioId" = pm."portfolioId"
    JOIN properties pt ON ppt."propertyId" = pt.id
    WHERE pm."userId" = '${userId}';`
}


//Recommend properties to sell by identifying those with negative net income in the last performance report,
//and only considering properties in the portfolios the user is a member of.

export function commendedForSell(userId: string) {
    return ` SELECT
    p."name",
        p."address",
            p."state",
                p."currentValue"
    FROM
        properties p
        JOIN property_performance_reports r ON p."id" = r."propertyId"
        JOIN portfolio_properties pt ON pt."portfolioId" = r."propertyId"
        JOIN portfolio_members pm ON pt."portfolioId" = pm."portfolioId"
    WHERE
    pm."userId" = '${userId}'
        AND r."netIncome" < 0;`
}

//Recommend properties to hold with high appreciation rates(above 5 %) but low rental occupancy rates(below 50 %),
//onsidering only properties in portfolios the user is a member of.

export function recommendedToHold(userId: string) {
    return `SELECT
    p."name",
        p."address",
            p."state",
                p."currentValue"
    FROM properties p
    JOIN property_performance_reports r ON p."id" = r."propertyId"
    JOIN portfolio_properties pt ON pt."propertyId" = p."id"
    JOIN portfolio_members pm ON pt."portfolioId" = pm."portfolioId"
    WHERE
    pm."userId" = '${userId}'
        AND p."appreciationRate" > 5 
        AND r."occupancyRate" < 50`
}



// Calculate the total expenses and total revenue for all users' properties along with property details

export function totalExpensesAndRevenue(userId: string) {
    return `SELECT
    p."name" AS property_name,
        p."address",
            p."state",
                p."currentValue",
                    SUM(e."amount") AS total_expenses,
                        SUM(ppr."totalRevenue") AS total_revenue
    FROM expenses e
    JOIN property_performance_reports ppr ON e."propertyId" = ppr."propertyId"
    JOIN properties p ON e."propertyId" = p."id"
    JOIN portfolio_properties pt ON p."id" = pt."propertyId"
    JOIN portfolio_members pm ON pt."portfolioId" = pm."portfolioId"
    WHERE pm."userId" = '${userId}'
    GROUP BY p."id", p."name", p."address", p."state", p."currentValue";`
}

//Provide a monthly breakdown of expenses for properties owned by user ID 29003e09 - ed95 - 4813 - 9a9b - 3b255294c8c1 over the last year.
export function monthlyBreakDown(userId: string) {
    return `SELECT
    EXTRACT(YEAR FROM e."date") AS year,
        EXTRACT(MONTH FROM e."date") AS month,
            SUM(e."amount") AS monthly_expenses
    FROM expenses e
    JOIN properties p ON e."propertyId" = p."id"
    WHERE
    p."userId" = '${userId}' 
        AND e."date" >= NOW() - INTERVAL '1 year'
    GROUP BY year, month
    ORDER BY year DESC, month DESC;`
}

//Show all active rental agreements for properties in portfolio 01e0f9ec - 398d - 48f2 - a6df - 5595b5ef091b, including tenant name, start and end dates, and monthly rent.

export function portfolioActiveRentalAgreement(userId: string) {
    return `SELECT
    ra."tenantName",
        ra."startDate",
            ra."endDate",
                ra."monthlyRent"
    FROM rental_agreements ra
    JOIN properties p ON ra."propertyId" = p."id"
    JOIN portfolio_properties pp ON pp."propertyId" = p."id"
    JOIN portfolio_members pm ON pp."portfolioId" = pm."portfolioId"
    WHERE
    pm."userId" = '${userId}' 
        AND CURRENT_DATE BETWEEN ra."startDate" AND ra."endDate";`
}

// Calculate the total monthly rental income for portfolio 01e0f9ec - 398d - 48f2 - a6df - 5595b5ef091b.
export function portfolioTotalMonthlyIncome(userId: string) {
    return `SELECT
    SUM(ra."monthlyRent") AS total_monthly_rental_income
    FROM rental_agreements ra
    JOIN properties p ON ra."propertyId" = p."id"
    WHERE
    p."userId" = '${userId}';`
}