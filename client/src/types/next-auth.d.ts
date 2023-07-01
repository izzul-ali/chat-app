import NextAuth, { DefaultSession } from 'next-auth';
import { UserResponse } from './user';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User extends UserResponse {}
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}
