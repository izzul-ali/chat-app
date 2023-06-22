'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function VerificationPage({ params }: { params: { slug: string } }) {
  const route = useRouter();

  async function sendToken(token: string) {
    const resp = await signIn('credentials', {
      codeVerification: token,
      type: 'token-verification',
      redirect: false,
    });

    if (resp?.error) {
      return route.replace(`http://localhost:3000/?error=${resp.error}`);
    }

    return route.replace('/chat');
  }

  useEffect(() => {
    sendToken(params.slug);
  }, []);

  return <></>;
}
