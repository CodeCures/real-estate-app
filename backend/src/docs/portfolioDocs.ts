/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /portfolios:
 *   post:
 *     summary: Create a new portfolio
 *     description: This endpoint creates a new portfolio. The user must be authenticated with a valid JWT token.
 *     tags:
 *       - Portfolios
 *     security:
 *       - bearerAuth: []  # Indicates that the route requires Bearer authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Real Estate Investment Portfolio"
 *     responses:
 *       201:
 *         description: Portfolio created successfully
 *       400:
 *         description: Invalid input (missing or incorrect fields)
 *       401:
 *         description: Unauthorized (invalid or missing Bearer token)
 *       500:
 *         description: Internal server error
 * 
 * /portfolios/{id}:
 *   get:
 *     summary: Get a specific portfolio's details
 *     description: This endpoint retrieves details of a specific portfolio. The user must be authenticated with a valid JWT token.
 *     tags:
 *       - Portfolios
 *     security:
 *       - bearerAuth: []  # Indicates that the route requires Bearer authentication
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the portfolio to retrieve
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Successfully retrieved the portfolio details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 name:
 *                   type: string
 *                   example: "Real Estate Investment Portfolio"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-12-01T00:00:00Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-12-02T00:00:00Z"
 *       401:
 *         description: Unauthorized (invalid or missing Bearer token)
 *       404:
 *         description: Portfolio not found
 *       500:
 *         description: Internal server error
 * 
 *   put:
 *     summary: Update portfolio members
 *     description: This endpoint updates the members of a portfolio. The user must be authenticated with a valid JWT token.
 *     tags:
 *       - Portfolios
 *     security:
 *       - bearerAuth: []  # Indicates that the route requires Bearer authentication
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the portfolio to update
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               members:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     role:
 *                       type: string
 *                       enum:
 *                         - MANAGER
 *                         - CONTRIBUTOR
 *                         - VIEWER
 *                       example: "MANAGER"
 *     responses:
 *       200:
 *         description: Portfolio members updated successfully
 *       400:
 *         description: Invalid input (missing or incorrect fields)
 *       401:
 *         description: Unauthorized (invalid or missing Bearer token)
 *       404:
 *         description: Portfolio not found
 *       500:
 *         description: Internal server error
 * 
 *   delete:
 *     summary: Delete a portfolio
 *     description: This endpoint deletes a portfolio. The user must be authenticated with a valid JWT token.
 *     tags:
 *       - Portfolios
 *     security:
 *       - bearerAuth: []  # Indicates that the route requires Bearer authentication
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the portfolio to delete
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Portfolio deleted successfully
 *       401:
 *         description: Unauthorized (invalid or missing Bearer token)
 *       404:
 *         description: Portfolio not found
 *       500:
 *         description: Internal server error
 * 
 * /portfolios/{id}/properties:
 *   post:
 *     summary: Add properties to a portfolio
 *     description: This endpoint adds properties to a portfolio. The user must be authenticated with a valid JWT token.
 *     tags:
 *       - Portfolios
 *     security:
 *       - bearerAuth: []  # Indicates that the route requires Bearer authentication
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the portfolio to add properties to
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               properties:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       201:
 *         description: Properties added to the portfolio successfully
 *       400:
 *         description: Invalid input (missing or incorrect fields)
 *       401:
 *         description: Unauthorized (invalid or missing Bearer token)
 *       404:
 *         description: Portfolio not found
 *       500:
 *         description: Internal server error
 * 
 *   get:
 *     summary: Get all properties in a portfolio
 *     description: This endpoint retrieves all properties in a specific portfolio. The user must be authenticated with a valid JWT token.
 *     tags:
 *       - Portfolios
 *     security:
 *       - bearerAuth: []  # Indicates that the route requires Bearer authentication
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the portfolio to retrieve properties from
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Successfully retrieved all properties in the portfolio
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   propertyId:
 *                     type: string
 *                     example: "123e4567-e89b-12d3-a456-426614174000"
 *       401:
 *         description: Unauthorized (invalid or missing Bearer token)
 *       404:
 *         description: Portfolio not found
 *       500:
 *         description: Internal server error
 * 
 * /portfolios/{id}/activities:
 *   get:
 *     summary: Get all activities of a portfolio
 *     description: This endpoint retrieves all activities related to a specific portfolio. The user must be authenticated with a valid JWT token.
 *     tags:
 *       - Portfolios
 *     security:
 *       - bearerAuth: []  # Indicates that the route requires Bearer authentication
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the portfolio to retrieve activities from
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Successfully retrieved all activities of the portfolio
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   activityType:
 *                     type: string
 *                     example: "PORTFOLIO_CREATED"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-12-01T00:00:00Z"
 *       401:
 *         description: Unauthorized (invalid or missing Bearer token)
 *       404:
 *         description: Portfolio not found
 *       500:
 *         description: Internal server error
 */
