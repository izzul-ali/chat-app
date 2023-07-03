'use server';

import { cookies } from 'next/headers';

export default async function switchTheme(theme: 'light' | 'dark') {
  cookies().set('theme', theme, {
    maxAge: 24 * 60 * 60 * 7,
    httpOnly: true,
    sameSite: 'lax',
  });
}
