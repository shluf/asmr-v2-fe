'use client'

import Checkbox from '@/components/Atom/Checkbox'
import InputError from '@/components/Atom/InputError'
import InputLabel from '@/components/Atom/InputLabel'
import { AlertWrapper, showAlert } from '@/components/Atom/Alert'
import PrimaryButton from '@/components/Atom/PrimaryButton'
import TextInput from '@/components/Atom/TextInput'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const LoginForm = () => {
    const router = useRouter()

    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [data, setData] = useState({
        login: '',
        password: '',
        remember: false
    })
    const [errors, setErrors] = useState([])
    const [processing, setProcessing] = useState(false)
    const [status, setStatus] = useState(null)

    useEffect(() => {
        if (status) {
            showAlert({
                title: "Berhasil",
                desc: "Login berhasil",
                message: "Anda akan diarahkan ke halaman dashboard",
                succes: true,
                color: "green",
            });
        }
    }, [status])

    const submitForm = async event => {
        event.preventDefault()
        setProcessing(true)

        login({
            email: data.login,
            password: data.password,
            remember: data.remember,
            setErrors,
            setStatus,
        })

        setProcessing(false)
    }

    return (
        <>
            <AlertWrapper />
            <form onSubmit={submitForm}>
                <div>
                    <InputLabel htmlFor="login" value="Email" />

                    <TextInput
                        color="green"
                        id="login"
                        name="login"
                        value={data.login}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData({...data, login: e.target.value})}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        color="green"
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData({...data, password: e.target.value})}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData({...data, remember: e.target.checked})
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="mt-4 flex flex-col gap-4 items-center justify-center">
                    <Link
                        href="/forgot-password"
                        className="rounded-md text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2"
                    >
                        Lupa password?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing} color={'green'}>
                        Masuk
                    </PrimaryButton>
                </div>
            </form>
        </>
    )
}

export default LoginForm
