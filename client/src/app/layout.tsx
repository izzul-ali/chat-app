import './globals.css';
import { Red_Hat_Text } from 'next/font/google';

const red_hat_text = Red_Hat_Text({ display: 'swap', subsets: ['latin'], variable: '--font-red-hat' });

export const metadata = {
  title: 'Chat App',
  description: 'Chat App built with Next.js and Node.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={red_hat_text.variable}>{children}</body>
    </html>
  );
}
