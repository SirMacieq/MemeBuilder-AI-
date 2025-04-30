import express from 'express';
import { userRouter } from './user/userRoutes';

export const router = express.Router()

router.use('/user', userRouter)