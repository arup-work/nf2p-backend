import e from "express";
import { protect } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { updatePasswordChangeSchema, updateProfileSchema } from "../validation/userSchema.js";
import UserController from "../controllers/userController.js";

const userRoute = e.Router();

userRoute.get(
    '/me',
    protect,
    UserController.me
)

userRoute.put(
    '/profile',
    protect,
    validateRequest(updateProfileSchema),
    UserController.updateProfile
)

userRoute.put(
    '/update-password',
    protect,
    validateRequest(updatePasswordChangeSchema),
    UserController.updatePassword
)

export default userRoute;