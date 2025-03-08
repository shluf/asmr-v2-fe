import LoginForm from '@/components/Auth/LoginForm'
import GuestLayout from '@/components/Layout/GuestLayout'

export const metadata = {
    title: 'ASMR - Login',
    description: 'Login ke Aplikasi Surat Menyurat Rt/Rw'
}

const Page = () => {
    return (
        <GuestLayout button="register" header="Login" wide={false}>
            <LoginForm />
        </GuestLayout>
    )
}

export default Page
