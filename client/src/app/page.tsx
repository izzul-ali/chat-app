import AuthForm from '~/components/form/Auth';

export default function Home() {
  return (
    <main className="h-screen flex flex-col items-center gap-y-10 pt-20 font-primary">
      <AuthForm />
    </main>
  );
}
