'use client';

import { signIn } from 'next-auth/react';
import { notFound, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Icon from '~/components/Icon';

export default function VerifyPage({ params }: { params: { slug: string[] } }) {
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
    if (params.slug.length !== 2) {
      return notFound();
    }

    handleVerification();
  }, [params.slug]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <Icon width="200px" height="200px" />
    </div>
  );
}
