'use client';
import { ArrowLeftIcon, HomeIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ApplicationLogo from '@/components/Atoms/ApplicationLogo';

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4">
      <div className="w-full max-w-md text-center border rounded-xl p-6 shadow-sm bg-white dark:bg-gray-800">
        <ApplicationLogo className="w-14 h-14 text-gray-800 dark:text-white mx-auto mb-6" />

        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.back()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Kembali
          </button>

          <Link
            href="/dashboard"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-sm"
          >
            <HomeIcon className="w-5 h-5" />
            Dashboard
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Butuh bantuan?
          <Link
            href="/#kritik-saran"
            className="ml-1 text-blue-600 dark:text-blue-400 underline"
          >
            Hubungi support
          </Link>
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
