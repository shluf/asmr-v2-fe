'use client'

import React from 'react';
import Link from 'next/link';

const NavigationBar = ({ scrolled, activeSection, user }) => {
    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
            scrolled ? "bg-white bg-opacity-50 backdrop-blur shadow-md mt-4 mx-4 rounded-lg" : ""
        }`}>
            <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                <div className="md:w-1/3">
                    <a href="#" className="text-2xl font-bold text-gray-800">
                        <img src="/logo.svg" alt="Logo" className="h-8 inline-block mr-2"/>
                    </a>
                </div>
                <div className="hidden md:flex justify-center md:min-w-[500px] md:w-1/3">
                    <a href="#" className={`hover:text-green ${activeSection === "beranda" ? "border-b-2 border-dotted border-green text-green" : "text-gray-800"}`}>
                        Beranda
                    </a>
                    <span className="mx-4 text-green">⋮</span>
                    <a href="#tentang" className={`hover:text-green ${activeSection === "tentang" ? "border-b-2 border-dotted border-green text-green" : "text-gray-800"}`}>
                        Tentang
                    </a>
                    <span className="mx-4 text-green">⋮</span>
                    <a href="#cara-kerja" className={`hover:text-green ${activeSection === "cara-kerja" ? "border-b-2 border-dotted border-green text-green" : "text-gray-800"}`}>
                        Cara Kerja
                    </a>
                    <span className="mx-4 text-green">⋮</span>
                    <a href="#kritik-saran" className={`hover:text-green ${activeSection === "kritik-saran" ? "border-b-2 border-dotted border-green text-green" : "text-gray-800"}`}>
                        Kritik Saran
                    </a>
                </div>
                <div className="flex md:w-1/3 justify-end">
                {user ? (
                                <Link
                                    href={"/dashboard"}
                                    className="rounded-md px-3 py-2 bg-green hover:bg-green-2 text-white font-medium ring-1 ring-transparent transition hover:text-white focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={"/register"}
                                        className="rounded-md px-3 py-2 bg-yellow hover:bg-yellow-2 text-white font-medium mr-2 ring-1 ring-transparent transition hover:text-white focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                    >
                                        Registrasi
                                    </Link>
                                    <Link
                                        href={"/login"}
                                        className="rounded-md px-3 py-2 bg-green hover:bg-green-2 text-white font-medium ring-1 ring-transparent transition hover:text-white focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                    >
                                        Masuk
                                    </Link>
                                </>
                            )}
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar;
