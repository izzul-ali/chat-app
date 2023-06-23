import { RequiredAuth } from '~/components/Session';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequiredAuth isRequiredAuth={true} isRequiredUnAuth={false}>
      {children}
    </RequiredAuth>
  );
}
