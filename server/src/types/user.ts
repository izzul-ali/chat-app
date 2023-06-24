export interface User {
  id: string;
  name: string;
  email: string;
  provider: string;
  image: string;
}

export interface AuthLogin {
  guestId?: string;
  name: string;
  email: string;
  provider: string;
  image?: string;
}
