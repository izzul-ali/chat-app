'use client';

import { signIn, signOut } from 'next-auth/react';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { CgSpinner } from 'react-icons/cg';
import ErrorModal from '../ErrorModal';

export default function AuthForm() {
  const [showModalVerification, setShowModalVerification] = useState<boolean>(false);
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // form input
  const username = useRef<HTMLInputElement | null>(null);
  const email = useRef<HTMLInputElement | null>(null);
  const password = useRef<HTMLInputElement | null>(null);

  // URL handle
  const route = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    // get error message from url params
    setError(params.get('error') || '');

    // after get error message, the error params must be cleared
    route.replace('/');
  }, []);

  useEffect(() => {
    clearState();
  }, [isRegister]);

  const clearState = useCallback(() => {
    if (!username.current || !email.current || !password.current) {
      return;
    }

    username.current.value = '';
    password.current.value = '';

    setError('');
    setLoading(false);
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    if (!username.current || !password.current) {
      return;
    }

    const resp = await signIn('credentials', {
      username: username.current.value, // when login username can be contain an email
      email: email.current?.value || '', // email can be null when login
      password: password.current.value,
      type: isRegister ? 'signup' : 'signin',
      redirect: false,
    });

    if (resp?.error) {
      setError(resp.error);
      setLoading(false);
      return;
    }

    // clear input form
    clearState();
    setLoading(false);

    if (isRegister) {
      setShowModalVerification(true);
      return;
    }

    route.replace('/chat');
  }

  return (
    <>
      {error && <ErrorModal message={error} clear={setError} />}
      {showModalVerification ? (
        <div className="w-4/5 sm:w-72 p-5 text-sm text-gray-800 font-semibold rounded bg-white text-center">
          <p>We has been send verification to your email, please check your email to continue</p>
          <button
            onClick={() => setShowModalVerification(false)}
            className="block px-4 py-1 bg-blue-600 text-white rounded mt-6 mx-auto"
          >
            OK
          </button>
        </div>
      ) : (
        <div className="w-72 px-6 py-8 rounded-md bg-white shadow-lg shadow-blue-200">
          <button
            aria-label="btn-signout"
            className="block mb-3 mx-auto w-fit"
            onClick={async () => await signOut({ redirect: false, callbackUrl: '/' })}
          >
            Sign Out
          </button>

          <div className="flex items-center justify-evenly gap-x-4 text-sm text-gray-600 font-semibold mb-6">
            <button
              aria-label="btn-signin"
              onClick={() => setIsRegister(false)}
              type="button"
              className={`w-1/2 py-2 rounded-lg ${isRegister && 'bg-blue-100'}`}
            >
              <p className={`${isRegister ? '' : 'border-b-2 border-blue-500 text-blue-600'}  w-fit mx-auto`}>
                Sign in
              </p>
            </button>
            <button
              aria-label="btn-signup"
              onClick={() => setIsRegister(true)}
              type="button"
              className={`w-1/2 py-2 rounded-lg ${!isRegister && 'bg-blue-100'}`}
            >
              <p className={`${!isRegister ? '' : 'border-b-2 border-blue-500 text-blue-600'}  w-fit mx-auto`}>
                Sign Up
              </p>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="text-gray-600 text-base flex flex-col font-semibold">
            <input
              required
              type="text"
              ref={username}
              defaultValue={username.current?.value}
              name="username"
              placeholder={isRegister ? 'Username' : 'Username or Email'}
              className="py-2 px-3 rounded bg-blue-100 placeholder:text-sm mb-3"
            />

            {isRegister && (
              <input
                required
                type="email"
                ref={email}
                defaultValue={email.current?.value}
                name="email"
                placeholder="Email"
                className="py-2 px-3 rounded bg-blue-100 placeholder:text-sm mb-3"
              />
            )}

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
              <button
                aria-label="btn-show-password"
                type="button"
                className="text-base"
                onClick={() => setVisiblePassword((prev) => !prev)}
              >
                {visiblePassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </button>
            </fieldset>

            <button
              aria-label="btn-submit"
              type="submit"
              className={`block mt-5 py-2 text-center bg-blue-600 shadow-md shadow-blue-200 text-gray-50 rounded text-xs`}
            >
              {loading ? (
                <CgSpinner className={`mx-auto text-base ${loading && 'animate-spin'}`} />
              ) : isRegister ? (
                'SIGN UP'
              ) : (
                ' SIGN IN'
              )}
            </button>
          </form>

          <div className="flex gap-x-2 items-center my-4">
            <span className="inline-block bg-gray-300 w-full h-[1px] rounded"></span>
            <p className="text-xs text-gray-600 whitespace-nowrap">or {isRegister ? 'Sign Up' : 'Sign In'} with</p>
            <span className="inline-block bg-gray-300 w-full h-[1px] rounded"></span>
          </div>

          <button
            aria-label="btn-signin-google"
            onClick={() => signIn('google', { callbackUrl: '/chat' })}
            type="button"
            className="w-full py-2 flex items-center text-sm text-gray-50 font-semibold justify-center gap-x-2 bg-blue-600 rounded hover:bg-blue-500 hover:shadow-md hover:shadow-gray-300 transition-all duration-100"
          >
            <FcGoogle />
            <p>Google</p>
          </button>
        </div>
      )}
    </>
  );
}
