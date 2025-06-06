import ForgotPasswordForm from '@/components/Auth/ForgotPasswordForm'
import GuestLayout from '@/components/Layout/GuestLayout'
import LoadingSpinner from '@/components/partials/LoadingSpinner'
import { Suspense } from 'react'

export const metadata = {
    title: 'ASMR - Lupa Password',
    description: 'Lupa password Aplikasi Surat Menyurat Rt/Rw'
}

const Page = () => {
    return (
        <GuestLayout button="all" header="Lupa Password" wide={false}>
            <Suspense fallback={<LoadingSpinner />}>
                <ForgotPasswordForm />
            </Suspense>
        </GuestLayout>
    )
}

export default Page
