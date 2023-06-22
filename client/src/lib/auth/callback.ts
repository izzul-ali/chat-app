import { User } from 'next-auth';
import { AuthLogin, AuthRegister } from '~/types/auth';
import { AxiosError } from 'axios';
import axiosInstance from '../axios';

export default async function credentialsCallback(user: User) {
  const appHost = process.env.NEXTAUTH_URL!;

  try {
    await parseAndTurnResponse(user);
    // const data = resp.data as ResponseApi<string>;

    return appHost;
  } catch (error) {
    if (error instanceof AxiosError) return `${appHost}/?error=${error.response?.data.error || error.message}`;
    const err = error as Error;

    return `${appHost}/?error=${err.message}`;
  }
}

async function parseAndTurnResponse(usrReq: User) {
  const usr = usrReq.user;

  if ((<AuthRegister>usr).provider) {
    return await axiosInstance.post('/auth/register', usr as AuthRegister);
  }

  // when required code verification
  if ((<AuthLogin>usr).nameOrEmail) {
    return await axiosInstance.post('/auth/login', usr as AuthLogin);
  }

  throw new Error('Error: Typeof User is not define');
}
