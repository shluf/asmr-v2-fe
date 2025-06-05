import RegisterForm from '@/components/Auth/RegisterForm'
import GuestLayout from '@/components/Layout/GuestLayout'
import { Loader2Icon } from 'lucide-react'
import { Suspense } from 'react'

export const metadata = {
    title: 'ASMR - Register',
    description: 'Registrasi ke Aplikasi Surat Menyurat Rt/Rw'
}

const Page = () => {
    return (
        <GuestLayout button="login" header="Register" wide={true}>
            <Suspense fallback={<Loader2Icon className="animate-spin" />}>
                <RegisterForm />
            </Suspense>
        </GuestLayout>
    )
}

export default Page
