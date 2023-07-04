'use client';

import { BsImage } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';
import { RiAttachment2, RiCheckLine } from 'react-icons/ri';
import { LuCopy } from 'react-icons/lu';
import { useChat } from '~/hooks/useChat';
import { getSessionGuest } from '~/hooks/useUser';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SessionUser } from '~/types/user';
import Image from 'next/image';

export default function Profile({ user, id }: { user: SessionUser; id?: string }) {
  // when login with guest account
  const guest = getSessionGuest();
  const { friend, setFriend } = useChat();
  const [copied, setCopied] = useState<boolean>(false);

  async function handleCopyToClipboard(text?: string) {
    if (text) {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  }

  return (
    <div className="p-3 h-full hidden lg:block md:w-2/4 lg:w-2/5 bg-profile dark:bg-gray-950 overflow-y-scroll">
      <button
        aria-label="close-chat"
        onClick={() => setFriend(undefined)}
        className={`w-fit ml-1 p-2 text-xl rounded-full text-gray-700 dark:text-gray-300 bg-white dark:bg-transparent hover:bg-gray-100 ${
          friend ? 'block' : 'hidden'
        }`}
      >
        <IoClose />
      </button>
      <div className="mt-20 text-center">
        <Image
          src={friend?.image || guest?.image || user.image!}
          alt={friend?.name || guest?.name || user.name!}
          width={100}
          height={100}
          className="rounded-full mx-auto"
        />
        <h2 className="text-lg mt-3 font-bold line-clamp-1 text-gray-800 dark:text-gray-300">
          {friend?.name || guest?.name || user.name!}
        </h2>

        <div className="flex items-center text-gray-600 dark:text-gray-400 justify-center gap-x-3">
          <p className="text-xs line-clamp-1 mt-1 selection:bg-transparent">
            ID: {friend?.id || guest?.id || user.id || id}
          </p>
          <LuCopy
            className="text-sm cursor-pointer"
            onClick={() => handleCopyToClipboard(friend?.id || guest?.id || id)}
          />
        </div>
        <div className="flex justify-center relative mt-2 text-xs text-gray-700 dark:text-gray-200">
          <AnimatePresence>
            {copied && (
              <motion.p
                key="copy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute flex items-center gap-x-1 w-fit py-1 px-5 rounded-sm bg-green-500/30 dark:bg-green-400/30"
              >
                copied <RiCheckLine />
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex px-4 items-center gap-x-1 text-sm text-gray-500">
          <RiAttachment2 className="fill-gray-400" />
          <p>File</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex px-4 items-center gap-x-1 text-sm text-gray-500">
          <BsImage className="fill-gray-400 text-xs" />
          <p>Images</p>
        </div>
      </div>
    </div>
  );
}
