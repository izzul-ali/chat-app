'use client';

import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

function ErrorModal({ message, clear }: { message: string; clear: Dispatch<SetStateAction<string>> }) {
  return (
    <motion.div
      key="error-modal"
      initial={{ top: -5 }}
      animate={{ top: 15 }}
      exit={{ top: -5, opacity: 0 }}
      transition={{ duration: 0.3, type: 'spring' }}
      className="absolute flex justify-center sm:justify-end sm:pr-5 w-full bg-transparent z-10"
    >
      <div className="relative w-[90%] sm:w-1/2 lg:w-1/3 xl:w-1/4 py-3 px-6 rounded-md shadow-md shadow-gray-300 bg-white hover:bg-gray-100 text-sm font-primary font-semibold text-red-500">
        <p className="text-center">Error: {message}</p>
        <button
          onClick={() => clear('')}
          className="absolute -right-2 -top-2 py-1 px-2 rounded-full bg-gray-100 text-xs text-gray-800"
        >
          X
        </button>
      </div>
    </motion.div>
  );
}

interface IErrModalContext {
  setError: Dispatch<SetStateAction<string>>;
}

const ErrorModalContext = createContext<IErrModalContext | null>(null);

function ErrorModalProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError('');
    }, 5000);

    return () => clearTimeout(timeout);
  }, [error]);

  return (
    <ErrorModalContext.Provider value={{ setError }}>
      <AnimatePresence>{error && <ErrorModal message={error} clear={setError} />}</AnimatePresence>
      {children}
    </ErrorModalContext.Provider>
  );
}

export function useErrorModal() {
  const errContext = useContext(ErrorModalContext);
  if (!errContext) {
    throw new Error('Error context provider is not define');
  }

  return errContext;
}

export default ErrorModalProvider;
