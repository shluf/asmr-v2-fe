"use client"

import { useAuth } from '@/hooks/auth'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import RekapPengajuan from '@/components/Contents/RW/RekapPengajuan'

export default function RekapPengajuanPage() {
    const { user } = useAuth({ middleware: 'auth' })
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (user) {
            setIsLoading(false)
            if (user.role !== 'PejabatRW') {
                router.push('/dashboard')
            }
        }
    }, [user, router])

    if (isLoading || !user) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>
    }

    if (user.role !== 'PejabatRW') {
        return null
    }

    const { select } = useParams()

    return (
        <div className="p-4">
            <RekapPengajuan select={select}/>
        </div>
    )
} 