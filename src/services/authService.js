import User from "../models/User.js"
import bcrypt from 'bcrypt';
import emailQueue from "../utils/emailQueue.js";
import JWT from 'jsonwebtoken';
import crypto from 'crypto';

// A function check if email is exist in your DB
const emailExists = async (email) => {
    const user = await User.findOne({ email });
    return !!user;
}

// User details based on email
const userDetailsByEmail = async (email) => {
    const user = await User.findOne({ email });
    return user;
}

export default class AuthService {
    static async register(firstName, lastName, email, password) {
        const emailAlreadyExist = await emailExists(email);
        if (emailAlreadyExist) {
            throw new Error('Email already exist');
        }

        // Hash the password
        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password, saltRound);

        await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })

        await emailQueue.add({
            email,
            subject: 'Successfully registration complete',
            template: 'registrationSuccessMail.ejs',
            context: { name: firstName }
        })

        return {
            user: firstName, lastName, email
        }
    }

    static async login(email, password) {
        const userDetails = await userDetailsByEmail(email);
        if (!userDetails) {
            throw new Error("Invalid credential");
        }



        // Check password
        const isPasswordMatched = await bcrypt.compare(password, userDetails.password);
        if (!isPasswordMatched) {
            throw new Error("Invalid credential");
        }


        const token = JWT.sign(
            { id: userDetails._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return {
            token,
            user: { id: userDetails._id, firstName: userDetails.firstName, lastName: userDetails.lastName, email: userDetails.email }
        }
    }

    static async forgotPassword(email) {
        const userDetails = await userDetailsByEmail(email);
        if (!userDetails) {
            throw new Error("The selected email is invalid.");
        }

        // Generate secure token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash token before saving (never save plain token)
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        userDetails.resetPasswordToken = hashedToken;
        userDetails.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes;
        userDetails.save();

        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        const context = { resetURL, name: userDetails.name };
        await emailQueue.add({
            email,
            subject: "Password Reset",
            template: 'resetPasswordTemplate.ejs',
            context
        })

        return true;


    }

    static async resetPassword(token, password) {
        if (!token || !password) {
            throw new Error('Token and password are required');
        }

        // Validate password strength
        if (password.length < 8) {
            throw new Error('Password must be at least 8 characters');
        }

        // Hash the incoming token to compare
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() } // not expired
        });

        if (!user) {
            throw new Error("Password reset token is invalid or has expired");
        }

        // Update password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Clear token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        return user;
    }
}