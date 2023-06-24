import { Router } from 'express';
import { login } from '../controller/auth-controller';
import { verifyRegister } from '../controller/verify';

const auth = Router();

auth.post('/login', login);
auth.get('/verification/:email/:token', verifyRegister);

export default auth;
