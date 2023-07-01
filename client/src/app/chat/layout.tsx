export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  return <main className="h-screen w-full relative flex font-primary">{children}</main>;
}
