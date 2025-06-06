import RegisterForm from '@/components/Auth/RegisterForm'
import GuestLayout from '@/components/Layout/GuestLayout'
import LoadingSpinner from '@/components/partials/LoadingSpinner'
import { Suspense } from 'react'

export const metadata = {
    title: 'ASMR - Register',
    description: 'Registrasi ke Aplikasi Surat Menyurat Rt/Rw'
}

const Page = () => {
    return (
        <GuestLayout button="login" header="Register" wide={true}>
            <Suspense fallback={<LoadingSpinner />}>
                <RegisterForm />
            </Suspense>
        </GuestLayout>
    )
}

export default Page
