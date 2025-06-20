"use client"

import { useAuth } from '@/hooks/auth'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import PengajuanMasalah from '@/components/Contents/RT/PengajuanMasalah'
import Loading from '@/components/partials/Loading'

export default function PengajuanMasalahPage() {
    const { user } = useAuth({ middleware: 'auth' })
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (user) {
            setIsLoading(false)
            if (user.role !== 'PejabatRT') {
                router.push('/dashboard')
            }
        }
    }, [user, router])

    if (isLoading || !user) {
        return <Loading />
    }

    if (user.role !== 'PejabatRT') {
        return null
    }

    return (
        <div className="p-4">
            <PengajuanMasalah />
        </div>
    )
} 