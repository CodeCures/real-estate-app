/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /users:
 *   get:
 *     summary: List all users
 *     description: This endpoint retrieves a list of all users. The user must be authenticated with a valid JWT token.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []  # Indicates that the route requires Bearer authentication
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "123e4567-e89b-12d3-a456-426614174000"
 *                   email:
 *                     type: string
 *                     example: "user@example.com"
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *                   role:
 *                     type: string
 *                     enum:
 *                       - INVESTOR
 *                       - LANDLORD
 *                       - TENANT
 *                       - ADMIN
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-12-01T00:00:00Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-12-02T00:00:00Z"
 *       401:
 *         description: Unauthorized (invalid or missing Bearer token)
 *       500:
 *         description: Internal server error
 * 
 * /users/{userId}:
 *   get:
 *     summary: Get details of a specific user
 *     description: This endpoint retrieves details of a specific user by user ID. The user must be authenticated with a valid JWT token.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []  # Indicates that the route requires Bearer authentication
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user to retrieve
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 role:
 *                   type: string
 *                   enum:
 *                     - INVESTOR
 *                     - LANDLORD
 *                     - TENANT
 *                     - ADMIN
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
 *         description: User not found
 *       500:
 *         description: Internal server error
 * 
 *   patch:
 *     summary: Update user details
 *     description: This endpoint updates the details of a specific user. The user must be authenticated with a valid JWT token.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []  # Indicates that the route requires Bearer authentication
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user to update
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
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               role:
 *                 type: string
 *                 enum:
 *                   - INVESTOR
 *                   - LANDLORD
 *                   - TENANT
 *                   - ADMIN
 *                 example: "ADMIN"
 *     responses:
 *       200:
 *         description: User details updated successfully
 *       400:
 *         description: Invalid input (missing or incorrect fields)
 *       401:
 *         description: Unauthorized (invalid or missing Bearer token)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 * 
 *   delete:
 *     summary: Delete a user
 *     description: This endpoint deletes a user. The user must be authenticated with a valid JWT token.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []  # Indicates that the route requires Bearer authentication
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user to delete
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized (invalid or missing Bearer token)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 * 
 * /users/{userId}/properties:
 *   get:
 *     summary: Get properties owned by the user
 *     description: This endpoint retrieves properties owned by a specific user. The user must be authenticated with a valid JWT token.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []  # Indicates that the route requires Bearer authentication
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user to retrieve properties for
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Successfully retrieved the properties owned by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "123e4567-e89b-12d3-a456-426614174000"
 *                   name:
 *                     type: string
 *                     example: "Green Villa"
 *                   type:
 *                     type: string
 *                     enum:
 *                       - RESIDENTIAL
 *                       - COMMERCIAL
 *                       - INDUSTRIAL
 *                       - LAND
 *                       - MULTI_FAMILY
 *                       - SINGLE_FAMILY
 *                   status:
 *                     type: string
 *                     enum:
 *                       - AVAILABLE
 *                       - OCCUPIED
 *                       - UNDER_RENOVATION
 *                       - SOLD
 *                       - PENDING
 *                   rentalStatus:
 *                     type: string
 *                     enum:
 *                       - VACANT
 *                       - LEASED
 *                       - NOTICE_GIVEN
 *       401:
 *         description: Unauthorized (invalid or missing Bearer token)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
