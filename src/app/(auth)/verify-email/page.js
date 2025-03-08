import VerifyEmailForm from '@/components/Auth/VerifyEmailForm'
import GuestLayout from '@/components/Layout/GuestLayout'

export const metadata = {
    title: 'ASMR - Verifikasi Email',
    description: 'Verifikasi email Aplikasi Surat Menyurat Rt/Rw'
}

const Page = () => {
    return (
        <GuestLayout button="all" header="Verifikasi Email" wide={false}>
            <VerifyEmailForm />
        </GuestLayout>
    )
}

export default Page
