'use client';

import { ReactNode, createContext, useContext, useState } from 'react';
import { User } from '~/types/user';

interface IChatContext {
  friend: User | undefined;
  setFriend: (friend?: User) => void;
}

const ChatContext = createContext<IChatContext | undefined>(undefined);

export default function ChatContextProvider({ children }: { children: ReactNode }) {
  const [friend, setFriend] = useState<User | undefined>(undefined);

  // for prevent rerender
  const setFriendChat = (friend: User | undefined) =>
    setFriend((prev) => {
      if (friend?.id && prev?.id === friend?.id) return prev;
      return friend;
    });

  return <ChatContext.Provider value={{ friend, setFriend: setFriendChat }}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const chatContext = useContext(ChatContext);

  if (!chatContext) {
    throw new Error('Chat context is not define');
  }
  return chatContext;
}
