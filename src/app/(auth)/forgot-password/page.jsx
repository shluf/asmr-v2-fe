import Loading from '@/components/partials/Loading'
import ForgotPasswordForm from '@/components/Auth/ForgotPasswordForm'
import GuestLayout from '@/components/Layout/GuestLayout'
import { Suspense } from 'react'

export const metadata = {
    title: 'ASMR - Lupa Password',
    description: 'Lupa password Aplikasi Surat Menyurat Rt/Rw'
}

const Page = () => {
    return (
        <GuestLayout button="all" header="Lupa Password" wide={false}>
            <Suspense fallback={<Loading />}>
                <ForgotPasswordForm />
            </Suspense>
        </GuestLayout>
    )
}

export default Page
