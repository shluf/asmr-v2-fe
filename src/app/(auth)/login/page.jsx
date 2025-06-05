import Loading from '@/components/partials/Loading'
import LoginForm from '@/components/Auth/LoginForm'
import GuestLayout from '@/components/Layout/GuestLayout'
import { Suspense } from 'react'

export const metadata = {
    title: 'ASMR - Login',
    description: 'Login ke Aplikasi Surat Menyurat Rt/Rw'
}

const Page = () => {
    return (
        <GuestLayout button="register" header="Login" wide={false}>
            <Suspense fallback={<Loading />}>
                <LoginForm />
            </Suspense>
        </GuestLayout>
    )
}

export default Page
