import express from "express"
import { validateRequest } from "../middleware/validateRequest.js";
import { registerSchema } from "../validation/userSchema.js";
import AuthController from "../controllers/AuthController.js";

const authRoute = express.Router();

// Register
authRoute.post(
    '/register',
    validateRequest(registerSchema),
    AuthController.register
)

export default authRoute;