'use client'

import Link from 'next/link'

export const metadata = {
    title: 'ASMR',
}

const GuestLayout = ({ children, button, header, wide=false }) => {
    return (
        <section className={`relative bg-gray-100 ${wide ? 'py-20 md:py-32' : ''} overflow-hidden`}>
            <div className="fixed inset-0 flex justify-center h-screen z-0">
                <img
                    className="object-cover w-full h-full"
                    src="/assets/img/bg_land_overlay.png"
                    alt="overlay bg"
                />
            </div>

            <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out bg-white bg-opacity-50 backdrop-blur shadow-md mt-4 mx-4 rounded-lg">
                <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                    <div className="md:w-1/3">
                        <Link href="/" className="text-2xl font-bold text-gray-800">
                            <img
                                src="/assets/logo.svg"
                                alt="Logo"
                                className="h-8 inline-block mr-2"
                            />
                        </Link>
                    </div>
                    <div className="hidden justify-center md:min-w-[500px] md:flex md:w-1/3">
                        <Link href="/#" className="text-gray-800 hover:text-green">
                            Beranda
                        </Link>
                        <span className="mx-4 text-green">⋮</span>
                        <Link
                            href="/#tentang"
                            className="text-gray-800 hover:text-green"
                        >
                            Tentang
                        </Link>
                        <span className="mx-4 text-green">⋮</span>
                        <Link
                            href="/#cara-kerja"
                            className="text-gray-800 hover:text-green"
                        >
                            Cara Kerja
                        </Link>
                        <span className="mx-4 text-green">⋮</span>
                        <Link
                            href="/#kritik-saran"
                            className="text-gray-800 hover:text-green"
                        >
                            Kritik Saran
                        </Link>
                    </div>
                    <div className="flex md:w-1/3 justify-end">
                        {button == "all" ? (
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
                        ) : button == "register" ? (
                            <>
                                <Link
                                    href={"/register"}
                                    className="rounded-md px-3 py-2 bg-yellow hover:bg-yellow-2 text-white font-medium mr-2 ring-1 ring-transparent transition hover:text-white focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                >
                                    Registrasi
                                </Link>
                            </>
                        ) : (
                            <Link
                                href={"/login"}
                                className="rounded-md px-3 py-2 bg-green hover:bg-green-2 text-white font-medium ring-1 ring-transparent transition hover:text-white focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                            >
                                Masuk
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            <div className="flex relative z-10 min-h-screen flex-col items-center pt-6 sm:pt-0 justify-center">
                <div className={`mt-6 w-full overflow-hidden bg-white px-6 py-8 shadow-md ${wide ? "sm:max-w-4xl" : "sm:max-w-md"} sm:rounded-lg`}>
                    <h1 className="text-center mb-10 font-bold text-4xl">{header}</h1>
                    {children}
                </div>
            </div>
        </section>
    )
}

export default GuestLayout
