'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { RedirectType } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';

export default function SessionAuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export function RequiredAuth({
  isRequiredAuth,
  isRequiredUnAuth,
  children,
}: {
  isRequiredAuth: boolean;
  isRequiredUnAuth: boolean;
  children: React.ReactNode;
}) {
  const { status } = useSession({ required: isRequiredAuth });

  if (isRequiredAuth) {
    if (status === 'authenticated') {
      return <>{children}</>;
    }

    redirect('/', RedirectType.replace);
  }

  if (isRequiredUnAuth) {
    if (status === 'authenticated') {
      redirect('/chat', RedirectType.replace);
    }

    return <>{children}</>;
  }
}
