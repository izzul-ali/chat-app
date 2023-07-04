'use client';

import { AiFillMessage } from 'react-icons/ai';
import { FiSearch } from 'react-icons/fi';
import { HiStatusOnline } from 'react-icons/hi';
import { useChat } from '~/hooks/useChat';
import { ResponseApi } from '~/types/api';
import { AllContactMessage, Message } from '~/types/message';
import { AnimatePresence, Variants, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getSessionGuest } from '~/hooks/useUser';
import { produce } from 'immer';
import { SessionUser } from '~/types/user';
import { BsImage } from 'react-icons/bs';
import useSwr, { mutate } from 'swr';
import socket from '~/lib/socket';
import axiosInstance from '~/lib/axios';
import Image from 'next/image';
import LoadingSpinner from '~/components/LoadingSpinner';

interface SocketUser {
  userId: string;
  profile: string;
}

const variant: Variants = {
  initial: { y: 0, opacity: 0 },
  animate: { y: 20, opacity: 1 },
};

async function fetchContacts(id: string) {
  const resp = await axiosInstance.get<ResponseApi<AllContactMessage[]>>(`/users/${id}/all`);
  return resp?.data?.data;
}

function parseTime(dateTime: Date): string {
  const currentTIme = new Date();
  const _dateTime = new Date(dateTime);

  if (_dateTime.toString() === 'Invalid Date') {
    return '';
  }

  const today = _dateTime.getDay() < currentTIme.getDay();

  return Intl.DateTimeFormat('en-US', {
    dateStyle: today ? 'short' : undefined,
    timeStyle: today ? undefined : 'short',
    timeZone: 'Asia/Jakarta',
  }).format(_dateTime);
}

export default function ChatBar({ user, userId }: { user: SessionUser; userId: string }) {
  const guest = getSessionGuest();
  const currentUserId = guest?.id || user?.id || userId;

  const { data, isLoading } = useSwr('all-contact', () => fetchContacts(currentUserId));
  const [onlineUsers, setOnlineUsers] = useState<SocketUser[]>([]);

  useEffect(() => {
    socket.on('online-users', (users: SocketUser[]) => {
      setOnlineUsers(users.filter((u) => u.userId !== currentUserId));
    });

    socket.on('offline-users', (users: SocketUser[]) => {
      setOnlineUsers(users.filter((u) => u.userId !== currentUserId));
    });

    socket.on('new-message', async (msg: Message) => {
      await mutate(
        'all-contact',
        produce<AllContactMessage[]>((prev) => {
          prev.filter((u) => {
            if (u.id === msg.senderId) {
              u.type = msg.type;
              u.urlFileOrImage = msg.urlFileOrImage;
              u.currentMessage = msg.message!;
              u.createdAt = msg.createdAt!;
              return u;
            }
          });
        }),
        { revalidate: false }
      );
    });

    return () => {
      socket.off('online-users');
      socket.off('offline-users');
      socket.off('new-message');
    };
  }, []);

  return (
    <div className="h-full w-full md:w-1/2 bg-menu dark:bg-gray-950 py-4 overflow-y-scroll">
      <h1 className="text-xl font-bold text-blue-500 px-4 w-fit">Message</h1>
      <div className="px-4">
        <div className="flex items-center bg-gray-100 dark:bg-gray-900 mt-5 py-2 px-3 rounded gap-x-2 text-sm">
          <FiSearch className="text-gray-700 dark:text-gray-400" />
          <input
            type="text"
            className="w-full bg-inherit placeholder:text-sm dark:text-gray-300"
            placeholder="Search..."
          />
        </div>
      </div>

      <motion.div layout="position" className="mt-5 pl-4">
        <motion.div layout className="flex items-center gap-x-1 text-sm text-gray-500">
          <HiStatusOnline />
          <p>Online</p>
        </motion.div>

        <motion.div layout className="flex items-center overflow-x-scroll gap-x-2 mt-2 py-1">
          {onlineUsers?.map((u) => (
            <Image
              key={u.userId}
              alt={u.userId}
              src={u.profile}
              width={40}
              height={40}
              className="rounded-full overflow-hidden"
            />
          ))}
        </motion.div>
      </motion.div>

      <motion.div layout className="mt-1 relative">
        <motion.div layout className="flex px-4 items-center gap-x-1 text-sm text-gray-500">
          <AiFillMessage className="fill-gray-400 dark:fill-gray-600" />
          <p>All Message</p>
        </motion.div>

        <AnimatePresence>
          {isLoading && <LoadingSpinner />}
          {!isLoading && (
            <motion.div
              layout
              key="msgs-contc"
              variants={variant}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.5 }}
              className="space-y-2 px-2"
            >
              {data?.map((v) => (
                <Highlight key={v.id} usr={v} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function Highlight({ usr }: { usr: AllContactMessage }) {
  const { setFriend } = useChat();

  return (
    <div
      onClick={() =>
        setFriend({ id: usr.id, email: usr.email, name: usr.name, image: usr.image, provider: usr.provider })
      }
      className="p-2 w-full rounded-md flex gap-x-2 items-start transition-colors duration-100 hover:bg-gray-100 dark:hover:bg-gray-900 hover:cursor-pointer"
    >
      <Image alt={usr.name} src={usr.image} width={50} height={50} className="rounded-full overflow-hidden" />

      <div className="w-full">
        <div className="flex justify-between">
          <h2 className="font-bold text-gray-800 dark:text-gray-300 text-base line-clamp-1">{usr.name}</h2>
          <p className="text-gray-500 text-xs font-semibold">{parseTime(usr.createdAt)}</p>
        </div>
        <div className="flex justify-between">
          <p className="line-clamp-1 text-sm text-gray-600 dark:text-gray-400 pr-2">
            {usr.type === 'TEXT' && usr.currentMessage}
            {usr.type === 'IMAGE' && (
              <span className="flex items-center gap-x-1">
                <BsImage className="text-[11px]" /> Photo
              </span>
            )}
          </p>
          {/* <p>read</p> */}
        </div>
      </div>
    </div>
  );
}
