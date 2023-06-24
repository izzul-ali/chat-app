import { UserResponse } from '~/types/user';
import { ResponseApi } from '~/types/api';
import { AxiosError, AxiosResponse } from 'axios';
import Credentials from 'next-auth/providers/credentials';
import axiosInstance from '../axios';

export const Credential = () =>
  Credentials({
    name: 'Credentials',
    credentials: {
      guestId: { type: 'text', required: true },
      email: { type: 'email', required: true },
      token_verification: { type: 'text', required: true },
    },
    async authorize(credentials) {
      if (!credentials) throw new Error('Credentials is required');

      try {
        let resp: AxiosResponse;

        // user login with guest account
        if (credentials.guestId) {
          resp = await axiosInstance.post('/auth/login', {
            guestId: credentials.guestId,
            provider: 'credentials',
          });
        }
        // user login with email and send token verification to server
        else {
          if (!credentials.email || !credentials.token_verification) {
            throw new Error('Email and token is required');
          }

          resp = await axiosInstance.get(`/auth/verification/${credentials.email}/${credentials.token_verification}`);
        }

        const data = resp.data as ResponseApi<UserResponse>;

        return { ...data.data };
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(error.response?.data.error || error.message);
        }

        throw error;
      }
    },
  });
