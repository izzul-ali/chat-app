export interface Verification {
  id?: number;
  name: string;
  email: string;
  password: string;
  token: string;
  created_at: Date;
}

export interface AuthRegister {
  name: string;
  email: string;
  password: string;
  provider: string;
}

export interface AuthLogin {
  nameOrEmail: string;
  password: string;
}
