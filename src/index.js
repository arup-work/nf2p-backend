import express from "express";
import dotenv from 'dotenv';
import connectDB from './config/db.js';


dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send("API is running");
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running in ${PORT}`);
})