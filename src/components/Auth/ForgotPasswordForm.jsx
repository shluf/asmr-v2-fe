'use client'

import { useAuth } from '@/hooks/auth'
import { useRef, useState } from 'react'
import AuthSessionStatus from '@/app/(auth)/AuthSessionStatus'
import TextInput from '@/components/Atoms/TextInput'
import InputError from '@/components/Atoms/InputError'
import InputLabel from '@/components/Atoms/InputLabel'
import PrimaryButton from '@/components/Atoms/PrimaryButton'
import ReCAPTCHA from 'react-google-recaptcha'
import { useSearchParams } from 'next/navigation'
import { AlertWrapper, showAlert } from '../partials/Alert'

const ForgotPasswordForm = () => {
    const searchParams = useSearchParams()
    const redirect = searchParams.get('redirect')
    
    const { forgotPassword } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: redirect || '/dashboard',
    })

    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)
    const [processing, setProcessing] = useState(false)

    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
    const recaptchaRef = useRef()

    const submitForm = async event => {
        event.preventDefault()
        setProcessing(true)

        const recaptchaValue = recaptchaRef.current.getValue()
        if (!recaptchaValue) {
            showAlert({
                title: "Gagal Reset Password",
                desc: "Captcha belum terselesaikan",
                message: "Silakan selesaikan CAPTCHA",
                success: false,
                color: "red",
            })
            setProcessing(false)
            return
        }

        try {
            // Panggil API forgotPassword dengan parameter yang benar
            await forgotPassword({
                setErrors,
                setStatus,
                email,
            })
            
            // Reset captcha
            recaptchaRef.current.reset()
            
            showAlert({
                title: "Berhasil",
                desc: "Link untuk mereset password telah terkirim",
                message: "Silakan cek email anda untuk melanjutkan",
                success: true,
                color: "green",
            })
        } catch (error) {
            showAlert({
                title: "Gagal",
                desc: "Gagal mengirim link reset password",
                message: "Silakan coba lagi",
                success: false,
                color: "red",
            })
        }

        setProcessing(false)
    }

    return (
        <>
            <AlertWrapper />
            <div className="mb-4 text-sm text-gray-600">
                Lupa kata sandi Anda? Tidak masalah. Cukup beri tahu kami email Anda
                dan kami akan mengirimi Anda tautan pengaturan ulang kata sandi melalui email 
                yang akan memungkinkan Anda memilih kata sandi yang baru.
            </div>

            <AuthSessionStatus className="mb-4" status={status} />

            <form onSubmit={submitForm} className='flex flex-col justify-center items-center'>
                <div className='w-full'>
                    <InputLabel htmlFor="email" value="Email Anda" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={email}
                        className="mt-1 block w-full"
                        onChange={event => setEmail(event.target.value)}
                        required
                        autoFocus
                        color="green"
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={siteKey}
                    />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton color="green" disabled={processing}>
                        Email Link Reset Password
                    </PrimaryButton>
                </div>
            </form>
        </>
    )
}

export default ForgotPasswordForm
