import LoginForm from '@/components/Auth/LoginForm'
import GuestLayout from '@/components/Layout/GuestLayout'
import { Loader2Icon } from 'lucide-react'
import { Suspense } from 'react'

export const metadata = {
    title: 'ASMR - Login',
    description: 'Login ke Aplikasi Surat Menyurat Rt/Rw'
}

const Page = () => {
    return (
        <GuestLayout button="register" header="Login" wide={false}>
            <Suspense fallback={<Loader2Icon className="animate-spin" />}>
                <LoginForm />
            </Suspense>
        </GuestLayout>
    )
}

export default Page
