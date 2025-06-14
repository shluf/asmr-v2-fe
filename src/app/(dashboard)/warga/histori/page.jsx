"use client"

import { useAuth } from '@/hooks/auth'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import HistoriPengajuan from '@/components/Contents/Warga/HistoriPengajuan'
import Loading from '@/components/partials/Loading'

export default function HistoriPage() {
    const { user } = useAuth({ middleware: 'auth' })
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (user) {
            setIsLoading(false)
            if (user.role !== 'Warga') {
                router.push('/dashboard')
            }
        }
    }, [user, router])

    if (isLoading || !user) {
        return <Loading />
    }

    if (user.role !== 'Warga') {
        return null
    }

    return (
        <div className="p-4">
            <HistoriPengajuan nikWarga={user?.nik} />
        </div>
    )
} 