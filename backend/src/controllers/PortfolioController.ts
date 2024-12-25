import { Request, Response } from 'express';
import { PortfolioService } from '../services/PortfolioService';

class PortfolioController {
    // Create a new shared portfolio
    static async createPortfolio(req: Request, res: Response) {
        const { name, members } = req.body;
        const userId = req.user.id;

        try {
            const portfolio = await PortfolioService.createPortfolio(name, userId, members);

            res.status(201).json({ portfolio });
        } catch (error) {
            console.error('Error creating portfolio:', error.message);
            res.status(500).json({ error: 'Failed to create portfolio' });
        }
    };

    // Get all portfolios where user is a member
    static async getUserPortfolios(req: Request, res: Response) {
        const userId = req.user.id;

        try {
            const portfolios = await PortfolioService.getUserPortfolios(userId)

            res.json({ portfolios });
        } catch (error) {
            console.error('Error fetching portfolios:', error.message);
            res.status(500).json({ error: 'Failed to fetch portfolios' });
        }
    };

    static async getPortfolioDetails(req: Request, res: Response) {
        const { id } = req.params;
        const userId = req.user.id;

        try {

            const portfolioDetail = await PortfolioService.getPortfolioDetails(id, userId)

            res.json({ portfolioDetail });
        } catch (error) {
            console.error('Error fetching portfolio details:', error);
            res.status(500).json({ error: 'Failed to fetch portfolio details' });
        }
    };

    // Update portfolio members
    static async updateMembers(req: Request, res: Response) {
        const { id } = req.params;
        const { members } = req.body;
        const userId = req.user.id;

        try {
            await PortfolioService.updateMembers(id, userId, members)

            res.json({ success: true });
        } catch (error) {
            console.error('Error updating members:', error);
            res.status(500).json({ error: 'Failed to update members' });
        }
    };

    // Add properties to portfolio
    static async addProperties(req: Request, res: Response) {
        const { id } = req.params;
        const { propertyIds } = req.body;
        const userId = req.user.id;

        try {
            await PortfolioService.addProperties(id, userId, propertyIds)
            res.json({ success: true });
        } catch (error) {
            console.error('Error adding properties:', error);
            res.status(500).json({ error: 'Failed to add properties' });
        }
    };

    static async getProperties(req: Request, res: Response) {
        const { id } = req.params;
        const { page = 1, limit = 20 } = req.query;
        const userId = req.user.id;

        try {
            const properties = await PortfolioService.getProperties(id, userId)

            res.json({ properties });
        } catch (error) {
            console.error('Error fetching properties:', error);
            res.status(500).json({ error: 'Failed to fetch properties' });
        }
    };


    // Get portfolio activity feed
    static async getActivities(req: Request, res: Response) {
        const { id } = req.params;
        const { page = 1, limit = 20 } = req.query;
        const userId = req.user.id;

        try {
            // Check if user has access
            const activities = await PortfolioService.getActivities(id, userId)

            res.json({ activities });
        } catch (error) {
            console.error('Error fetching activities:', error);
            res.status(500).json({ error: 'Failed to fetch activities' });
        }
    };
}

export default PortfolioController;