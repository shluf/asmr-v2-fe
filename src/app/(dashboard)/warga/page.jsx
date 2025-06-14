"use client"

import { useAuth } from '@/hooks/auth'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardContent from '@/components/Contents/Warga/DashboardContent'
import Loading from '@/components/partials/Loading'

export default function WargaDashboard() {
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
            <DashboardContent />
        </div>
    )
} 