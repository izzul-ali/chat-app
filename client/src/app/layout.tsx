import { Red_Hat_Text } from 'next/font/google';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import SessionAuthProvider from '~/components/Session';
import ErrorModalProvider from '~/components/ErrorModal';
import CurrentUserContextProvider from '~/hooks/useUser';
import './globals.css';

const red_hat_text = Red_Hat_Text({ display: 'swap', subsets: ['latin'], variable: '--font-red-hat' });

export const metadata: Metadata = {
  title: 'Chat App',
  description: 'Chat App built with Next.js and Node.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = cookies().get('theme')?.value;

  return (
    <html lang="en" className={theme}>
      <body className={red_hat_text.variable}>
        <ErrorModalProvider>
          <SessionAuthProvider>
            <CurrentUserContextProvider>{children}</CurrentUserContextProvider>
          </SessionAuthProvider>
        </ErrorModalProvider>
      </body>
    </html>
  );
}
