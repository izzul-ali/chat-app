import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';
import { RedirectType } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';
import { authOptions } from '~/lib/auth/config';
import Sidebar from '~/components/chat/Sidebar';
import ChatBar from '~/components/chat/menu/ChatBar';
import Message from '~/components/chat/message/Message';
import Profile from '~/components/chat/Profile';
import SendMessage from '~/components/chat/message/Send';
import MessageList from '~/components/chat/message/List';
import SwrConfigProvider from '~/lib/swr';
import ChatContextProvider from '~/hooks/useChat';

export default async function ChatPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/', RedirectType.replace);
  }

  // we set user id to cookie when users login with google
  const cUserId = cookies().get('msg_id')?.value;

  const userId = cUserId || session?.user?.id!;

  return (
    <>
      <Sidebar user={session.user} id={userId} />
      <ChatContextProvider>
        <SwrConfigProvider>
          <ChatBar user={session.user} userId={userId} />
          <Message>
            <MessageList user={session.user} userId={userId} />
            <SendMessage user={session.user} userId={userId} />
          </Message>
          <Profile user={session.user} id={userId} />
        </SwrConfigProvider>
      </ChatContextProvider>
    </>
  );
}
