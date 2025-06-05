import React from 'react';

const AboutSection = () => {
    return (
        <section id="tentang" className="relative bg-white md:py-16 py-20 md:px-24 h-full md:h-screen flex justify-center items-center w-full">
            <div className="container md:mx-auto md:px-4 flex justify-center items-center h-full">
                <div className="flex flex-col-reverse gap-10 md:grid md:grid-cols-2">
                    <div className="flex flex-col justify-center items-start md:px-0 px-6">
                        <h1 data-aos="fade-up" className="text-m md:text-l font-bold text-gray-800 leading-tight relative flex items-center">
                            <span className="absolute -left-[50px] block bg-gray-800 h-[2px] w-10 mr-2"></span>
                            Tentang Kami
                        </h1>
                        <h2 data-aos="fade-right" data-aos-delay="750" className="mt-8 text-xl md:text-[2rem] font-bold text-gray-800 leading-tight">
                            Solusi Praktis dan Cepat untuk Administrasi Surat Menyurat
                        </h2>
                        <p data-aos="fade-right" data-aos-delay="750" className="text-gray-600 mt-4">
                            Selamat datang di portal resmi RT/RW kami, tempat Anda dapat mengurus berbagai keperluan administrasi surat menyurat dengan mudah dan efisien.
                            <br /><br />
                            Website ini dirancang untuk memudahkan warga dalam mendapatkan informasi, mengajukan permohonan surat, serta berkomunikasi dengan pengurus RT/RW secara online. Kami berkomitmen untuk memberikan layanan yang transparan, cepat, dan terpercaya bagi seluruh warga.
                        </p>
                    </div>
                    <div className="flex items-center justify-center">
                        <img
                            src="/assets/img/hero-desktop.png"
                            alt="Hero Image"
                            className="rounded-lg object-contain md:w-auto w-full h-60 md:h-[480px]"
                            data-aos="zoom-in-left"
                            data-aos-delay="750"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
