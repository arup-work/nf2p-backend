import User from "../models/User.js";
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';


export default class userService {
    static async me(req) {
        const userId = req.user._id;
        try {
            const user = await User.findById(userId).select(
                '-password -createdAt -updatedAt -__v -resetPasswordExpires -resetPasswordToken'
            );
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return user;
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async updateProfile(req) {
        const { firstName, lastName, bio, phone, location, currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        try {
            const user = await User.findById(userId).select(
                '-password -createdAt -updatedAt -__v -resetPasswordExpires -resetPasswordToken'
            );
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Update
            if (firstName) user.firstName = firstName;
            if (lastName) user.lastName = lastName;
            if (bio) user.bio = bio;
            if (phone) user.phone = phone;
            if (location) user.location = location;

            // Change password (only if both provided)
            if (currentPassword && newPassword) {
                const isMatch = await bcrypt.compare(currentPassword, user.password);
                if (!isMatch) {
                    return res.status(400).json({
                        message: 'Current password is incorrect'
                    })
                }

                // Hash the password
                const saltRound = 10;
                user.password = await bcrypt.hash(password, saltRound);
            }

            await user.save();
            return user;


        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async updatePassword(req) {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId).select('+password');

        if (!user) {
            throw new Error('User not found');
        }

        if (!currentPassword || !newPassword) {
            throw new Error('Both passwords are required');
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            throw new Error('Current password is incorrect');
        }

        const saltRound = 10;
        user.password = await bcrypt.hash(newPassword, saltRound);

        await user.save();
        return true;
    }

    static async logout(refreshToken) {
        // Verify it still exists / is valid
        try {
            //Verify the refresh token
            const decoded = JWT.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            return true;
        } catch (error) {
            // If refresh token is already invalid/expired → just clear cookie
            res.clearCookie('refreshToken',{ httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
            throw new Error("Logged out successfully");
        }
    }

}