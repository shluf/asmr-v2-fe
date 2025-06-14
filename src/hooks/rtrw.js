import axios from '@/lib/axios'
import { useState, useEffect } from 'react'
import { showAlert } from "@/components/partials/Alert"

export const useRtRw = () => {
    const [rwList, setRwList] = useState([])
    const [rwError, setRwError] = useState(null)
    const [isRwLoading, setIsRwLoading] = useState(true)
    const [isRtLoading, setIsRtLoading] = useState(false)

    useEffect(() => {
        const fetchRw = async () => {
            setIsRwLoading(true)
            setRwError(null)
            try {
                const response = await axios.get('/api/wilayah/rw')
                if (response.status === 200 && response.data && response.data.success) {
                    const mappedRwList = (response.data.data || []).map(rw => ({
                        id: rw.id_rw,
                        nama_rw: rw.nama_rw,
                        pejabat: rw.pejabat || null,
                    }))
                    setRwList(mappedRwList)
                } else {
                    setRwList([])
                    const errorMsg = response.data?.message || "Gagal mengambil data RW atau format salah."
                    setRwError({ message: errorMsg })
                    showAlert({
                        title: "Gagal Ambil Data RW",
                        desc: errorMsg,
                        message: "Tidak dapat memuat daftar RW.",
                        success: false,
                        color: "orange",
                    })
                }
            } catch (error) {
                const errorMsg = error.response?.data?.message || error.message
                setRwError(error)
                setRwList([])
                showAlert({
                    title: "Kesalahan Server (RW)",
                    desc: errorMsg,
                    message: "Terjadi kesalahan saat mengambil data RW.",
                    success: false,
                    color: "red",
                })
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
            if (response.status === 200 && response.data && response.data.success) {
                setIsRtLoading(false)
                return response.data.data || []
            } else {
                setIsRtLoading(false)
                const errorMsg = response.data?.message || `Gagal mengambil data RT untuk RW ${rwId}.`
                showAlert({
                    title: "Gagal Ambil Data RT",
                    desc: errorMsg,
                    message: "Tidak dapat memuat daftar RT.",
                    success: false,
                    color: "orange",
                })
                return []
            }
        } catch (error) {
            setIsRtLoading(false)
            const errorMsg = error.response?.data?.message || error.message
            showAlert({
                title: `Kesalahan Server (RT untuk RW ${rwId})`,
                desc: errorMsg,
                message: "Terjadi kesalahan saat mengambil data RT.",
                success: false,
                color: "red",
            })
            return []
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