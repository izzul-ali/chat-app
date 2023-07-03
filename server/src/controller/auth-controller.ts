import { Request, Response } from 'express';
import { User, AuthLogin } from '../types/user';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import response from '../utils/response-api';
import prisma from '../lib/prisma';
import sendRegisterEmailVerification from '../service/verification';

export async function login(req: Request, res: Response) {
  const payload: AuthLogin = req.body;

  if (!payload.provider) {
    return response<null>(res, 400, 'Provider is required', null);
  }

  if (payload.provider !== 'credentials' && !payload.email) {
    return response<null>(res, 400, 'Email is required', null);
  }

  async function findUser() {
    const user = await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    return user;
  }

  let regex = new RegExp(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

  try {
    if (payload.provider === 'email') {
      if (!regex.test(payload.email)) return response<null>(res, 400, 'Please enter valid email address', null);

      const user = await findUser();

      // the second parameter to indicate if the user is already registered
      await sendRegisterEmailVerification(payload.email, user !== null);

      return response<string>(res, 200, '', 'Verification email has been sent');
    }

    if (payload.provider === 'google') {
      if (!regex.test(payload.email)) return response<null>(res, 400, 'Please enter a valid email address', null);

      let user: User | null;
      user = await findUser();

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: payload.email,
            name: payload.name || payload.email,
            provider: payload.provider,
            image: payload.image || '',
          },
        });
      }

      return response<User>(res, 200, '', user);
    }

    if (!payload.guestId) {
      return response<null>(res, 400, 'Guest Id is required', null);
    }

    // search guest id
    const guest = await prisma.user.findUnique({
      where: {
        id: payload.guestId,
      },
    });

    if (!guest) {
      return response<null>(res, 404, `Guest with id ${payload.guestId} not found`, null);
    }

    return response<User>(res, 200, '', guest);
  } catch (error) {
    // prisma error documentation
    // https://www.prisma.io/docs/reference/api-reference/error-reference#prisma-client-query-engine

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return response<null>(res, 400, 'Email already exist', null);
      }

      return response<null>(res, 500, 'Failed to save verification token, code: ' + error.code, null);
    }

    const err = <Error>error;
    console.log(err.stack || err.message);

    return response<null>(res, 500, err.message, null);
  }
}
