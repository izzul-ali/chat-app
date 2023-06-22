import { Request, Response } from 'express';
import { UserResponse } from '../types/user';
import { AuthLogin, AuthRegister } from '../types/auth';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import bcr from 'bcrypt';
import response from '../utils/response-api';
import prisma from '../lib/prisma';
import sendRegisterEmailVerification from '../service/verification';

export async function register(req: Request, res: Response) {
  const payload: AuthRegister = req.body;

  if (!payload.name || !payload.email || !payload.provider || !payload.password) {
    return response<null>(res, 400, 'Incomplete register payload', null);
  }

  async function findUser() {
    return await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });
  }

  try {
    if (payload.provider === 'google') {
      const user = await findUser();

      if (user) {
        return response<UserResponse>(res, 200, '', {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        });
      }

      // NOTE: redirect users to set password when register with google
      payload.password = await bcr.hash(String(new Date().getTime()), 16);

      const newUser = await prisma.user.create({
        data: payload,
      });

      return response<UserResponse>(res, 200, '', {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        image: newUser.image,
      });
    }

    if (payload.password.length < 7) {
      return response<null>(res, 400, 'Password must be greater than 7', null);
    }

    const user = await findUser();
    if (user) {
      return response<null>(res, 400, 'User already registered', null);
    }

    // TODO: create custom error
    await sendRegisterEmailVerification(payload);

    return response<string>(res, 200, '', 'Wait for email verification');
  } catch (error) {
    // prisma error documentation
    // https://www.prisma.io/docs/reference/api-reference/error-reference#prisma-client-query-engine

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return response<null>(res, 500, 'Error same token on db', null);
      }
      return response<null>(res, 500, 'Failed to save verification token, code: ' + error.code, null);
    }

    console.log(error);
    return response<null>(res, 500, 'Internal server error', null);
  }
}

export async function login(req: Request, res: Response) {
  const payload: AuthLogin = req.body;

  if (!payload.nameOrEmail || !payload.password) {
    return response<null>(res, 400, 'Incomplete login payload', null);
  }

  try {
    const errorMsg = 'User not found or invalid password';

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            name: payload.nameOrEmail,
          },
          {
            email: payload.nameOrEmail,
          },
        ],
      },
    });

    // when user not found
    if (!user) {
      return response<null>(res, 404, errorMsg, null);
    }

    // compare encript password with payload password
    const match = await bcr.compare(payload.password, user.password);
    if (!match) {
      return response<null>(res, 404, errorMsg, null);
    }

    // TODO: send code verification to user email

    return response<UserResponse>(res, 200, '', {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    });
  } catch (error) {
    console.log(error);
    return response<null>(res, 500, 'Internal server error', null);
  }
}
