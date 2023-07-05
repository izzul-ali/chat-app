'use client';

import { useEffect, useRef } from 'react';
import { useChat } from '~/hooks/useChat';
import { AnimatePresence, motion } from 'framer-motion';
import { getSessionGuest } from '~/hooks/useUser';
import { Message } from '~/types/message';
import { mutate } from 'swr';
import { produce } from 'immer';
import { SessionUser } from '~/types/user';
import useMessage from '~/hooks/useMessage';
import socket from '~/lib/socket';
import LoadingSpinner from '~/components/LoadingSpinner';
import Image from 'next/image';

function parseTime(dateTime: Date) {
  const _dateTime = new Date(dateTime);

  if (_dateTime.toString() === 'Invalid Date') {
    return '';
  }

  return Intl.DateTimeFormat('id', { timeZone: 'Asia/Jakarta', timeStyle: 'short' }).format(_dateTime);
}

export default function MessageList({ user, userId }: { user: SessionUser; userId: string }) {
  const guest = getSessionGuest();

  const { friend } = useChat();
  const { data, isLoading } = useMessage(guest?.id || user?.id || userId, friend?.id || '');

  const bottomChat = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socket.on('new-message', async (msg: Message) => {
      // update paginate message with match id
      await mutate(
        (key) => Array.isArray(key) && key[1] === msg.senderId,
        produce<Message[]>((prev) => {
          prev.push(msg);
        })
      );
    });

    return () => {
      socket.off('new-message');
    };
  }, []);

  // not working when last message is image
  useEffect(() => {
    bottomChat.current?.scrollIntoView({ behavior: 'instant' });
  }, [data?.length]);

  return (
    <AnimatePresence key="message-friend">
      {isLoading && (
        <div className="absolute h-full w-full pt-20 bg-transparent">
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && (
        <motion.div className="py-3 px-7 h-full overflow-y-scroll space-y-1 text-sm">
          {data?.map((v, i) => {
            // Text message
            if (v.type === 'TEXT')
              return (
                <div
                  key={i}
                  className={`w-fit max-w-[85%] flex items-end gap-x-2 pl-3 pr-1 py-1 rounded-md  ${
                    (guest?.id || userId) === v.senderId
                      ? 'ml-auto bg-blue-500 dark:bg-blue-600 text-white rounded-tr-none'
                      : 'mr-auto text-gray-900 dark:text-gray-300 bg-white dark:bg-gray-900 rounded-tl-none'
                  }`}
                >
                  <p
                    key={String(v.createdAt)}
                    className={`w-fit break-all text-base ${
                      (guest?.id || userId) === v.senderId ? 'ml-auto' : 'mr-auto'
                    }`}
                  >
                    {v.message}
                  </p>
                  <p
                    className={`text-xs mr-1 ${
                      (guest?.id || userId) === v.senderId
                        ? 'text-right mr-1 text-gray-50'
                        : 'text-left ml-1 text-gray-500'
                    }`}
                  >
                    {parseTime(v.createdAt!)}
                  </p>
                </div>
              );

            // Images message
            if (v.type === 'IMAGE')
              return (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-md ${(guest?.id || userId) === v.senderId ? 'ml-auto' : 'mr-auto'}`}
                >
                  <div className={`w-fit ${(guest?.id || userId) === v.senderId ? 'ml-auto' : 'mr-auto'}`}>
                    <Image
                      src={v.urlFileOrImage!}
                      alt={v.urlFileOrImage!}
                      width={200}
                      height={200}
                      quality={80}
                      placeholder="blur"
                      blurDataURL={v.urlFileOrImage}
                      className="w-fit max-w-[100%] h-fit max-h-72 object-cover rounded-md shadow-md shadow-gray-200 dark:shadow-gray-800"
                    />
                    <p
                      className={`text-xs mt-1 mr-1 text-gray-500 dark:text-gray-50 ${
                        (guest?.id || userId) === v.senderId ? 'text-right mr-1' : 'text-left ml-1'
                      }`}
                    >
                      {parseTime(v.createdAt!)}
                    </p>
                  </div>
                </div>
              );
          })}

          <div ref={bottomChat}></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
