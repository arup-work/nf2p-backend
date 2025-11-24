import User from "../models/User.js"
import bcrypt from 'bcrypt';
import emailQueue from "../utils/emailQueue.js";
import JWT from 'jsonwebtoken';

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
    static async register(name, email, password) {
        const emailAlreadyExist = await emailExists(email);
        if (emailAlreadyExist) {
            throw new Error('Email already exist');
        }

        // Hash the password
        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password, saltRound);

        await User.create({
            name,
            email,
            password: hashedPassword
        })

        await emailQueue.add({
            email,
            subject: 'Successfully registration complete',
            template: 'registrationSuccessMail.ejs',
            context: { name }
        })

        return {
            user: name, email
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
            throw new Error("Invalid credentiallll");
        }


        const token = JWT.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return {
            token,
            user: { id: userDetails._id, name: userDetails.name, email: userDetails.email }
        }
    }
}