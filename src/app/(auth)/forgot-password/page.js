import ForgotPasswordForm from '@/components/Auth/ForgotPasswordForm'
import GuestLayout from '@/components/Layout/GuestLayout'

export const metadata = {
    title: 'ASMR - Lupa Password',
    description: 'Lupa password Aplikasi Surat Menyurat Rt/Rw'
}

const Page = () => {
    return (
        <GuestLayout button="all" header="Lupa Password" wide={false}>
            <ForgotPasswordForm />
        </GuestLayout>
    )
}

export default Page
