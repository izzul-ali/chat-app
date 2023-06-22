export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  provider: string;
  image: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  image: string;
}
