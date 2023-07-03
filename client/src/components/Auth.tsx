'use client';

import { signIn } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AiOutlineGoogle } from 'react-icons/ai';
import { CgSpinner } from 'react-icons/cg';
import { useErrorModal } from './ErrorModal';
import { AnimatePresence, Variants, motion } from 'framer-motion';
import { AxiosError } from 'axios';
import { handleGuestLogin } from '~/lib/auth/signin';
import { useCurrentUser } from '~/hooks/useUser';
import axiosInstance from '~/lib/axios';

const variant: Variants = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};

export default function LoginAuthentication({ isAuthenticate }: { isAuthenticate: boolean }) {
  const { setError } = useErrorModal();
  const { setCurrentUser } = useCurrentUser();

  const [showModalVerification, setShowModalVerification] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [inputError, setInputError] = useState<{ email?: string; guest?: string }>({});

  // URL handle
  const route = useRouter();
  const params = useSearchParams();

  // form input
  const email = useRef<HTMLInputElement | null>(null);
  const guestId = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setError(params.get('error') || '');
    route.replace('/');
  }, []);

  useEffect(() => {
    setInputError({ email: '', guest: '' });
  }, [showModalVerification]);

  async function handleSubmit(type: 'email' | 'guest') {
    try {
      if (type === 'email') {
        if (!email.current?.value) {
          setInputError({ email: 'Please enter an email address for login' });
          return;
        }
        setLoading(true);

        const data = new URLSearchParams({
          email: email.current.value,
          provider: 'email',
        });

        await axiosInstance.post('/auth/login', data, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        setLoading(false);
        setShowModalVerification(true);
        return;
      }

      if (!guestId.current?.value) {
        setInputError({ guest: 'Please enter guest id for login' });
        return;
      }
      setLoading(true);

      const guest = await handleGuestLogin(guestId.current.value);
      setCurrentUser(guest);

      setLoading(false);
      return route.push('/chat');
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.message === 'Network Error') {
          setError(error.message);
          setLoading(false);
          return;
        }

        if (type === 'email') {
          setInputError({ email: error.response?.data.error || error.message });
        } else {
          setInputError({ guest: error.response?.data.error || error.message });
        }

        setLoading(false);
        return;
      }

      const err = error as Error;

      setError(err.message);
      setLoading(false);

      return;
    }
  }

  return (
    <AnimatePresence>
      {!showModalVerification && (
        <motion.div
          key="box"
          variants={variant}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.7, type: 'spring', stiffness: 100 }}
          className="flex flex-col relative items-center w-72 mt-24"
        >
          <motion.div
            key="logo"
            variants={variant}
            initial="initial"
            animate="animate"
            transition={{ type: 'spring', delay: 0.1 }}
            className="w-24 h-24 rounded-full bg-blue-400 mb-3"
          ></motion.div>
          <motion.h1
            key="title"
            variants={variant}
            initial="initial"
            animate="animate"
            transition={{ type: 'spring', delay: 0.122 }}
            className="text-xl font-semibold text-gray-700 dark:text-gray-300"
          >
            Login to ChatApp
          </motion.h1>

          {isAuthenticate && (
            <motion.div
              key="guest-box"
              layout
              variants={variant}
              initial="initial"
              animate="animate"
              transition={{ type: 'spring', delay: 0.1 }}
              className="mt-5 text-sm dark:text-gray-300 w-full"
            >
              <motion.div
                key="guest-input"
                layout
                variants={variant}
                initial="initial"
                animate="animate"
                transition={{ type: 'spring', delay: 0.155 }}
              >
                <input
                  ref={guestId}
                  autoComplete="off"
                  autoCorrect="off"
                  type="text"
                  name="guest"
                  placeholder="Guest ID"
                  className="w-full block bg-gray-100 dark:bg-gray-900 p-3 mb-1 text-sm placeholder:font-light rounded focus:outline-[0.9px] focus:-outline-offset-1 focus:outline-blue-500 transition-all duration-200"
                />
              </motion.div>

              {inputError.guest && <ErrorInputMessage message={inputError.guest} />}

              <motion.button
                key="guest-btn"
                aria-label="signin-guest"
                layout
                type="button"
                disabled={loading}
                variants={variant}
                initial="initial"
                animate="animate"
                transition={{ type: 'spring', delay: inputError.guest ? 0 : 0.166 }}
                onClick={() => handleSubmit('guest')}
                className="w-full mt-1 flex items-center justify-center py-3 rounded bg-gray-100 dark:bg-gray-900"
              >
                {loading ? <CgSpinner className="animate-spin text-blue-500" /> : 'Guest Login'}
              </motion.button>
            </motion.div>
          )}

          {!isAuthenticate && (
            <motion.button
              key="google"
              aria-label="signin-google"
              onClick={() => {
                sessionStorage.clear();
                signIn('google', { callbackUrl: '/chat' });
              }}
              variants={variant}
              initial="initial"
              animate="animate"
              transition={{ type: 'spring', delay: 0.133 }}
              className="w-full mt-5 flex text-blue-100 items-center justify-center gap-x-2 py-3 rounded bg-blue-600 hover:bg-blue-600/90 text-sm"
            >
              <AiOutlineGoogle /> Continue with Google
            </motion.button>
          )}

          <motion.div
            key="input-container"
            layout
            className="w-full h-fit font-semibold text-gray-500 dark:text-gray-300 mt-3 text-sm"
          >
            {!isAuthenticate && (
              <motion.div
                key="box-input"
                layout
                variants={variant}
                initial="initial"
                animate="animate"
                transition={{ type: 'spring', delay: 0.155 }}
              >
                <motion.div
                  key="email-box"
                  layout
                  variants={variant}
                  initial="initial"
                  animate="animate"
                  transition={{ type: 'spring', delay: 0.166 }}
                >
                  <input
                    ref={email}
                    autoComplete="off"
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    className="w-full block bg-gray-100 dark:bg-gray-900 p-3 mb-1 text-sm placeholder:font-light rounded focus:outline-[0.9px] focus:-outline-offset-1 focus:outline-blue-500 transition-all duration-200"
                  />
                </motion.div>

                {inputError.email && <ErrorInputMessage message={inputError.email} />}

                <motion.button
                  layout
                  key="email-btn"
                  aria-label="signin-email"
                  type="button"
                  disabled={loading}
                  variants={variant}
                  initial="initial"
                  animate="animate"
                  transition={{ type: 'spring', delay: inputError.email ? 0 : 0.177 }}
                  onClick={() => handleSubmit('email')}
                  className="w-full mt-2 flex items-center justify-center py-3 rounded bg-gray-100 dark:bg-gray-900"
                >
                  {loading ? <CgSpinner className="animate-spin text-blue-500" /> : 'Continue with Email'}
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}

      {showModalVerification && (
        <motion.div
          key="verify"
          variants={variant}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.1, type: 'spring', stiffness: 70 }}
          className="w-[20rem] mt-24 p-5 text-sm rounded text-center text-gray-700 dark:text-gray-400"
        >
          <div className="w-24 h-24 rounded-full bg-blue-400 mb-3 mx-auto"></div>
          <h1 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-300">Check Your Email</h1>
          <p className="">
            We has been sent email verification to <b>{email.current?.value}</b>, please check your inbox to continue.
          </p>
          <button
            aria-label="back-login"
            onClick={() => setShowModalVerification(false)}
            className="mt-6 mx-auto px-3 py-1 rounded"
          >
            back to login
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ErrorInputMessage({ message }: { message: string }) {
  return (
    <motion.p key="error" layoutId="error-msg" className="text-xs text-red-500 dark:text-red-400 font-normal pl-1">
      {message}
    </motion.p>
  );
}
