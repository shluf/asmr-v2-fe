'use client'

import { useAuth } from '@/hooks/auth'
import { useRef, useState } from 'react'
import AuthSessionStatus from '@/app/(auth)/AuthSessionStatus'
import TextInput from '@/components/Atom/TextInput'
import InputError from '@/components/Atom/InputError'
import InputLabel from '@/components/Atom/InputLabel'
import PrimaryButton from '@/components/Atom/PrimaryButton'
import { AlertWrapper, showAlert } from '@/components/Atom/Alert'
import ReCAPTCHA from 'react-google-recaptcha'
import axios from 'axios'

const ForgotPasswordForm = () => {
    const { forgotPassword } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
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
                succes: false,
                color: "red",
            })
            setProcessing(false)
            return
        }

        const formData = {
            email,
            recaptcha: recaptchaValue,
        }

        try {
            await forgotPassword(formData)
            showAlert({
                title: "Berhasil",
                desc: "Link untuk mereset password telah terkirim",
                message: "Silakan cek email anda untuk melanjutkan",
                succes: true,
                color: "green",
            })
        } catch (error) {
            showAlert({
                title: "Gagal",
                desc: "Gagal mengirim link reset password",
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
