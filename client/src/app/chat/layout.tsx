import { getServerSession } from 'next-auth';
import { RedirectType } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect('/', RedirectType.replace);
  }

  return <>{children}</>;
}
