export interface AuthRegister {
  name: string;
  email: string;
  password: string;
  provider: string;
  image?: string;
}

export interface AuthLogin {
  nameOrEmail: string;
  password: string;
}

export interface AuthVerification {
  token: string;
}

export type RegisterCookie = Omit<AuthRegister, 'password'>;
