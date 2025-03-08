'use client'

import React from 'react';

const FooterSection = () => {
    return (
        <footer className="bg-[#434A54]">
            <div className="bg-[url('/img/footer.png')] bg-cover px-10 py-16">
                <div className="container mx-auto px-4 text-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div data-aos="fade-up" data-aos-delay="100" className="col-span-2 flex justify-center">
                            <h3 className="text-2xl max-w-xs font-bold leading-tight">
                                Layanan Surat Menyurat di Ujung Jari Anda, Bersama Kami!
                            </h3>
                        </div>
                        <div data-aos="fade-up" data-aos-delay="300">
                            <h3 className="text-lg font-bold leading-tight">
                                Hubungi Kami
                            </h3>
                            <p className="text-sm mt-2 bg-green p-4 rounded-md">
                                info@asmr.com
                            </p>
                            <p className="text-md font-bold mt-2">
                                + 62 833 593 284
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterSection;
