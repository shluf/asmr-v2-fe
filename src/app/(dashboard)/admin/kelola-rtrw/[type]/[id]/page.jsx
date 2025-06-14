'use client'

import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/auth'
import { useEffect, useState } from 'react'
import KelolaRTRW from '@/components/Contents/Admin/KelolaRTRW'
import Loading from '@/components/partials/Loading'

export default function EditKelolaRTRWPage() {
  const { user } = useAuth({ middleware: 'auth' })
  const router = useRouter()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)

  const type = params?.type
  const id = params?.id

  useEffect(() => {
    if (user) {
      setIsLoading(false)
      if (user.role !== 'Admin') {
        router.push('/dashboard')
      }
    }
  }, [user, router, type, id])

  if (isLoading || !user) return <Loading />
  if (user.role !== 'Admin') return null

  return (
    <div className="p-4">
      <KelolaRTRW initialType={type} initialId={id} />
    </div>
  )
}
