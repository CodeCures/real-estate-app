import express from 'express'
import { validateRequest } from '../validators'
import { propertyCreateValidator } from '../validators/propertyValidator'
import { PropertyController } from '../controllers/PropertyController'
import verifyToken from '../middlewares/jwtMiddleware'

const router = express.Router()

router.post('/',
    verifyToken,
    validateRequest(propertyCreateValidator),
    PropertyController.createProperty
)

router.get('/',
    verifyToken,
    PropertyController.listProperties
)

router.get('/:propertyId',
    verifyToken,
    PropertyController.getPropertyDetails
)

export default router