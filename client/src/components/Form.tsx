'use client';

import { useState } from 'react';
import { AiOutlineEyeInvisible, AiOutlineEye, AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { MdOutlineFacebook } from 'react-icons/md';

export default function LoginForm() {
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);

  return (
    <div className="w-72 px-6 py-8 rounded-md bg-white shadow-lg shadow-blue-200">
      <div className="flex items-center justify-evenly gap-x-4 text-sm text-gray-600 font-semibold mb-6">
        <button
          onClick={() => setIsRegister(false)}
          type="button"
          className={`w-1/2 py-2 rounded-lg ${isRegister && 'bg-blue-100'}`}
        >
          <p className={`${isRegister ? '' : 'border-b-2 border-blue-500 text-blue-600'}  w-fit mx-auto`}>Sign in</p>
        </button>
        <button
          onClick={() => setIsRegister(true)}
          type="button"
          className={`w-1/2 py-2 rounded-lg ${!isRegister && 'bg-blue-100'}`}
        >
          <p className={`${!isRegister ? '' : 'border-b-2 border-blue-500 text-blue-600'}  w-fit mx-auto`}>Register</p>
        </button>
      </div>

      <form className="text-gray-600 text-base flex flex-col font-semibold">
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="py-2 px-3 rounded bg-blue-100 placeholder:text-sm mb-3"
        />

        <fieldset className="flex items-center gap-x-1 px-3 rounded bg-blue-100">
          <input
            type={visiblePassword ? 'text' : 'password'}
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
          className="w-full mt-5 py-2 text-center bg-blue-600 shadow-md shadow-blue-200 text-gray-50 rounded text-xs"
        >
          {isRegister ? 'REGISTER' : ' SIGN IN'}
        </button>
      </form>

      <div className="flex gap-x-2 items-center my-4">
        <span className="inline-block bg-gray-300 w-full h-[1px] rounded"></span>
        <p className="text-xs text-gray-600 whitespace-nowrap">or continue with</p>
        <span className="inline-block bg-gray-300 w-full h-[1px] rounded"></span>
      </div>

      <div className="flex items-center justify-evenly text-lg">
        <button
          type="button"
          className="px-5 py-2 bg-blue-50 rounded hover:bg-gray-50 hover:shadow-md hover:shadow-gray-300 transition-all duration-100"
        >
          <FcGoogle />
        </button>
        <button
          type="button"
          className="px-5 py-2 bg-blue-50 rounded hover:bg-gray-50 hover:shadow-md hover:shadow-gray-300 transition-all duration-100"
        >
          <MdOutlineFacebook className="fill-blue-700" />
        </button>
        <button
          type="button"
          className="px-5 py-2 bg-blue-50 rounded hover:bg-gray-50 hover:shadow-md hover:shadow-gray-300 transition-all duration-100"
        >
          <AiFillGithub />
        </button>
      </div>
    </div>
  );
}
