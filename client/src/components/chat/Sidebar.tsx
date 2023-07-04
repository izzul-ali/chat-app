'use client';

import { AiOutlineMessage, AiOutlineSetting } from 'react-icons/ai';
import { IoCallOutline } from 'react-icons/io5';
import { GoSignOut } from 'react-icons/go';
import { MdOutlineDarkMode } from 'react-icons/md';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { handleLogout } from '~/lib/auth/signin';
import { getSessionGuest } from '~/hooks/useUser';
import { SessionUser } from '~/types/user';
import Image from 'next/image';
import socket from '~/lib/socket';
import switchTheme from '~/action/theme';

export default function Sidebar({ user, id }: { user: SessionUser; id: string }) {
  const guest = getSessionGuest();

  // const [selectedMenu, setSelectedMenu] = useState('message');
  const [_, setTheme] = useState<'light' | 'dark'>('light');

  function handleSwitchTheme() {
    setTheme((theme) => {
      if (theme === 'light') {
        switchTheme('dark');
        return 'dark';
      }

      // theme is dark
      switchTheme('light');
      return 'light';
    });
  }

  useEffect(() => {
    socket.emit('user-online', {
      userId: guest?.id || user.id || id,
      profile: guest?.image || user.image,
    });

    return () => {
      socket.off('user-online');
    };
  }, []);

  const username = guest?.name || user.name!;
  const image = guest?.image || user.image!;

  return (
    <aside className="h-full w-fit px-3 py-4 bg-sidebar dark:bg-gray-950">
      <Image
        key={guest?.id || id}
        alt={username}
        src={image}
        width={30}
        height={30}
        className="rounded-full overflow-hidden mx-auto"
      />
      <div className={`flex flex-col mt-14 items-center gap-5 text-lg text-gray-600 dark:text-gray-500`}>
        <SidebarButton selectedMenu="message" label="btn-contact">
          <AiOutlineMessage />
        </SidebarButton>
        <SidebarButton selectedMenu="" label="btn-contact">
          <IoCallOutline />
        </SidebarButton>
        <SidebarButton selectedMenu="" label="btn-contact">
          <AiOutlineSetting />
        </SidebarButton>
        <button
          onClick={() => handleSwitchTheme()}
          type="button"
          aria-label={'btn-theme'}
          className={`p-2 rounded-lg hover:bg-blue-600 hover:text-gray-200`}
        >
          <MdOutlineDarkMode />
        </button>
      </div>
      <button
        onClick={() => handleLogout()}
        type="button"
        className="absolute bottom-4 p-2 rounded-lg bg-menu dark:bg-gray-900/80 hover:bg-gray-200 text-gray-700 dark:text-gray-500"
      >
        <GoSignOut />
      </button>
    </aside>
  );
}

function SidebarButton({
  children,
  label,
  selectedMenu,
  onClick,
}: {
  label: string;
  selectedMenu: string;
  onClick?: Dispatch<SetStateAction<string>>;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`p-2 rounded-lg ${selectedMenu && 'bg-blue-600 text-gray-200'} hover:bg-blue-600 hover:text-gray-200`}
    >
      {children}
    </button>
  );
}
