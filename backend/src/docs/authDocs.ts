/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registers a new user
 *     description: This endpoint registers a new user and returns a success message or validation errors.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               name:
 *                 type: string
 *                 example: John Doe
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input (email already exists or other validation errors)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Logs in an existing user
 *     description: This endpoint allows a user to log in using their email and password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully, returns a JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "d9b5f05d-bbb9-4acb-a313-e4d2c5e85d56"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *       400:
 *         description: Invalid input (email or password missing, or invalid format)
 *       401:
 *         description: Unauthorized (invalid credentials)
 *       500:
 *         description: Internal server error
 */
