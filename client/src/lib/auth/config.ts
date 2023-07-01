import { NextAuthOptions } from 'next-auth';
import { cookies } from 'next/headers';
import { Credential } from '../auth/providers';
import { AuthLogin } from '~/types/auth';
import { AxiosError } from 'axios';
import { User, UserResponse } from '~/types/user';
import { ResponseApi } from '~/types/api';
import GoogleProvider from 'next-auth/providers/google';
import axiosInstance from '~/lib/axios';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credential(),
    GoogleProvider({
      name: 'google',
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        // allow user to choose their account each login with google
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ account, user }) {
      // user signin with google
      if (account?.provider === 'google') {
        try {
          const resp = await axiosInstance.post('/auth/login', <AuthLogin>{
            name: user.name,
            email: user.email,
            provider: account.provider,
            image: user.image,
          });

          const data = resp.data as ResponseApi<User>;
          cookies().set({
            name: 'msg_id',
            value: data.data.id,
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 7 * 60 * 60 * 24,
          });

          return true;
        } catch (error) {
          if (error instanceof AxiosError) {
            return `${process.env.NEXTAUTH_URL!}/?error=${error.response?.data.error || error.message}`;
          }
          return `${process.env.NEXTAUTH_URL!}/?error=Failed to continue with google`;
        }
      }

      return true;
    },

    async jwt({ account, token, user }) {
      if (account?.provider === 'credentials') {
        token.user = user;
      } else {
        token.id = account?.access_token;
      }

      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as UserResponse;
      }
      session.user.email = token.email;

      return session;
    },
  },
  pages: {
    signIn: '/',
    signOut: '/chat',
    error: '/',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 60 * 60 * 24, // 7 days
  },
};
