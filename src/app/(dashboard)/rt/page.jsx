"use client"

import { useAuth } from '@/hooks/auth'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardContent from '@/components/Contents/RT/DashboardContent'
import Loading from '@/components/partials/Loading'

export default function RTDashboard() {
    const { user } = useAuth({ middleware: 'auth' })
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (user) {
            setIsLoading(false)
        }
    }, [user])

    useEffect(() => {
        if (user && !isLoading && user.role !== 'PejabatRT') {
            router.push('/dashboard')
        }
    }, [user, isLoading, router])

    if (isLoading || !user) {
        return <Loading />
    }

    if (user.role !== 'PejabatRT') {
        return null
    }

    return (
        <div className="p-4">
            <DashboardContent />
        </div>
    )
} 