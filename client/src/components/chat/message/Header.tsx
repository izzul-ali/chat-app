import { BsArrowLeft } from 'react-icons/bs';
import { FiVideo, FiPhoneCall } from 'react-icons/fi';
import { HiOutlineDotsCircleHorizontal } from 'react-icons/hi';
import { useChat } from '~/hooks/useChat';
import Image from 'next/image';

export default function MessageHeader() {
  const { friend, setFriend } = useChat();

  return (
    <header className="flex items-center justify-between bg-message-header dark:bg-gray-950 w-full py-3 px-4 md:px-7 border-b border-gray-300 dark:border-gray-900">
      <button
        type="button"
        onClick={() => setFriend(undefined)}
        className="p-2 mr-1 text-gray-700 dark:text-gray-400 md:hidden"
      >
        <BsArrowLeft />
      </button>
      <div className="flex items-center justify-start gap-x-2 flex-1">
        <Image
          key={friend?.id}
          alt={friend?.name || 'unset'}
          src={friend?.image || 'https://api.dicebear.com/6.x/adventurer/svg?seed=felix'}
          width={40}
          height={40}
          className="rounded-full overflow-hidden"
        />
        <h1 className="font-bold text-lg text-gray-700 dark:text-gray-300 line-clamp-1">{friend?.name}</h1>
      </div>

      <div className="flex justify-end items-center gap-x-4 text-gray-700 dark:text-gray-400 flex-1 text-lg">
        <button type="button">
          <FiVideo />
        </button>
        <button type="button">
          <FiPhoneCall className="text-base" />
        </button>
        <button type="button">
          <HiOutlineDotsCircleHorizontal />
        </button>
      </div>
    </header>
  );
}
