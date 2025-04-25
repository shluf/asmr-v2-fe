'use client'

import { useAuth } from '@/hooks/auth'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import AuthSessionStatus from '@/app/(auth)/AuthSessionStatus'
import TextInput from '@/components/Atoms/TextInput'
import InputError from '@/components/Atoms/InputError'
import InputLabel from '@/components/Atoms/InputLabel'
import PrimaryButton from '@/components/Atoms/PrimaryButton'
import { AlertWrapper, showAlert } from '@/components/Atoms/Alert'

const PasswordResetForm = () => {
    const searchParams = useSearchParams()
    const { resetPassword } = useAuth({ middleware: 'guest' })

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)
    const [processing, setProcessing] = useState(false)

    const submitForm = async event => {
        event.preventDefault()
        setProcessing(true)

        try {
            await resetPassword({
                email,
                password,
                password_confirmation: passwordConfirmation,
                setErrors,
                setStatus,
            })
            
            showAlert({
                title: "Berhasil",
                desc: "Password berhasil direset",
                message: "Silakan login dengan password baru Anda",
                succes: true,
                color: "green",
            })
        } catch (error) {
            showAlert({
                title: "Gagal",
                desc: "Gagal mereset password",
                message: "Silakan coba lagi",
                succes: false,
                color: "red",
            })
        }

        setProcessing(false)
    }

    useEffect(() => {
        setEmail(searchParams.get('email'))
    }, [searchParams])

    return (
        <>
            <AlertWrapper />
            <AuthSessionStatus className="mb-4" status={status} />

            <form onSubmit={submitForm}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
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
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        value={password}
                        className="mt-1 block w-full"
                        onChange={event => setPassword(event.target.value)}
                        required
                        color="green"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="passwordConfirmation" value="Konfirmasi Password" />
                    <TextInput
                        id="passwordConfirmation"
                        type="password"
                        value={passwordConfirmation}
                        className="mt-1 block w-full"
                        onChange={event => setPasswordConfirmation(event.target.value)}
                        required
                        color="green"
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-center">
                    <PrimaryButton color="green" disabled={processing}>
                        Reset Password
                    </PrimaryButton>
                </div>
            </form>
        </>
    )
}

export default PasswordResetForm
