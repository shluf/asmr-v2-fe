import { Poppins } from 'next/font/google'
import '@/app/global.css'

const poppinsFont = Poppins({
    subsets: ['latin'],
    display: 'swap',
    weight: ['400', '500', '600' , '700'],
})

const RootLayout = ({ children }) => {
    return (
        <html lang="en" className={poppinsFont.className}>
            <body className="antialiased">{children}</body>
        </html>
    )
}

export const metadata = {
    title: 'ASMR - Portal Surat Menyurat',
    description: 'Solusi Praktis dan Cepat untuk Administrasi Surat Menyurat',
}

export default RootLayout
