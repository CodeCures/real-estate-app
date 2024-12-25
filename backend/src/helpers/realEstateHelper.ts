import { RentalStatus } from '@prisma/client';
import prisma from '../lib/prisma';
import { MarketTrendResponse, PropertyRecommendation, PortfolioAdvice } from '../types/elizaTypes';

// Analyze local real estate trends
export const analyzeRealEstateTrends = async (city: string): Promise<MarketTrendResponse> => {
    const properties = await prisma.property.findMany({ where: { city } });
    const avgAppreciationRate = properties.reduce((sum, property) => sum + property.appreciationRate.toNumber(), 0) / properties.length;

    const rentedProperties = properties.filter(property => property.rentalStatus === RentalStatus.LEASED).length;
    const rentalDemand = (rentedProperties / properties.length) * 100;

    return { avgAppreciationRate, rentalDemand };
};

// Recommend properties based on a user goal
export const recommendProperties = async (goal: string): Promise<PropertyRecommendation[]> => {
    let properties;

    if (goal === 'long-term investment') {
        properties = await prisma.property.findMany({
            where: { appreciationRate: { gt: 5 } },
        });
    } else if (goal === 'rental income') {
        properties = await prisma.property.findMany({
            where: { rentalStatus: RentalStatus.LEASED },
        });
    }

    return properties.map(property => ({
        id: property.id,
        name: property.name,
        city: property.city,
        appreciationRate: property.appreciationRate,
    }));
};

// Provide portfolio optimization advice
export const portfolioOptimizationAdvice = async (userId: string): Promise<PortfolioAdvice[]> => {
    const userProperties = await prisma.property.findMany({
        where: { userId },
    });

    let advice = userProperties.map(property => {
        if (property.appreciationRate.toNumber() < 2) {
            return { property: property.name, advice: 'Consider selling due to low appreciation rate.' };
        }
        if (property.rentalStatus === 'VACANT' && property.monthlyRent.toNumber() < 1000) {
            return { property: property.name, advice: 'Consider selling as it has low rental demand.' };
        }
        return { property: property.name, advice: 'Consider holding as it shows strong appreciation.' };
    });

    return advice;
};
