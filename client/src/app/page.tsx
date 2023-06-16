import LoginForm from '~/components/Form';

export default function Home() {
  return (
    <main className="h-screen flex flex-col items-center gap-y-10 pt-20 font-primary">
      <div className="px-5 text-center">
        <h1 className="font-bold text-3xl text-gray-700">CHAT APP</h1>
        <p className="text-sm font-semibold text-gray-500">Built with Next.js, Tailwind CSS and Node.js as Server</p>
      </div>

      <LoginForm />
    </main>
  );
}
