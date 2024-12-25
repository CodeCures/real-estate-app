/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /dashboard-stats:
 *   get:
 *     summary: Get the dashboard statistics
 *     description: This endpoint retrieves platform-wide dashboard statistics, including line charts, bar charts, and various financial stats. Requires a valid JWT token.
 *     tags:
 *       - Dashboard Stats
 *     security:
 *       - bearerAuth: []  # Indicates that the route requires Bearer authentication
 *     responses:
 *       200:
 *         description: Successfully retrieved dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 lineChart:
 *                   type: object
 *                   properties:
 *                     labels:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["September", "October", "November"]
 *                     datasets:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           label:
 *                             type: string
 *                           data:
 *                             type: array
 *                             items:
 *                               type: number
 *                             example: [6139.34, 2628.04, 2462.52]
 *                           fill:
 *                             type: boolean
 *                           tension:
 *                             type: number
 *                           borderColor:
 *                             type: string
 *                           backgroundColor:
 *                             type: string
 *                 barChart:
 *                   type: object
 *                   properties:
 *                     labels:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["January", "February", "March", "April"]
 *                     datasets:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           label:
 *                             type: string
 *                           backgroundColor:
 *                             type: string
 *                           borderColor:
 *                             type: string
 *                           borderWidth:
 *                             type: integer
 *                           data:
 *                             type: array
 *                             items:
 *                               type: number
 *                             example: [0, 0, 0, 15949.23]
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalexpenses:
 *                       type: string
 *                       example: "20679.98"
 *                     totalnetincome:
 *                       type: string
 *                       example: "37163.55"
 *                     numberofproperties:
 *                       type: string
 *                       example: "3"
 *                 history:
 *                   type: object
 *                   properties:
 *                     expenses:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           amount:
 *                             type: string
 *                           type:
 *                             type: string
 *                           vendor:
 *                             type: string
 *                           propertyName:
 *                             type: string
 *                           propertyType:
 *                             type: string
 *                           date:
 *                             type: string
 *                     propertyPerformanceReports:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           netIncome:
 *                             type: string
 *                           occupancyRate:
 *                             type: string
 *                           propertyName:
 *                             type: string
 *                           date:
 *                             type: string
 *       401:
 *         description: Unauthorized (invalid or missing Bearer token)
 *       500:
 *         description: Internal server error
 */
