'use client'

import { useAuth } from '@/hooks/auth'
import { useState } from 'react'
import PrimaryButton from '@/components/Atom/PrimaryButton'
import { AlertWrapper, showAlert } from '@/components/Atom/Alert'

const VerifyEmailForm = () => {
    const { logout, resendEmailVerification } = useAuth({
        middleware: 'auth',
        redirectIfAuthenticated: '/dashboard',
    })

    const [status, setStatus] = useState(null)
    const [processing, setProcessing] = useState(false)

    const resendEmail = async () => {
        setProcessing(true)
        
        try {
            await resendEmailVerification({ setStatus })
            showAlert({
                title: "Berhasil",
                desc: "Email verifikasi telah dikirim",
                message: "Silakan cek email Anda untuk melanjutkan verifikasi",
                succes: true,
                color: "green",
            })
        } catch (error) {
            showAlert({
                title: "Gagal",
                desc: "Gagal mengirim email verifikasi",
                message: "Silakan coba lagi",
                succes: false,
                color: "red",
            })
        }

        setProcessing(false)
    }

    return (
        <>
            <AlertWrapper />
            <div className="mb-4 text-sm text-gray-600">
                Terima kasih telah mendaftar! Sebelum memulai, dapatkah Anda memverifikasi
                alamat email Anda dengan mengklik tautan yang baru saja kami kirimkan
                kepada Anda? Jika Anda tidak menerima email tersebut, kami akan dengan
                senang hati mengirimkan email yang baru.
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    Tautan verifikasi baru telah dikirim ke alamat email yang
                    Anda berikan saat pendaftaran.
                </div>
            )}

            <div className="mt-4 flex items-center justify-between">
                <PrimaryButton
                    onClick={resendEmail}
                    disabled={processing}
                    color="green"
                >
                    Kirim Ulang Email Verifikasi
                </PrimaryButton>

                <button
                    type="button"
                    className="underline text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => logout()}>
                    Keluar
                </button>
            </div>
        </>
    )
}

export default VerifyEmailForm
