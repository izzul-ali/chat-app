import { getServerSession } from 'next-auth';
import LoginAuthentication from '~/components/Auth';

export default async function Home() {
  const session = await getServerSession();

  return (
    <main className="h-screen flex flex-col items-center font-primary overflow-hidden">
      <LoginAuthentication isAuthenticate={session !== null} />
    </main>
  );
}
