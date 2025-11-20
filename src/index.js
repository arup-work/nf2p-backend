import express from "express";
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Route from "./routes/index.js";


dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Routes
app.use('/api/v1', Route);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running in ${PORT}`);
})