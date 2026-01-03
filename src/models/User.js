import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
    },
    phone: {
        type: String,
    },
    location: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, {
    timestamps: true,
})

export default mongoose.model('User', userSchema);