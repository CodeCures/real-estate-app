/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /{agentId}/message:
 *   post:
 *     summary: Send a chat message
 *     description: This endpoint allows authenticated users to send a chat message. Requires a valid JWT token.
 *     tags:
 *       - ChatBot
 *     security:
 *       - bearerAuth: []  # Indicates that the route requires Bearer authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              text:
 *                type: string
 *                example: "give me performance insight of all my properties"
 *              
 *     responses:
 *       200:
 *         description: Chat message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Response to your inquiry"
 *       400:
 *         description: Bad request (missing or invalid data)
 *       401:
 *         description: Unauthorized (invalid or missing Bearer token)
 *       500:
 *         description: Internal server error
 */
