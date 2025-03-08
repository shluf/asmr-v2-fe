import PasswordResetForm from '@/components/Auth/PasswordResetForm'
import GuestLayout from '@/components/Layout/GuestLayout'

export const metadata = {
    title: 'ASMR - Reset Password',
    description: 'Reset password Aplikasi Surat Menyurat Rt/Rw'
}

const Page = () => {
    return (
        <GuestLayout button="all" header="Reset Password" wide={false}>
            <PasswordResetForm />
        </GuestLayout>
    )
}

export default Page
