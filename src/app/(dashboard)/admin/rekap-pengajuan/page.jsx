"use client"

import { useAuth } from '@/hooks/auth'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import RekapPengajuan from "@/components/Contents/Admin/RekapPengajuan"
import Loading from '@/components/partials/Loading'

export default function RekapPengajuanPage() {
    const { user } = useAuth({ middleware: 'auth' })
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (user) {
            setIsLoading(false)
            if (user.role !== 'Admin') {
                router.push('/dashboard')
            }
        }
    }, [user, router])

    if (isLoading || !user) {
        return <Loading />
    }

    if (user.role !== 'Admin') {
        return null
    }

    return (
        <div className="p-4">
            <RekapPengajuan />
        </div>
    )
} 