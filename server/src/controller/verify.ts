import { Request, Response } from 'express';
import { UserResponse } from '../types/user';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import jwt from 'jsonwebtoken';
import response from '../utils/response-api';
import prisma from '../lib/prisma';

export async function verifyRegister(req: Request, res: Response) {
  const token = req.params.verify;

  if (!token) {
    return response<null>(res, 400, 'Token is required', null);
  }

  try {
    const jwtPayload = jwt.verify(token, process.env.JWT_SECRET!, { algorithms: ['HS256'] });

    // dont throw error if token verification not found
    const verificationData = await prisma.verification.findUnique({
      where: { token },
    });

    if (!verificationData) {
      return response<null>(res, 404, 'Token verification not found', null);
    }

    async function deleteTokenWithEmail() {
      await prisma.verification.deleteMany({
        where: {
          email: verificationData?.email,
        },
      });
    }

    const tokenPayload: { email: string; expirationDate: Date } = JSON.parse(JSON.stringify(jwtPayload));
    if (tokenPayload.email !== verificationData.email) {
      return response<null>(res, 400, 'Invalid token payload', null);
    }

    const tokenExpired = new Date(tokenPayload.expirationDate).getTime() < new Date().getTime();
    if (tokenExpired) {
      deleteTokenWithEmail();
      return response<null>(res, 400, 'Token has been expired', null);
    }

    // delete token that contain the user email
    deleteTokenWithEmail();

    const newUser = await prisma.user.create({
      data: {
        name: verificationData.name,
        email: verificationData.email,
        password: verificationData.password,
      },
    });

    return response<UserResponse>(res, 200, '', {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      image: newUser.image,
    });
  } catch (error) {
    // prisma error documentation
    // https://www.prisma.io/docs/reference/api-reference/error-reference#prisma-client-query-engine

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return response<null>(res, 400, 'User already registered', null);
      }

      return response<null>(res, 400, 'Failed to verification token, code: ' + error.code, null);
    }

    if (error instanceof jwt.JsonWebTokenError) {
      console.log(error.message);
      return response<null>(res, 400, 'Invalid token', null);
    }

    console.log(error);
    return response<null>(res, 500, 'Internal server error', null);
  }
}
