'use client';

import { useAuth } from '@/hooks/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiUsers, FiCalendar, FiFileText, FiHome, FiMenu, FiX } from 'react-icons/fi';

export default function RTLayout({ children }) {
  const router = useRouter();
  const { user, isLoading } = useAuth({
    middleware: 'auth',
  });
  
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Deteksi ukuran layar
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsOpen(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  // Cek apakah user memiliki role RT
  useEffect(() => {
    if (!isLoading && user && user.role !== 'rt') {
      router.push('/login');
    }
  }, [user, isLoading, router]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Button untuk toggle sidebar di mobile */}
      <button 
        className="fixed z-20 top-4 left-4 p-2 rounded-md bg-green-600 text-white lg:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
      
      {/* Sidebar */}
      <div 
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transform fixed lg:relative lg:translate-x-0 z-10 w-64 bg-green-800 text-white h-full transition-transform duration-300 ease-in-out`}
      >
        <div className="p-5">
          <h2 className="text-2xl font-bold mb-6">RT Dashboard</h2>
          <nav className="space-y-3">
            <Link 
              href="/rt"
              className="flex items-center p-3 rounded-lg text-white hover:bg-green-700 transition-colors"
            >
              <FiHome className="mr-3" size={20} />
              <span>Dashboard</span>
            </Link>
            
            <Link 
              href="/rt/warga"
              className="flex items-center p-3 rounded-lg text-white hover:bg-green-700 transition-colors"
            >
              <FiUsers className="mr-3" size={20} />
              <span>Data Warga</span>
            </Link>
            
            <Link 
              href="/rt/kegiatan"
              className="flex items-center p-3 rounded-lg text-white hover:bg-green-700 transition-colors"
            >
              <FiCalendar className="mr-3" size={20} />
              <span>Kegiatan</span>
            </Link>
            
            <Link 
              href="/rt/pengaduan"
              className="flex items-center p-3 rounded-lg text-white hover:bg-green-700 transition-colors"
            >
              <FiFileText className="mr-3" size={20} />
              <span>Pengaduan Warga</span>
            </Link>
          </nav>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </div>
      
      {/* Overlay untuk menutup sidebar di mobile */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-0 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
} 