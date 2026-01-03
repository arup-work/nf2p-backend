import express from 'express';
import authRoute from './auth.route.js';
import userRoute from './user.routes.js';

const Route = express.Router();

Route.use(
    '/auth', authRoute
)
Route.use(
    '/user', userRoute
)

export default Route;