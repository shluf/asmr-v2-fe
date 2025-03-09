'use client'

import React from 'react';
import Link from 'next/link';

const BannerSection = ({ user }) => {
    return (
        <section id="beranda" className="relative bg-gray-100 py-16 h-screen box-border">
            <div className="absolute inset-0 flex justify-center z-0">
                <img
                    className="object-cover w-full h-full"
                    src="/assets/img/bg_land_overlay.png"
                    data-aos="zoom-in"
                    onLoad={(e) => {
                        e.target.setAttribute('data-aos', 'zoom-in');
                    }}
                />
            </div>
            <div className="container mx-auto px-4 h-full z-10 relative">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-8 h-full">
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="flex flex-col justify-center items-center">
                            <h2 data-aos="fade-up" data-aos-delay="300" className="text-l md:text-xl font-bold text-gray-500 text-start w-full leading-tight">
                                Portal Surat Menyurat
                            </h2>
                            <h1 data-aos="fade-up" data-aos-delay="500" className="text-4xl md:text-5xl font-black text-gray-800 md:text-center text-start leading-tight">
                                Pengajuan Masalah<br />RT & RW
                            </h1>
                        </div>
                        <div data-aos="fade" data-aos-delay="1000" className="mt-8 flex items-center justify-around p-4 shadow-md rounded-lg bg-white">
                            {user ? (
                                <div className="flex items-center justify-center">
                                    <div className="hidden md:flex flex-col items-center justify-center mr-4">
                                        <p className="text-gray-800 font-bold text-center">Lanjutkan aktivitas?</p>
                                        <p className="text-gray-600 text-center">Kembali ke dashboard</p>
                                    </div>
                                    <Link href="/dashboard" className="rounded-md px-3 py-2 bg-yellow hover:bg-yellow-2 text-white font-medium mr-2">
                                        Dashboard
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <div className="hidden md:flex flex-col items-center justify-center mr-4">
                                        <p className="text-gray-800 font-bold text-center">Belum memiliki akun?</p>
                                        <p className="text-gray-600 text-center">Registrasi sekarang</p>
                                    </div>
                                    <Link href="/register" className="rounded-md px-3 py-2 bg-yellow hover:bg-yellow-2 text-white font-medium mr-6">
                                        Registrasi
                                    </Link>
                                    <div className="hidden md:flex flex-col items-center justify-center mr-4">
                                        <p className="text-gray-800 font-bold text-center">Sudah memiliki akun?</p>
                                        <p className="text-gray-600 text-center">Masuk ke aplikasi</p>
                                    </div>
                                    <Link href="/login" className="rounded-md px-3 py-2 bg-green hover:bg-green-2 text-white font-medium">
                                        Masuk
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BannerSection;
