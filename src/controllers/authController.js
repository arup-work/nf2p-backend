import AuthService from "../services/authService.js";

export default class AuthController{
    static async register(req, res, next) {
        try {
            const { name, email, password} = req.body;
            const registrationDetails = await AuthService.register(name, email, password);
            return res.status(200).json({
                message: "Congratulations! Your registration is successful",
                user: registrationDetails.user,
                statusCode: 200
            })
        } catch (error) {
            if (error.message = "Email is already taken") {
                return res.status(400).json({ statusCode: 400, message: error.message });
            }
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
}