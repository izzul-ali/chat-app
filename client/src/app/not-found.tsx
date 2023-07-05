import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="h-screen w-full font-bold dark:bg-gray-950 font-primary flex flex-col gap-y-1 justify-center items-center">
      <h1 className="text-5xl text-gray-700 dark:text-gray-100">404</h1>
      <h2 className="text-lg text-gray-600 dark:text-gray-200">Page Not Found</h2>
      <Link href="/" className="font-normal text-xs px-3 py-1 mt-2 text-gray-800 dark:text-gray-100">
        Back to Home
      </Link>
    </div>
  );
}
