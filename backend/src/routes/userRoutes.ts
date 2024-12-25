import express from "express";
import verifyToken from "../middlewares/jwtMiddleware";
import { UserController } from "../controllers/UserController";
import { UserProperyController } from "../controllers/UserPropertyController";
const router = express.Router();

router.get("/", verifyToken, UserController.listUsers);
router.get("/:userId", verifyToken, UserController.getUserDetails);
router.patch("/:userId", verifyToken, UserController.updateUserDetails);
router.delete("/:userId", verifyToken, UserController.deleteUser);
router.get("/:userId/properties", verifyToken, UserProperyController.listProperties);

export default router;