import { Request, Response } from "express";
import { StatsService } from '../services/StatsService'

export class StatisticsController {
    static async getStats(req: Request, res: Response) {
        const { id: userId } = req.user

        try {
            const lineChart = await StatsService.generatePropertyPerformanceLineChartData(userId);
            const barChart = await StatsService.generateUserExpenseBarChartData(userId);
            const stats = await StatsService.generateStats(userId);
            const history = await StatsService.getFirst5ExpensesAndReports(userId)

            res.send({ lineChart, barChart, stats, history })
        } catch (error) {
            console.log(error);

            res.send({ message: "An error occured" })
        }
    }
}