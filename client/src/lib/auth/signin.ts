import axios from 'axios';
import { signOut } from 'next-auth/react';
import { ResponseApi } from '~/types/api';
import { User } from '~/types/user';
import axiosInstance from '../axios';

export async function handleLogout() {
  window.sessionStorage.removeItem('guest-identity');
  await axios.delete('http://localhost:3000/api');
  await signOut({ callbackUrl: '/' });
}

export async function handleGuestLogin(guestId: string) {
  const resp = await axiosInstance.post('/auth/login', {
    guestId: guestId,
    provider: 'credentials',
  });

  // set guest data to session storage
  const data = resp.data as ResponseApi<User>;
  window.sessionStorage.setItem('guest-identity', JSON.stringify(data.data));

  return data.data;
}
