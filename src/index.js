import express from "express";
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Route from "./routes/index.js";
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000"}))

// Routes
app.use('/api/v1', Route);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running in ${PORT}`);
})