import { success } from "zod";
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
            
            // Set httpOnly refresh token cookie
            res.cookie('refreshToken', loginDetails.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                path: '/'
            })
            return res.status(200).json({
                message: "Login successfully",
                data: {
                    user: loginDetails.user,
                    token: loginDetails.accessToken,
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

    static async refresh(req, res, next) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.status(401).json({
                    message: 'No refresh token provided',
                    data: {},
                    success: false
                })
            }
            const userDetails = await AuthService.refresh(refreshToken);
            // Set new refresh cookie
            res.cookie('refreshToken', userDetails.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000 //30 days
            })

            return res.status(200).json({
                message: "Access token successfully refreshed",
                data: {
                    user: userDetails.user,
                    token: userDetails.accessToken,
                },
                statusCode: 200,
                success: true
            })
        } catch (error) {
            res.clearCookie('refreshToken');
            return res.status(401).json({
                message: 'Invalid or expired refresh token',
                data: {},
                success: false
            })
        }
    }
}