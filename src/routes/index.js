import express from 'express';
import authRoute from './auth.route.js';

const Route = express.Router();

Route.use(
    '/auth', authRoute
)

export default Route;