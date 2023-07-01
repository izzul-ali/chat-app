export interface User {
  id: string;
  name: string;
  email: string;
  provider: string;
  image: string;
}

export type SessionUser = {
  id: string;
} & {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
};

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  image: string;
}
