'use client';

import { signIn } from 'next-auth/react';
import { notFound, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function VerifyPage({ params }: { params: { slug: string[] } }) {
  if (params.slug.length !== 2) {
    return notFound();
  }

  const route = useRouter();

  async function handleVerification() {
    const resp = await signIn('credentials', {
      email: params.slug[0],
      token_verification: params.slug[1],
      redirect: false,
    });

    if (resp?.error) {
      return route.replace(`/?error=${resp.error}`);
    }

    return route.replace('/chat');
  }

  useEffect(() => {
    handleVerification();
  }, []);

  return <div>Loading</div>;
}
