import { NextAuthOptions } from 'next-auth';
import { Credential } from '../auth/providers';
import { AuthLogin } from '~/types/auth';
import { AxiosError } from 'axios';
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
          await axiosInstance.post('/auth/login', <AuthLogin>{
            name: user.name,
            email: user.email,
            provider: account.provider,
            image: user.image,
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
        token.id = user?.id;
      } else {
        token.id = account?.access_token;
      }

      return token;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 60 * 60 * 24, // 7 days
  },
};
