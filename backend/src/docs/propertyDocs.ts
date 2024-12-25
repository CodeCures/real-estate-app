/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /properties:
 *   post:
 *     summary: Creates a new property
 *     description: This endpoint creates a new property. The user must be authenticated with a valid JWT token.
 *     tags:
 *       - Properties
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
 *                 example: "Luxury Apartment"
 *               description:
 *                 type: string
 *                 example: "A beautiful luxury apartment with city views."
 *               type:
 *                 type: string
 *                 enum:
 *                   - RESIDENTIAL
 *                   - COMMERCIAL
 *                   - INDUSTRIAL
 *                   - LAND
 *                   - MULTI_FAMILY
 *                   - SINGLE_FAMILY
 *                 example: "RESIDENTIAL"
 *               address:
 *                 type: string
 *                 example: "123 Main St"
 *               city:
 *                 type: string
 *                 example: "New York"
 *               state:
 *                 type: string
 *                 example: "NY"
 *               country:
 *                 type: string
 *                 example: "USA"
 *               zipCode:
 *                 type: string
 *                 example: "10001"
 *               purchasePrice:
 *                 type: number
 *                 example: 500000
 *               currentValue:
 *                 type: number
 *                 example: 550000
 *               rentalStatus:
 *                 type: string
 *                 enum:
 *                   - VACANT
 *                   - LEASED
 *                   - NOTICE_GIVEN
 *                 example: "VACANT"
 *               monthlyRent:
 *                 type: number
 *                 example: 2000
 *               purchaseDate:
 *                 type: string
 *                 format: date
 *                 example: "2023-12-01"
 *     responses:
 *       201:
 *         description: Property created successfully
 *       400:
 *         description: Invalid input (missing or incorrect fields)
 *       401:
 *         description: Unauthorized (invalid or missing Bearer token)
 *       500:
 *         description: Internal server error
 * 
 *   get:
 *     summary: Lists all properties
 *     description: This endpoint retrieves a list of all properties. The user must be authenticated with a valid JWT token.
 *     tags:
 *       - Properties
 *     security:
 *       - bearerAuth: []  # Indicates that the route requires Bearer authentication
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of properties
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
 *                     example: "Luxury Apartment"
 *                   address:
 *                     type: string
 *                     example: "123 Main St"
 *                   city:
 *                     type: string
 *                     example: "New York"
 *                   status:
 *                     type: string
 *                     enum:
 *                       - AVAILABLE
 *                       - OCCUPIED
 *                       - UNDER_RENOVATION
 *                       - SOLD
 *                       - PENDING
 *                     example: "AVAILABLE"
 *       401:
 *         description: Unauthorized (invalid or missing Bearer token)
 *       500:
 *         description: Internal server error
 * 
 * /properties/{propertyId}:
 *   get:
 *     summary: Retrieves details of a specific property
 *     description: This endpoint retrieves the details of a specific property. The user must be authenticated with a valid JWT token.
 *     tags:
 *       - Properties
 *     security:
 *       - bearerAuth: []  # Indicates that the route requires Bearer authentication
 *     parameters:
 *       - name: propertyId
 *         in: path
 *         required: true
 *         description: The ID of the property to retrieve
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Successfully retrieved the property details
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
 *                   example: "Luxury Apartment"
 *                 description:
 *                   type: string
 *                   example: "A beautiful luxury apartment with city views."
 *       401:
 *         description: Unauthorized (invalid or missing Bearer token)
 *       404:
 *         description: Property not found
 *       500:
 *         description: Internal server error
 */
