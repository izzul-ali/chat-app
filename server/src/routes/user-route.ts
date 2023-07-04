import { Router } from 'express';
import { getAllUsers } from '../controller/user-controller';
import MiddlewareAuth from './middleware';

const userRoute = Router();

userRoute.get('/:userId/all', MiddlewareAuth, getAllUsers);

export default userRoute;
