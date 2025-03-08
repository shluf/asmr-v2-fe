
import RegisterForm from '@/components/Auth/RegisterForm'
import GuestLayout from '@/components/Layout/GuestLayout'

export const metadata = {
    title: 'ASMR - Register',
    description: 'Registrasi ke Aplikasi Surat Menyurat Rt/Rw'
}

const Page = () => {
    return (
        <GuestLayout button="login" header="Register" wide={true}>
            <RegisterForm />
        </GuestLayout>
    )
}

export default Page
