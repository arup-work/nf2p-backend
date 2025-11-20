import User from "../models/User.js"
import bcrypt from 'bcrypt';

// A function check if email is exist in your DB
const emailExists = async (email) => {
    const user = await User.findOne({ email });
    return !!user;
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

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        return {
            user: name, email
        }
    }
}