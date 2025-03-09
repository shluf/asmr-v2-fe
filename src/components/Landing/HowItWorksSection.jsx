'use client'

import React from 'react';

const HowItWorksSection = () => {
    return (
        <section id="cara-kerja" className="bg-white py-16 h-full md:h-screen flex justify-center items-center box-border">
            <div className="container mx-auto md:mx-8 px-4">
                <h3 data-aos="fade-down-right" className="text-l text-center font-bold leading-tight text-green">
                    Bagaimana cara kerjanya?
                </h3>
                <h2 data-aos="flip-up" data-aos-delay="750" className="text-3xl text-center font-bold text-gray-800 leading-tight">
                    Langkah - langkah pengajuan masalah
                </h2>
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-8 h-full">
                    {[
                        {
                            title: "Registrasi akun",
                            description: "Buat akun untuk akses cepat ke layanan surat menyurat dan informasi RT/RW. Registrasi hanya butuh beberapa langkah sederhana.",
                            icon: "person",
                            bgColor: "FAEFCF",
                            delay: "250"
                        },
                        {
                            title: "Verifikasi akun",
                            description: "Cek email untuk verifikasi dan aktifkan akun Anda agar bisa segera menggunakan semua layanan kami.",
                            icon: "verify",
                            bgColor: "CEFEF5",
                            delay: "500"
                        },
                        {
                            title: "Pengajuan masalah",
                            description: "Laporkan masalah Anda melalui formulir online, dan kami akan segera menindaklanjutinya. Prosesnya cepat dan transparan.",
                            icon: "propose",
                            bgColor: "EBDDFD",
                            delay: "1000"
                        },
                        {
                            title: "Masalah diproses",
                            description: "Masalah Anda sedang kami tangani. Anda akan menerima update selanjutnya melalui email atau bisa memeriksanya langsung di website ini.",
                            icon: "process",
                            bgColor: "EBDDFD",
                            delay: "1500"
                        }
                    ].map((step, index) => (
                        <React.Fragment key={index}>
                            <div data-aos="flip-left" data-aos-delay={step.delay} className="flex justify-start items-center flex-col border border-gray-300 rounded-lg p-6 max-w-96 shadow-md w-full md:w-64">
                                <div className={`flex justify-center items-center bg-[#${step.bgColor}] rounded-full h-12 w-12`}>
                                    <img src={`/assets/img/${step.icon}.svg`} alt={`Icon ${index + 1}`} className="h-6 w-6" />
                                </div>
                                <h3 className="mt-10 text-lg font-bold text-center text-gray-800 leading-tight">
                                    {step.title}
                                </h3>
                                <p className="text-xs text-gray-600 mt-2 text-center">
                                    {step.description}
                                </p>
                            </div>
                            {index < 3 && (
                                <div className="flex justify-center items-center">
                                    <img
                                        data-aos="zoom-in-right"
                                        data-aos-delay={step.delay}
                                        src="/assets/img/arrow.svg"
                                        alt="Arrow Icon"
                                        className="h-4 w-4 md:block hidden"
                                    />
                                    <img
                                        data-aos="zoom-in"
                                        data-aos-delay={step.delay}
                                        src="/assets/img/arrow_down.svg"
                                        alt="Arrow Icon"
                                        className="block h-4 w-4 md:hidden"
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
