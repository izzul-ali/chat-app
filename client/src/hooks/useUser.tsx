'use client';

import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import { User } from '~/types/user';

interface CurrentUserContext {
  currentUser: User | undefined;
  setCurrentUser: Dispatch<SetStateAction<User | undefined>>;
}

const CurrentUserContext = createContext<CurrentUserContext | undefined>(undefined);

export default function CurrentUserContextProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const _guest = window.sessionStorage.getItem('guest-identity');
    if (!_guest) return;

    const guest: User = JSON.parse(_guest);
    setCurrentUser(guest);
  }, []);

  return <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>{children}</CurrentUserContext.Provider>;
}

export function useCurrentUser() {
  const currentUserContext = useContext(CurrentUserContext);

  if (!currentUserContext) {
    throw new Error('current user context is not define');
  }
  return currentUserContext;
}

export function getSessionGuest() {
  let guest: User | null = null;
  if (typeof window !== 'undefined') {
    const _guest = sessionStorage.getItem('guest-identity');
    if (_guest) {
      guest = JSON.parse(_guest);
    }
  }

  return guest;
}
