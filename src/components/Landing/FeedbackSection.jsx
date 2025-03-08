'use client'

import React, { useState } from 'react';

const FeedbackSection = () => {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
    });

    const ownerEmail = process.env.NEXT_PUBLIC_MAIL_USERNAME;

    const createMailtoLink = () => {
        const mailtoBody = `Yth. Tim Aplikasi Surat Menyurat RT/RW,%0D%0A%0D%0ADengan hormat,%0D%0ASaya ${form.firstName}, ingin menyampaikan beberapa kritik dan saran yang saya harap dapat menjadi bahan pertimbangan untuk perbaikan layanan di aplikasi ini.%0D%0A%0D%0A${form.message}%0D%0A%0D%0ATerima kasih atas perhatian dan kerjasamanya. Semoga kritik dan saran ini dapat membantu dalam meningkatkan layanan ini.%0D%0A%0D%0AHormat saya,%0D%0A${form.firstName} ${form.lastName}%0D%0A%0D%0AEmail: ${form.email}`;
        return `mailto:${ownerEmail}?subject=${encodeURIComponent('Kritik & Saran - ' + form.subject)}&body=${mailtoBody}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        window.open(createMailtoLink(), '_blank');
        setForm({
            firstName: '',
            lastName: '',
            email: '',
            subject: '',
            message: ''
        });
    };

    return (
        <section id="kritik-saran" className="bg-white md:px-0 lg:px-24 py-16 h-full box-border">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    <div className="p-8">
                        <h2 data-aos="fade-right" className="text-2xl font-bold mb-4">
                            Adakah saran & kritik untuk kami?
                        </h2>
                        <p data-aos="fade-right" data-aos-delay="300" className="mb-6">
                            Kami menghargai setiap masukan yang Anda berikan. Saran dan kritik Anda membantu kami untuk terus meningkatkan layanan demi kepuasan bersama.
                        </p>
                        <form data-aos="flip-right" data-aos-delay="750" onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="col-span-2 md:col-span-1">
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                                    <input type="text" name="firstName" id="firstName" value={form.firstName} onChange={handleChange} className="mt-1 focus:ring-green focus:border-green block w-full shadow-sm sm:text-sm border-gray-300 rounded border-0 border-b-2" required />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                                    <input type="text" name="lastName" id="lastName" value={form.lastName} onChange={handleChange} className="mt-1 focus:ring-green focus:border-green block w-full shadow-sm sm:text-sm border-gray-300 rounded border-0 border-b-2" required />
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" name="email" id="email" value={form.email} onChange={handleChange} className="mt-1 focus:ring-green focus:border-green block w-full shadow-sm sm:text-sm border-gray-300 rounded border-0 border-b-2" required />
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                                    <input type="text" name="subject" id="subject" value={form.subject} onChange={handleChange} className="mt-1 focus:ring-green focus:border-green block w-full shadow-sm sm:text-sm border-gray-300 rounded border-0 border-b-2" required />
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                    <textarea id="message" name="message" rows="3" value={form.message} onChange={handleChange} className="mt-1 focus:ring-green focus:border-green block w-full shadow-sm sm:text-sm border-gray-300 rounded border-b-2" placeholder="Tulis pesan disini" required></textarea>
                                </div>
                            </div>
                            <div className="mt-6">
                                <button type="submit" className="bg-yellow hover:bg-yellow-2 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                    Kirimkan pesan
                                </button>
                            </div>
                        </form>
                    </div>
                    <div data-aos="fade-left" data-aos-delay="1000" className="w-full md:block hidden">
                        <img className="max-w-[480px]" src="/img/saran.png" alt="Hero Image" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeedbackSection;
