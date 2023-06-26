'use client';

import { signIn } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { CgSpinner } from 'react-icons/cg';
import { useErrorModal } from './ErrorModal';
import { AnimatePresence, Variants, motion } from 'framer-motion';
import { AxiosError } from 'axios';
import axiosInstance from '~/lib/axios';

const variant: Variants = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};

const inputVariant: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

type InputField<T> = {
  email?: T;
  guest?: T;
};

export default function LoginAuthentication() {
  const [showModalVerification, setShowModalVerification] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showInput, setShowInput] = useState<InputField<boolean>>();
  const [inputError, setInputError] = useState<InputField<string>>({});

  const { setError } = useErrorModal();

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
    setShowInput({ email: false, guest: false });
  }, [showModalVerification]);

  const handleShowInputEmail = useCallback(() => {
    setInputError({ email: '', guest: '' });
    setShowInput({ email: true });
  }, []);

  const handleShowInputGuest = useCallback(() => {
    setInputError({ email: '', guest: '' });
    setShowInput({ guest: true });
  }, []);

  async function handleSubmit(type: 'email' | 'guest') {
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

      try {
        const resp = await axiosInstance.post('/auth/login', data, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        setLoading(false);
        setShowModalVerification(true);
        return;
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.message === 'Network Error') {
            setError(error.message);
            setLoading(false);
            return;
          }
          setInputError({ email: error.response?.data.error || error.message });
        }
        setLoading(false);
        return;
      }
    }

    if (!guestId.current?.value) {
      setInputError({ guest: 'Please enter guest id for login' });
      return;
    }
    setLoading(true);

    const resp = await signIn('credentials', { guestId: guestId.current.value, redirect: false });
    if (resp?.error) {
      setInputError({ guest: resp.error });
      setLoading(false);
      return;
    }

    return route.replace('/chat');
  }

  return (
    <AnimatePresence key="animate-root">
      {!showModalVerification ? (
        <motion.div
          variants={variant}
          initial="initial"
          animate="animate"
          transition={{ duration: 1, type: 'spring' }}
          className="flex flex-col items-center w-72"
        >
          <motion.div
            variants={variant}
            initial="initial"
            animate="animate"
            transition={{ duration: 1.3, type: 'spring', delay: 0.1 }}
            className="w-24 h-24 rounded-full bg-blue-400 mb-3"
          ></motion.div>
          <motion.h1
            variants={variant}
            initial="initial"
            animate="animate"
            transition={{ duration: 1.3, type: 'spring', delay: 0.122 }}
            className="text-xl font-semibold text-gray-700"
          >
            Login to ChatApp
          </motion.h1>

          <motion.button
            aria-label="signin-google"
            onClick={() => signIn('google', { callbackUrl: '/chat' })}
            variants={variant}
            initial="initial"
            animate="animate"
            transition={{ duration: 1.3, type: 'spring', delay: 0.133 }}
            className="w-full mt-5 flex text-gray-100 items-center justify-center gap-x-4 py-3 rounded bg-blue-600 hover:bg-blue-600/90 text-sm"
          >
            <FcGoogle /> Continue with Google
          </motion.button>

          <motion.div layout className="w-full h-fit font-semibold text-gray-500">
            <motion.div
              layout
              variants={variant}
              initial="initial"
              animate="animate"
              transition={{ duration: 1.3, type: 'spring', delay: 0.155 }}
              className="mt-5"
            >
              {showInput?.email && (
                <motion.div
                  layout
                  variants={inputVariant}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3, stiffness: 100, type: 'spring', delay: 0.1 }}
                >
                  <input
                    autoFocus={true}
                    ref={email}
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    className="w-full block bg-blue-50 p-3 mb-1 text-sm placeholder:font-light rounded border border-blue-400"
                  />
                </motion.div>
              )}
              {inputError.email && <ErrorInputMessage message={inputError.email} />}
              <motion.button
                aria-label="signin-email"
                layout
                type="button"
                disabled={loading}
                onClick={() => {
                  showInput?.email ? handleSubmit('email') : handleShowInputEmail();
                }}
                className="w-full mt-1 flex items-center justify-center py-3 rounded bg-white border border-gray-200 text-sm"
              >
                {loading && showInput?.email ? (
                  <CgSpinner className="animate-spin text-blue-500" />
                ) : (
                  'Continue with Email'
                )}
              </motion.button>
            </motion.div>

            <motion.div
              layout
              variants={variant}
              initial="initial"
              animate="animate"
              transition={{ duration: 1.3, type: 'spring', delay: 0.166 }}
              className="mt-5"
            >
              {showInput?.guest && (
                <motion.div
                  layout
                  variants={inputVariant}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3, stiffness: 100, type: 'spring', delay: 0.1 }}
                >
                  <input
                    autoFocus={true}
                    ref={guestId}
                    type="text"
                    name="guest"
                    placeholder="Guest ID"
                    className="w-full block bg-blue-50 p-3 mb-1 text-sm placeholder:font-light rounded border border-blue-400"
                  />
                </motion.div>
              )}
              {inputError.guest && <ErrorInputMessage message={inputError.guest} />}
              <motion.button
                aria-label="signin-guest"
                layout
                type="button"
                disabled={loading}
                onClick={() => {
                  showInput?.guest ? handleSubmit('guest') : handleShowInputGuest();
                }}
                className="w-full mt-1 flex items-center justify-center py-3 rounded bg-white border border-gray-200 text-sm"
              >
                {loading && showInput?.guest ? <CgSpinner className="animate-spin text-blue-500" /> : 'Guest Login'}
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          variants={variant}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, type: 'spring', delay: 0.1 }}
          className="w-[20rem] p-5 text-sm rounded text-center text-gray-700"
        >
          <div className="w-24 h-24 rounded-full bg-blue-400 mb-3 mx-auto"></div>
          <h1 className="mb-4 text-2xl font-semibold text-gray-800">Check Your Email</h1>
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
    <motion.p
      layout
      variants={inputVariant}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.3, stiffness: 100, type: 'spring', delay: 0.1 }}
      className="text-xs text-red-600 pl-1"
    >
      {message}
    </motion.p>
  );
}
