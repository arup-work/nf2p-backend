import e from "express";
import { protect } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { updatePasswordChangeSchema, updateProfileSchema } from "../validation/userSchema.js";
import UserController from "../controllers/userController.js";
import upload from "../middleware/upload.js";

const userRoute = e.Router();

userRoute.get(
    '/me',
    protect,
    UserController.me
)

userRoute.put(
    '/profile',
    protect,
    // validateRequest(updateProfileSchema),
    UserController.updateProfile
)

userRoute.post(
    '/profile-picture',
    protect,
    upload.single('profilePicture'),
    UserController.uploadProfilePicture
)

userRoute.put(
    '/update-password',
    protect,
    validateRequest(updatePasswordChangeSchema),
    UserController.updatePassword
)

userRoute.post(
    '/logout',
    protect,
    UserController.logout
)

export default userRoute;