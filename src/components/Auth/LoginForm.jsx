'use client'

import Checkbox from '@/components/Atoms/Checkbox'
import InputError from '@/components/Atoms/InputError'
import InputLabel from '@/components/Atoms/InputLabel'
import { AlertWrapper, showAlert } from '@/components/Atoms/Alert'
import PrimaryButton from '@/components/Atoms/PrimaryButton'
import TextInput from '@/components/Atoms/TextInput'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const LoginForm = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirect = searchParams.get('redirect')

    const { login } = useAuth({
        middleware: 'guest',
        // Tidak langsung set redirectIfAuthenticated di sini,
        // akan dihandle manual setelah login berhasil berdasarkan role
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
        
        if (errors.general) {
            showAlert({
                title: "Gagal",
                desc: errors.general[0],
                message: "Silahkan coba lagi",
                succes: false,
                color: "red",
            });
        }
    }, [status, errors])

    const redirectBasedOnRole = (userRole) => {
        
        const roleRedirectMap = {
            admin: '/admin',
            warga: '/warga',
            pejabatrt: '/rt',
            pejabatrw: '/rw'
        }
        
        // Jika ada redirect parameter dari query, gunakan itu
        if (redirect) {
            router.push(redirect)
            return
        }
        
        // Jika tidak, redirect berdasarkan role
        if (userRole && roleRedirectMap[userRole]) {
            router.push(roleRedirectMap[userRole])
            return
        }
        
        router.push('/dashboard')
    }

    const submitForm = async event => {
        event.preventDefault()
        setProcessing(true)

        try {
            const loginResult = await login({
                email: data.login,
                password: data.password,
                remember: data.remember,
                setErrors,
                setStatus,
            })
            
            if (loginResult === true) {
                // Decode token for role
                const authToken = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('auth_token='))
                    ?.split('=')[1]
                
                let userRole = null
                
                if (authToken) {
                    try {
                        const tokenParts = authToken.split('.')
                        if (tokenParts.length > 1) {
                            const payload = JSON.parse(atob(tokenParts[1]))
                            userRole = payload.role
                        }
                    } catch (error) {
                        console.error('Error parsing token:', error)
                    }
                }
                
                // Redirect berdasarkan role user
                redirectBasedOnRole(userRole)
            }
        } catch (error) {
            console.error('Form submission error:', error)
        } finally {
            setProcessing(false)
        }
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
