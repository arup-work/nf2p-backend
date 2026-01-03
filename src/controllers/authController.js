import AuthService from "../services/authService.js";

export default class AuthController {
    static async register(req, res, next) {
        try {
            const { firstName, lastName, email, password } = req.body;
            const registrationDetails = await AuthService.register(firstName, lastName, email, password);
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

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const loginDetails = await AuthService.login(email, password);
            return res.status(200).json({
                message: "Login successfully",
                data: {
                    user: loginDetails.user,
                    token: loginDetails.token,
                },
                statusCode: 200,
            })
        } catch (error) {
            if (error.message === "Invalid credential") {
                return res.status(400).json({ statusCode: 400, message: error.message });
            }
            res.status(500).json({ statusCode: 500, message: 'Server error', error: error.message });
        }
    }

    static async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            const forgotPassword = await AuthService.forgotPassword(email);
            return res.status(200).json({
                message: 'A password reset link has been sent to your registered email address.',
                statusCode: 2000
            });
        } catch (error) {
            res.status(500).json({ statusCode: 500, message: error.message, error: error.message });
        }
    }

    static async resetPassword(req, res, next) {
        try {
            const { token } = req.params;
            const { password } = req.body;
            await AuthService.resetPassword(token, password);
            return res.status(200).json({
                message: 'Password reset successful',
                statusCode: 2000
            });
        } catch (error) {
            return res.status(400).json({ statusCode: 400, message: error.message });
        }
    }
}