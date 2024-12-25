import Eliza from 'eliza';
import { analyzeRealEstateTrends, recommendProperties, portfolioOptimizationAdvice } from './realEstateHelper'; // Import previously created functions

const eliza = new Eliza();

// Function to handle user input through Eliza
export const processUserInput = async (userInput: string, userId: string) => {
    const cityRegex = /in (\w+)/; // Capture city name
    const goalRegex = /recommend properties for (.*)/; // Capture goal (e.g., long-term investment)

    const cityMatch = userInput.match(cityRegex);
    const goalMatch = userInput.match(goalRegex);

    if (cityMatch) {
        const city = cityMatch[1];
        const trends = await analyzeRealEstateTrends(city);
        return `The average appreciation rate in ${city} is ${trends.avgAppreciationRate}% and the rental demand is ${trends.rentalDemand}%`;
    }

    if (goalMatch) {
        const goal = goalMatch[1];
        const recommendations = await recommendProperties(goal);
        return `Based on your goal of ${goal}, I recommend the following properties: ${recommendations.map(property => property.name).join(', ')}`;
    }

    if (userInput.toLowerCase().includes('portfolio')) {
        const advice = await portfolioOptimizationAdvice(userId);
        return `Based on your portfolio, I suggest: ${advice.join(', ')}`;
    }

    // Default Eliza response
    return eliza.respond(userInput);
};
