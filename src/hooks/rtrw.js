import axios from '@/lib/axios'
import { useState, useEffect } from 'react'

export const useRtRw = () => {
    const [rwList, setRwList] = useState([])
    const [rwError, setRwError] = useState(null)
    const [isRwLoading, setIsRwLoading] = useState(true)
    const [isRtLoading, setIsRtLoading] = useState(false)

    useEffect(() => {
        const fetchRw = async () => {
            setIsRwLoading(true)
            try {
                const response = await axios.get('/api/wilayah/rw')
                setRwList(response.data || [])
            } catch (error) {
                setRwError(error)
                setRwList([])
            } finally {
                setIsRwLoading(false)
            }
        }
        
        fetchRw()
    }, [])

    const getRtList = async (rwId) => {
        setIsRtLoading(true)
        try {
            const response = await axios.get(`/api/wilayah/rt/${rwId}`)
            const result = response.data || []
            setIsRtLoading(false)
            return result
        } catch (error) {
            setIsRtLoading(false)
            throw error
        }
    }

    return {
        rwList,
        rwError,
        getRtList,
        isRwLoading,
        isRtLoading,
    }
}