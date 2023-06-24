import { getServerSession } from 'next-auth';
import { RedirectType } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';
import LoginAuthentication from '~/components/Auth';

export default async function Home() {
  const session = await getServerSession();
  if (session?.user) {
    redirect('/chat', RedirectType.replace);
  }
  return (
    <main className="h-screen flex flex-col items-center gap-y-10 pt-20 font-primary">
      <LoginAuthentication />
    </main>
  );
}
