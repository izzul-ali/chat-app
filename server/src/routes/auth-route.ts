import { Router } from 'express';
import { login, register } from '../controller/auth-controller';
import { verifyRegister } from '../controller/verify';

const auth = Router();

auth.post('/register', register);
auth.post('/login', login);
auth.get('/verification/token/:verify', verifyRegister);
// auth.get('/verification/code/:verify', login);

export default auth;
