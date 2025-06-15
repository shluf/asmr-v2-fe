import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter()
    const params = useParams()
    const [isLoading, setIsLoading] = useState(true)

    // Fetch user dengan SWR
    const { data: user, error, mutate } = useSWR('/api/user', () =>
        axios
            .get('/api/user')
            .then(res => {
                setIsLoading(false)
                // console.log('User data response:', res.data)
                return res.data
            })
            .catch(error => {
                setIsLoading(false)
                // console.error('Error fetching user:', error.response?.data || error)
                if (error.response?.status !== 409) throw error
                router.push('/verify-email')
            }),
        { 
            revalidateOnFocus: false, 
            shouldRetryOnError: false,
            onErrorRetry: (error) => {
                if (error.status === 401 || error.status === 419) return
            }
        }
    )

    // CSRF cookie endpoint
    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const register = async ({ setErrors, ...props }) => {
        try {
            await csrf()
            setErrors([])

            const response = await axios.post('/api/register', props)
            // console.log('Register response:', response.data)
            
            return response.status
        } catch (error) {
            // console.error('Register error:', error.response?.data || error)
            if (error.response?.status === 500 && error.response?.data?.error) {
                setErrors({ general: [error.response.data.error] })
            } else if (error.response?.status !== 422) {
                setErrors({ general: ['Terjadi kesalahan pada server'] })
            } else {
                setErrors(error.response?.data?.errors || {})
            }
            return error.response?.status || 500
        }
    }

    const login = async ({ setErrors, setStatus, ...props }) => {
        try {
            setIsLoading(true)
            
            await csrf()
            
            setErrors([])
            setStatus(null)

            // console.log('Sending login request to /api/login with data:', { 
            //     email: props.email, 
            //     password: '[REDACTED]', 
            //     remember: props.remember 
            // })

            const response = await axios.post('/api/login', {
                email: props.email,
                password: props.password,
                remember: props.remember ? 1 : 0 
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })

            // console.log('Login response:', response.data)

            if (response.status === 401) {
                setErrors({ general: [response.data.error] })
            }

            if (response.data && response.data.token) {
                const token = response.data.token
                const maxAge = props.remember ? 30 * 24 * 60 * 60 : 24 * 60 * 60 // 30 hari : 1 hari
                
                document.cookie = `auth_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
                
                if (response.data.user) {
                    await mutate(response.data.user)
                } else {
                    await mutate()
                }
                
                setStatus('success')
                setIsLoading(false)
                return true
            } else {
                // console.error('Invalid login response format:', response.data)
                setErrors({ general: ['Format respons login tidak valid'] })
                setIsLoading(false)
                return false
            }
        } catch (error) {
            setIsLoading(false)
            // console.error('Login error:', error.response?.data || error)
            
            if (error.response?.data?.error) {
                setErrors({ general: [error.response.data.error] })
            } else if (error.response?.data?.message) {
                setErrors({ general: [error.response.data.message] })
            } else {
                setErrors({ general: ['Terjadi kesalahan pada server'] })
            }
            return false
        }
    }

    const forgotPassword = async ({ setErrors, setStatus, email }) => {
        try {
            await csrf()
            setErrors([])
            setStatus(null)

            const response = await axios.post('/api/forgot-password', { email })
            setStatus(response.data.status)
        } catch (error) {
            if (error.response?.status !== 422) throw error
            setErrors(error.response?.data?.errors || {})
        }
    }

    const resetPassword = async ({ setErrors, setStatus, ...props }) => {
        try {
            await csrf()
            setErrors([])
            setStatus(null)

            const response = await axios.post('/api/reset-password', { token: params.token, ...props })
            // Router.push untuk Next.js App Router
            router.push('/login?reset=' + btoa(response.data.status))
        } catch (error) {
            if (error.response?.status !== 422) throw error
            setErrors(error.response?.data?.errors || {})
        }
    }

    const resendEmailVerification = ({ setStatus }) => {
        axios
            .post('/api/email/verification-notification')
            .then(response => setStatus(response.data.status))
    }

    const logout = async () => {
        try {
            if (!error) {
                const response = await axios.post('/api/logout')
                
                if (response.data.status === 'success') {
                    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax'
                    delete axios.defaults.headers.common['Authorization']
                    await mutate(null)
                    router.push('/login')
                }
            }
        } catch (e) {
            // console.error('Logout error:', e)
            // Hapus cookie sebagai fallback
            // document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax'
            // delete axios.defaults.headers.common['Authorization']
            // await mutate(null)
            // router.push('/login')
        }
    }

    useEffect(() => {
        // Cek auth token dari cookie saat inisialisasi
        const authToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('auth_token='))
            ?.split('=')[1]
            
        if (authToken) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
        }
        
        // Inisialisasi state loading
        if (!user && !error) {
            setIsLoading(true)
        } else {
            setIsLoading(false)
        }
        
        // Implementasikan middleware
        if (middleware === 'auth' && error) {
            document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax'
            delete axios.defaults.headers.common['Authorization']
            router.push('/login')
            return
        }
        
        if (middleware === 'guest' && user && redirectIfAuthenticated) {
            router.push(redirectIfAuthenticated)
        }
        
        if (window.location.pathname === '/verify-email' && user?.email_verified_at && redirectIfAuthenticated) {
            router.push(redirectIfAuthenticated)
        }
    }, [user, error, middleware, redirectIfAuthenticated])

    return {
        user,
        isLoading,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
    }
}
