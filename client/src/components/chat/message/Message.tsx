'use client';

import { useChat } from '~/hooks/useChat';
import MessageHeader from './Header';
import Icon from '~/components/Icon';

export default function Message({ children }: { children: React.ReactNode }) {
  const { friend } = useChat();

  return (
    <div
      className={`w-full h-full bg-message-list dark:bg-gray-950 border-x border-gray-200 dark:border-gray-800 ${
        friend ? 'absolute z-50' : 'hidden'
      } md:block md:relative`}
    >
      {friend ? (
        <div className="h-full flex flex-col justify-between relative">
          <MessageHeader />
          {children}
        </div>
      ) : (
        <div className="h-full w-full flex justify-center items-center">
          <Icon width="200px" height="200px" />
        </div>
      )}
    </div>
  );
}
