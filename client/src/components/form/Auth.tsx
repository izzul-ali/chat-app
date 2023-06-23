'use client';

import { signIn } from 'next-auth/react';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { CgSpinner } from 'react-icons/cg';
import { useErrorModal } from '../ErrorModal';
import { AnimatePresence, Variants, motion } from 'framer-motion';
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

export default function AuthForm() {
  const [showModalVerification, setShowModalVerification] = useState<boolean>(false);
  const [showInputEmail, setShowInputEmail] = useState<boolean>(false);
  const [showInputGuest, setShowInputGuest] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { setError } = useErrorModal();

  // form input
  const email = useRef<HTMLInputElement | null>(null);
  const guestId = useRef<HTMLInputElement | null>(null);

  // URL handle
  const route = useRouter();
  const params = useSearchParams();

  // const clearState = useCallback(() => {
  //   if (!username.current || !password.current) {
  //     return;
  //   }

  //   username.current.value = '';
  //   password.current.value = '';
  //   email.current ? (email.current.value = '') : null;

  //   setError('');
  //   setLoading(false);
  // }, []);

  const handleShowInputEmail = useCallback(() => {
    setShowInputEmail(true);
    setShowInputGuest(false);
  }, []);

  const handleShowInputGuest = useCallback(() => {
    setShowInputEmail(false);
    setShowInputGuest(true);
  }, []);

  async function handleSubmitEmail() {
    if (!email.current?.value) {
      setError('Email is Required');
      return;
    }

    const resp = await axiosInstance.post(
      '/auth/register',
      {},
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
  }

  return (
    <>
      {!showModalVerification ? (
        <AnimatePresence initial={true}>
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
              <motion.fieldset
                layout
                variants={variant}
                initial="initial"
                animate="animate"
                transition={{ duration: 1.3, type: 'spring', delay: 0.155 }}
                className="mt-5"
              >
                {showInputEmail && (
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
                      type="text"
                      placeholder="Enter your email address"
                      className="w-full block bg-blue-50 p-3 mb-2 text-sm placeholder:font-light rounded border border-blue-400"
                    />
                  </motion.div>
                )}

                <motion.button
                  layout
                  type="button"
                  onClick={() => handleShowInputEmail()}
                  className="w-full flex items-center justify-center gap-x-4 py-3 rounded bg-white border border-gray-200 text-sm"
                >
                  Continue with Email
                </motion.button>
              </motion.fieldset>

              <motion.fieldset
                layout
                variants={variant}
                initial="initial"
                animate="animate"
                transition={{ duration: 1.3, type: 'spring', delay: 0.166 }}
                className="mt-5"
              >
                {showInputGuest && (
                  // Guest id using NextAuth signIn client API
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
                      placeholder="Guest ID"
                      className="w-full block bg-blue-50 p-3 mb-2 text-sm placeholder:font-light rounded border border-blue-400"
                    />
                  </motion.div>
                )}
                <motion.button
                  layout
                  type="button"
                  onClick={() => handleShowInputGuest()}
                  className="w-full flex items-center justify-center gap-x-4 py-3 rounded bg-white border border-gray-200 text-sm"
                >
                  Guest Login
                </motion.button>
              </motion.fieldset>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="w-[90%] sm:w-72 p-5 text-sm text-gray-800 font-semibold rounded bg-white text-center">
          <p>We has been send verification to your email, please check your email to continue</p>
          <button
            onClick={() => setShowModalVerification(false)}
            className="block px-4 py-1 bg-blue-600 text-white rounded mt-6 mx-auto"
          >
            OK
          </button>
        </div>
      )}
    </>
  );
}

// useEffect(() => {
//   // get error message from url params
//   // after get error message, the error params must be cleared
//   setError(params.get('error') || '');
//   route.replace('/');
// }, []);

// useEffect(() => {
//   clearState();
// }, [isRegister]);

// async function handleSubmit(e: FormEvent<HTMLFormElement>) {
//   e.preventDefault();
//   setLoading(true);

//   if (!username.current || !password.current) {
//     return;
//   }

//   const resp = await signIn('credentials', {
//     username: username.current.value, // when login username can be contain an email
//     email: email.current?.value || '', // email can be null when login
//     password: password.current.value,
//     type: isRegister ? 'signup' : 'signin',
//     redirect: false,
//   });

//   if (resp?.error) {
//     setError(resp.error);
//     setLoading(false);
//     return;
//   }

//   // clear input form
//   clearState();
//   setLoading(false);

//   if (isRegister) {
//     setShowModalVerification(true);
//     return;
//   }

//   route.replace('/chat');
// }

// function OldLogin() {
//   return <AnimatePresence initial={true}>
//   <motion.div
//     layout
//     initial={{ opacity: 0, y: -25 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 1.2, type: 'spring', delay: 0.1 }}
//     className="w-[19rem] px-6 py-8 rounded-md bg-white shadow-lg shadow-blue-200"
//   >
//     <motion.div
//       layout
//       initial={{ opacity: 0, y: -5 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 1, type: 'spring', delay: 0.2 }}
//       className="flex items-center justify-evenly gap-x-4 text-sm text-gray-600 font-semibold mb-6"
//     >
//       <button
//         aria-label="btn-signin"
//         onClick={() => setIsRegister(false)}
//         type="button"
//         className={`w-1/2 py-2 rounded-lg ${isRegister && 'bg-blue-100'}`}
//       >
//         <p className={`${isRegister ? '' : 'border-b-2 border-blue-500 text-blue-600'}  w-fit mx-auto`}>Sign in</p>
//       </button>
//       <button
//         aria-label="btn-signup"
//         onClick={() => setIsRegister(true)}
//         type="button"
//         className={`w-1/2 py-2 rounded-lg ${!isRegister && 'bg-blue-100'}`}
//       >
//         <p className={`${!isRegister ? '' : 'border-b-2 border-blue-500 text-blue-600'}  w-fit mx-auto`}>Sign Up</p>
//       </button>
//     </motion.div>

//     <motion.form
//       initial={{ opacity: 0, y: -5 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 1, type: 'spring', delay: 0.2 }}
//       onSubmit={handleSubmit}
//       className="text-gray-600 text-base flex flex-col font-semibold"
//     >
//       <motion.input
//         layout
//         required
//         type="text"
//         ref={username}
//         defaultValue={username.current?.value}
//         name="username"
//         placeholder={isRegister ? 'Username' : 'Username or Email'}
//         className="py-3 px-3 rounded bg-blue-100 placeholder:text-sm mb-3"
//       />

//       <AnimatePresence mode="popLayout">
//         {isRegister && (
//           // if using motion.input instead of motion.fieldset, the target ref will not receive the value from the input
//           <motion.fieldset
//             layout
//             variants={variant}
//             transition={{ type: 'spring', stiffness: 100, duration: 0.3, delay: 0.2 }}
//           >
//             <input
//               key="email-input"
//               type="email"
//               name="email"
//               required
//               placeholder="Email"
//               ref={email}
//               className="py-3 px-3 w-full rounded bg-blue-100 placeholder:text-sm mb-3"
//             />
//           </motion.fieldset>
//         )}
//       </AnimatePresence>

//       <motion.fieldset layout className="flex items-center gap-x-1 px-3 rounded bg-blue-100">
//         <input
//           required
//           type={visiblePassword ? 'text' : 'password'}
//           ref={password}
//           defaultValue={password.current?.value}
//           name="password"
//           placeholder="Password"
//           className="w-full py-3 bg-transparent placeholder:text-sm"
//         />
//         <button
//           aria-label="btn-show-password"
//           type="button"
//           className="text-base"
//           onClick={() => setVisiblePassword((prev) => !prev)}
//         >
//           {visiblePassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
//         </button>
//       </motion.fieldset>

//       <motion.button
//         layout
//         aria-label="btn-submit"
//         type="submit"
//         className={`block mt-5 py-2 text-center bg-blue-600 shadow-md shadow-blue-200 text-gray-50 rounded text-xs`}
//       >
//         {loading ? (
//           <CgSpinner className={`mx-auto text-base ${loading && 'animate-spin'}`} />
//         ) : isRegister ? (
//           'SIGN UP'
//         ) : (
//           ' SIGN IN'
//         )}
//       </motion.button>
//     </motion.form>

//     <motion.div
//       initial={{ opacity: 0, y: -5 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 1, type: 'spring', delay: 0.2 }}
//       layout
//     >
//       <div className="flex gap-x-4 items-center my-3">
//         <span className="inline-block bg-gray-300 w-full h-[1px] rounded"></span>
//         <p className="text-xs text-gray-600 whitespace-nowrap">OR</p>
//         <span className="inline-block bg-gray-300 w-full h-[1px] rounded"></span>
//       </div>

//       <button
//         aria-label="btn-signin-google"
//         onClick={() => signIn('google', { callbackUrl: '/chat' })}
//         type="button"
//         className="w-full py-2 flex items-center text-sm text-gray-50 font-semibold justify-center gap-x-2 bg-blue-600 rounded hover:bg-blue-500 hover:shadow-md hover:shadow-gray-300 transition-all duration-100"
//       >
//         <FcGoogle />
//         <p className="font-normal">{isRegister ? 'Sign Up' : 'Sign In'} with Google</p>
//       </button>
//     </motion.div>
//   </motion.div>
// </AnimatePresence>
// }
