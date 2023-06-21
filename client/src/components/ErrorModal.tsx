'use client';

import { Dispatch, SetStateAction } from 'react';

export default function ErrorModal({ message, clear }: { message: string; clear: Dispatch<SetStateAction<string>> }) {
  return (
    <div className="absolute right-0 left-0 bg-transparent top-4 z-10">
      <div className="relative mx-auto w-4/5 py-2 px-6 rounded-md shadow-md shadow-gray-300 bg-white hover:bg-gray-100 text-sm font-primary font-semibold text-red-600">
        <p className="text-center">Error: {message}</p>
        <button
          onClick={() => clear('')}
          className="absolute -right-2 -top-2 py-1 px-2 rounded-full bg-gray-100 text-xs text-gray-800"
        >
          X
        </button>
      </div>
    </div>
  );
}
