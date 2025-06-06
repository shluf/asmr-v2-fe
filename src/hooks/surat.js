import { useState } from "react"
import axios from "@/lib/axios"
import { showAlert } from "@/components/partials/Alert"

export const useSuratActions = (refetchCallback) => {
    const [isActionLoading, setActionLoading] = useState({})

    const terbitkanSurat = async (id_approval) => {
        setActionLoading(prev => ({ ...prev, [`terbit_${id_approval}`]: true }))
        try {
            const response = await axios.get(`/api/surat/${id_approval}/generate`)
            if (response.status === 200 && response.data && response.data.status === 'success') {
                showAlert({
                    title: "Berhasil!",
                    desc: response.data.message || "Surat berhasil diterbitkan.",
                    message: "Data telah diperbarui.",
                    success: true,
                    color: "green",
                })
                if (refetchCallback) {
                    await refetchCallback()
                }
            } else {
                showAlert({
                    title: "Gagal Terbitkan Surat",
                    desc: response.data?.message || "Tidak dapat menerbitkan surat.",
                    success: false,
                    color: "orange",
                })
            }
        } catch (error) {
            showAlert({
                title: "Terjadi Kesalahan",
                desc: error.response?.data?.message || error.message,
                message: "Gagal menerbitkan surat.",
                success: false,
                color: "red",
            })
        } finally {
            setActionLoading(prev => ({ ...prev, [`terbit_${id_approval}`]: false }))
        }
    }

    const previewSurat = async (id_approval) => {
        setActionLoading(prev => ({ ...prev, [`preview_${id_approval}`]: true }))
        try {
            const response = await axios.get(`/api/surat/${id_approval}/preview`, { responseType: 'blob' })
            if (response.status === 200) {
                const blob = new Blob([response.data], { type: 'application/pdf' })
                const url = window.URL.createObjectURL(blob)
                window.open(url, '_blank')
            } else {
                showAlert({
                    title: "Gagal Memuat Pratinjau",
                    desc: "Gagal memuat pratinjau surat.",
                    success: false,
                    color: "orange",
                })
            }
        } catch (error) {
            showAlert({
                title: "Terjadi Kesalahan",
                desc: error.response?.data?.message || "Gagal memuat pratinjau surat.",
                message: "Gagal memuat pratinjau surat.",
                success: false,
                color: "red",
            })
        } finally {
            setActionLoading(prev => ({ ...prev, [`preview_${id_approval}`]: false }))
        }
    }

    const downloadSurat = async (id_approval) => {
        setActionLoading(prev => ({ ...prev, [`download_${id_approval}`]: true }))
        try {
            const response = await axios.get(`/api/surat/${id_approval}/download`, { responseType: 'blob' })
            if (response.status === 200) {
                const disposition = response.headers['content-disposition']
                let filename = `surat_${id_approval}.pdf`
                if (disposition && disposition.indexOf('attachment') !== -1) {
                    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
                    const matches = filenameRegex.exec(disposition)
                    if (matches != null && matches[1]) { 
                        filename = matches[1].replace(/['"]/g, '')
                    }
                }
                
                const blob = new Blob([response.data], { type: 'application/pdf' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = filename
                document.body.appendChild(a)
                a.click()
                a.remove()
                window.URL.revokeObjectURL(url)
            } else {
                 showAlert({
                    title: "Gagal Mengunduh",
                    desc: "Gagal mengunduh surat.",
                    success: false,
                    color: "orange",
                })
            }
        } catch (error) {
            showAlert({
                title: "Terjadi Kesalahan",
                desc: error.response?.data?.message || "Gagal mengunduh surat.",
                message: "Gagal mengunduh surat.",
                success: false,
                color: "red",
            })
        } finally {
            setActionLoading(prev => ({ ...prev, [`download_${id_approval}`]: false }))
        }
    }

    return {
        isSuratActionLoading: isActionLoading,
        terbitkanSurat,
        previewSurat,
        downloadSurat,
    }
}
