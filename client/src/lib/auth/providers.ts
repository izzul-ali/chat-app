import { UserResponse } from '~/types/user';
import { AuthRegister } from '~/types/auth';
import { ResponseApi } from '~/types/api';
import { AxiosError, AxiosResponse } from 'axios';
import Credentials from 'next-auth/providers/credentials';
import axiosInstance from '../axios';

export const Credential = () =>
  Credentials({
    name: 'Auth',
    credentials: {
      username: { type: 'text', placeholder: 'Username', required: true },
      email: { type: 'email', placeholder: 'Email', required: true },
      password: { type: 'password', placeholder: 'Password', required: true },
      type: { type: 'text', required: true },
      codeVerification: { type: 'text' },
    },
    async authorize(credentials) {
      if (!credentials || !credentials.type) throw new Error('Credentials is required');

      // SignUp
      if (credentials?.type === 'signup') {
        if (!credentials.username || !credentials.email) throw new Error('Username and Email is required');
        if (credentials?.password.length < 7) throw new Error('Password cannot less than 7');

        let user: AuthRegister = {
          name: credentials.username,
          email: credentials.email,
          password: credentials.password,
          provider: 'credentials',
        };

        return {
          id: user.email,
          isAuth: false,
          user,
        };
      }

      // SignIn
      if (credentials.type === 'signin') {
        if (!credentials.username) throw new Error('Username is required');
        if (credentials?.password.length < 7) throw new Error('Password cannot less than 7');

        try {
          const resp = await axiosInstance.post('/auth/login', {
            nameOrEmail: credentials.username,
            password: credentials.password,
          });
          const data = resp.data as ResponseApi<UserResponse>;

          return { ...data.data, user: data.data, isAuth: data.data.id !== '' };
        } catch (error) {
          if (error instanceof AxiosError) {
            throw new Error(error.response?.data.error || error.message);
          }

          throw error;
        }

        // When using code verification email
        // return {
        //   id: credentials.email,
        //   isAuth: false,
        //   user: { nameOrEmail: credentials.username, password: credentials.password } as AuthLogin,
        // };
      }

      //  verify token to server
      if (credentials.type === 'token-verification') {
        if (!credentials.codeVerification) {
          throw new Error('Token is required');
        }

        try {
          const resp = (await axiosInstance.get(
            `/auth/verification/token/${credentials.codeVerification}`
          )) as AxiosResponse<UserResponse>;

          return { user: resp.data, isAuth: resp.data.id !== '', ...resp.data };
        } catch (error) {
          if (error instanceof AxiosError) {
            throw new Error(error.response?.data.error || error.message);
          }

          throw error;
        }
      }

      return null;
    },
  });
