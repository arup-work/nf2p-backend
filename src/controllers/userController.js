import { success } from "zod";
import userService from "../services/userService.js";
import User from "../models/User.js";

export default class UserController {
    static async me(req, res) {
        try {
            const userDetails = await userService.me(req);
            return res.status(200).json({
                success: true,
                message: "",
                data: userDetails,
                statusCode: 200
            })
        } catch (error) {

        }
    }
    static async updateProfile(req, res) {
        try {
            const userDetails = await userService.updateProfile(req);
            return res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                data: userDetails,
                statusCode: 200
            })
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }
    static async updatePassword(req, res) {
        try {
            await userService.updatePassword(req);
            return res.status(200).json({
                success: true,
                message: "Password updated successfully",
                data: '',
                statusCode: 200
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Server error'
            });
        }
    }
    static async logout(req, res, next) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: 'No refresh token provided' })
        }
        await userService.logout(refreshToken);

        // Clear the refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            path: '/'
        });

        return res.status(200).json({
            message: "You have been logged out",
            data: {},
            statusCode: 200,
            success: true
        })
    }

    static async uploadProfilePicture(req, res, next) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    message: 'No file uploaded',
                    data: {},
                    statusCode: 400,
                    success: false
                })
            }
            await userService.uploadProfilePicture(req);
        } catch (error) {

        }
    }


}