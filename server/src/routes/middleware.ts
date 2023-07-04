import { Request, Response, NextFunction } from 'express';
import response from '../utils/response-api';

export default async function MiddlewareAuth(req: Request, res: Response, next: NextFunction) {
  const cookie = req.cookies;
  const token: string = cookie['next-auth.session-token'];

  if (!token) {
    return response<null>(res, 401, 'Unauthorization token not found', null);
  }

  return next();
}
