export interface MarketTrendResponse {
    avgAppreciationRate: number;
    rentalDemand: number;
}

export interface PropertyRecommendation {
    id: string;
    name: string;
    city: string;
    appreciationRate: number;
}

export interface PortfolioAdvice {
    property: string;
    advice: string;
}
