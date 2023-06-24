import { Red_Hat_Text } from 'next/font/google';
import { Metadata } from 'next';
import SessionAuthProvider from '~/components/Session';
import ErrorModalProvider from '~/components/ErrorModal';
import './globals.css';

const red_hat_text = Red_Hat_Text({ display: 'swap', subsets: ['latin'], variable: '--font-red-hat' });

export const metadata: Metadata = {
  title: 'Chat App',
  description: 'Chat App built with Next.js and Node.js',
  themeColor: '#dbeafe',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={red_hat_text.variable}>
        <ErrorModalProvider>
          <SessionAuthProvider>{children}</SessionAuthProvider>
        </ErrorModalProvider>
      </body>
    </html>
  );
}
