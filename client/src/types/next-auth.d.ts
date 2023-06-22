import NextAuth from 'next-auth';
import { AuthLogin, AuthRegister, UserResponse } from './user';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    user: AuthRegister | AuthLogin | UserResponse;
    isAuth: boolean;
  }
}
