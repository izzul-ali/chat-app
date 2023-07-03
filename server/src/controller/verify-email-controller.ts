import { Request, Response } from 'express';
import { User } from '../types/user';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { verifyJwtToken } from '../service/token';
import jwt from 'jsonwebtoken';
import response from '../utils/response-api';
import prisma from '../lib/prisma';

export async function verifyRegister(req: Request, res: Response) {
  const { email, token } = req.params;

  if (!email || !token) {
    return response<null>(res, 400, 'Email and Token is required', null);
  }

  try {
    const jwtPayload = verifyJwtToken(token, process.env.JWT_VERIFY_SECRET);

    // dont throw error if token verification not found
    const verificationData = await prisma.verification.findFirst({
      where: {
        email,
        token,
      },
    });

    if (!verificationData) {
      return response<null>(res, 404, 'Token verification not found', null);
    }

    async function deleteTokenWithEmail() {
      await prisma.verification.deleteMany({
        where: { email },
      });
    }

    const tokenPayload: { email: string; expirationDate: Date } = JSON.parse(JSON.stringify(jwtPayload));
    const tokenExpired = new Date(tokenPayload.expirationDate).getTime() < new Date().getTime();

    if (tokenExpired) {
      deleteTokenWithEmail();
      return response<null>(res, 400, 'Token has been expired', null);
    }

    // delete token that contain the user email
    deleteTokenWithEmail();

    let user: User | null;

    if (verificationData.isRegister) {
      user = await prisma.user.findUnique({ where: { email: verificationData.email } });
    } else {
      user = await prisma.user.create({
        data: {
          email: email,
          name: email,
          provider: 'email',
        },
      });
    }

    if (user) {
      return response<User>(res, 200, '', user);
    }

    return response<null>(res, 500, 'Failed to verification user', user);
  } catch (error) {
    // prisma error documentation
    // https://www.prisma.io/docs/reference/api-reference/error-reference#prisma-client-query-engine

    if (error instanceof PrismaClientKnownRequestError) {
      return response<null>(res, 400, 'Failed to verification token, code: ' + error.code, null);
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return response<null>(res, 400, 'Invalid token', null);
    }

    const err = <Error>error;
    console.log(err.stack || err.message);

    return response<null>(res, 500, 'Internal server error', null);
  }
}
