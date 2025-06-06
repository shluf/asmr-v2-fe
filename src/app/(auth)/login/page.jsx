import LoginForm from '@/components/Auth/LoginForm'
import GuestLayout from '@/components/Layout/GuestLayout'
import LoadingSpinner from '@/components/partials/LoadingSpinner'
import { Suspense } from 'react'

export const metadata = {
    title: 'ASMR - Login',
    description: 'Login ke Aplikasi Surat Menyurat Rt/Rw'
}

const Page = () => {
    return (
        <GuestLayout button="register" header="Login" wide={false}>
            <Suspense fallback={<LoadingSpinner />}>
                <LoginForm />
            </Suspense>
        </GuestLayout>
    )
}

export default Page
