'use client';

import { signIn } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { FormEvent, useRef, useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { CgSpinner } from 'react-icons/cg';
import { RegisterCookie } from '~/types/auth';
import { RedirectType } from 'next/dist/client/components/redirect';
import { useErrorModal } from '../ErrorModal';

/**
 * Currently not in use
 * This component will be used in the future to set passwords of users who are logged in with google
 *
 * @param user
 * @returns
 */
export default function FormSetPassword({ user }: { user: RegisterCookie }) {
  if (!user.name || !user.email || !user.provider) {
    // set global error
    redirect('/', RedirectType.replace);
  }

  // URL handle
  const route = useRouter();

  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const password = useRef<HTMLInputElement | null>(null);

  const { setError } = useErrorModal();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const resp = await signIn('credentials', {
      username: user.name,
      password: password.current?.value || '',
      email: user.email,
      image: user.image || '',
      provider: user.provider,
      type: 'signup',
      redirect: false,
    });

    if (resp?.error) {
      setError(resp.error);
      setLoading(false);
      return;
    }

    setLoading(false);

    // replace url to chat page
    return route.replace('/chat');
  }

  return (
    <div className="rounded bg-white mx-auto w-[90%] sm:w-96 p-3 font-primary">
      <h1 className="text-gray-700 text-sm sm:text-base font-semibold">
        You should set password, this page only show when you register with new OAuh account
      </h1>

      <form onSubmit={handleSubmit} className="mt-5">
        <fieldset className="flex items-center gap-x-1 px-3 rounded bg-blue-100">
          <input
            required
            type={visiblePassword ? 'text' : 'password'}
            ref={password}
            defaultValue={password.current?.value}
            name="password"
            placeholder="Password"
            className="w-full py-2 bg-transparent placeholder:text-sm"
          />
          <button type="button" className="text-base" onClick={() => setVisiblePassword((prev) => !prev)}>
            {visiblePassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
          </button>
        </fieldset>
        <button
          type="submit"
          className={`mt-3 py-1 px-3 text-center bg-blue-600 shadow-md shadow-blue-200 text-gray-50 rounded text-sm`}
        >
          {loading ? <CgSpinner className={`mx-auto text-base ${loading && 'animate-spin'}`} /> : 'save'}
        </button>
      </form>
    </div>
  );
}
