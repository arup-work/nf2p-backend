import express from "express"
import { validateRequest } from "../middleware/validateRequest.js";
import { forgotPasswordSchema, loginSchema, registerSchema } from "../validation/userSchema.js";
import AuthController from "../controllers/authController.js";

const authRoute = express.Router();

// Register
authRoute.post(
    '/register',
    validateRequest(registerSchema),
    AuthController.register
)
// Login
authRoute.post(
    '/login',
    validateRequest(loginSchema),
    AuthController.login
)
// Forgot password
authRoute.post(
    '/forgot-password',
    validateRequest(forgotPasswordSchema),
    AuthController.forgotPassword
)

export default authRoute;