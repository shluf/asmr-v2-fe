import { useState, useEffect, useCallback } from "react"
import axios from "@/lib/axios"
import { showAlert } from "@/components/partials/Alert"
import { useSuratActions } from "@/hooks/surat"

export const useProgramKerjaRW = () => {
    const [dataProker, setDataProker] = useState([])
    const [prokerIsLoading, setProkerIsLoading] = useState(true)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [editProker, setEditProker] = useState({
        id_program_kerja: null,
        nama_program_kerja: "",
        tanggal_mulai: "",
        tanggal_selesai: "",
        waktu_mulai: "",
        waktu_selesai: "",
        tempat: "",
        penanggung_jawab: "",
    })
    const [tambahProker, setTambahProker] = useState({
        nama_program_kerja: "",
        tanggal_mulai: "",
        tanggal_selesai: "",
        waktu_mulai: "",
        waktu_selesai: "",
        tempat: "",
        penanggung_jawab: "",
    })
    const [isProcessing, setIsProcessing] = useState({
        edit: false,
        add: false,
        delete: false,
    })

    const fetchProkerData = useCallback(async () => {
        setProkerIsLoading(true)
        try {
            const response = await axios.get(`/api/proker/`)
            if (response.status === 200 && response.data && response.data.success) {
                setDataProker(response.data.data || [])
            } else {
                setDataProker([])
                showAlert({
                    title: "Gagal Memuat Program Kerja",
                    desc: response.data?.message || "Data program kerja tidak ditemukan atau format salah.",
                    message: "Tidak dapat memuat program kerja.",
                    success: false,
                    color: "orange",
                })
            }
        } catch (error) {
            setDataProker([])
            showAlert({
                title: "Gagal Memuat Data",
                desc: error.response?.data?.message || error.message,
                message: "Tidak dapat memuat program kerja.",
                success: false,
                color: "red",
            })
        } finally {
            setProkerIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchProkerData()
    }, [fetchProkerData])

    const handleEdit = (prokerItem) => {
        setEditProker({
            id_program_kerja: prokerItem.id,
            nama_program_kerja: prokerItem.nama_program_kerja || "",
            tanggal_mulai: prokerItem.tanggal_mulai || "",
            tanggal_selesai: prokerItem.tanggal_selesai || "",
            waktu_mulai: prokerItem.waktu_mulai || "",
            waktu_selesai: prokerItem.waktu_selesai || "",
            tempat: prokerItem.tempat || "",
            penanggung_jawab: prokerItem.penanggung_jawab || "",
        })
        setShowEditDialog(true)
    }

    const handleDelete = async (id) => {
        setIsProcessing((prev) => ({ ...prev, delete: true }))
        try {
            const response = await axios.delete(`/api/proker/${id}`)
            if (response.status === 200 && response.data && response.data.success){
                await fetchProkerData()
                showAlert({
                    title: "Berhasil!",
                    desc: response.data.message || "Program kerja berhasil dihapus.",
                    message: "Data telah diperbarui.",
                    success: true,
                    color: "green",
                })
            } else {
                 showAlert({
                    title: "Gagal Hapus",
                    desc: response.data?.message || "Tidak dapat menghapus program kerja.",
                    message: "Gagal menghapus program kerja.",
                    success: false,
                    color: "orange",
                })
            }
        } catch (error) {
            showAlert({
                title: "Terjadi Kesalahan",
                desc: error.response?.data?.message || error.message,
                message: "Gagal menghapus program kerja.",
                success: false,
                color: "red",
            })
        } finally {
            setIsProcessing((prev) => ({ ...prev, delete: false }))
        }
    }

    const handleAdd = () => {
        setTambahProker({
            nama_program_kerja: "",
            tanggal_mulai: "",
            tanggal_selesai: "",
            waktu_mulai: "",
            waktu_selesai: "",
            tempat: "",
            penanggung_jawab: "",
        })
        setShowAddDialog(true)
    }

    const handleSubmitEdit = async () => {
        setIsProcessing((prev) => ({ ...prev, edit: true }))
        try {
            const idToUpdate = editProker.id_program_kerja
            const payload = {
                nama_program_kerja: editProker.nama_program_kerja,
                tanggal_mulai: editProker.tanggal_mulai,
                tanggal_selesai: editProker.tanggal_selesai,
                waktu_mulai: editProker.waktu_mulai,
                waktu_selesai: editProker.waktu_selesai,
                tempat: editProker.tempat,
                penanggung_jawab: editProker.penanggung_jawab,
            }

            const response = await axios.put(
                `/api/proker/${idToUpdate}`,
                payload
            )
            if (response.status === 200 && response.data && response.data.success){
                await fetchProkerData()
                showAlert({
                    title: "Berhasil!",
                    desc: response.data.message || "Program kerja berhasil diperbarui.",
                    message: "Data telah diperbarui.",
                    success: true,
                    color: "green",
                })
                setShowEditDialog(false)
            } else {
                showAlert({
                    title: "Gagal Update",
                    desc: response.data?.message || "Tidak dapat memperbarui program kerja.",
                    message: "Gagal memperbarui program kerja.",
                    success: false,
                    color: "orange",
                })
            }
        } catch (error) {
            showAlert({
                title: "Terjadi Kesalahan",
                desc: error.response?.data?.errors?.message || error.response?.data?.message || error.message,
                message: "Gagal memperbarui program kerja.",
                success: false,
                color: "red",
            })
        } finally {
            setIsProcessing((prev) => ({ ...prev, edit: false }))
        }
    }

    const handleSubmitTambah = async () => {
        setIsProcessing((prev) => ({ ...prev, add: true }))
        try {
            const payload = { ...tambahProker }
            
            const response = await axios.post(`/api/proker/`, payload)
            if ((response.status === 201 || response.status === 200) && response.data && response.data.success){
                await fetchProkerData()
                showAlert({
                    title: "Berhasil!",
                    desc: response.data.message || "Program kerja berhasil ditambahkan.",
                    message: "Data telah diperbarui.",
                    success: true,
                    color: "green",
                })
                setTambahProker({ 
                    nama_program_kerja: "",
                    tanggal_mulai: "",
                    tanggal_selesai: "",
                    waktu_mulai: "",
                    waktu_selesai: "",
                    tempat: "",
                    penanggung_jawab: "",
                })
                setShowAddDialog(false)
            } else {
                showAlert({
                    title: "Gagal Tambah",
                    desc: response.data?.message || "Tidak dapat menambahkan program kerja.",
                    message: "Gagal menambahkan program kerja.",
                    success: false,
                    color: "orange",
                })
            }
        } catch (error) {
            showAlert({
                title: "Terjadi Kesalahan",
                desc: error.response?.data?.errors?.message || error.response?.data?.message || error.message,
                message: "Gagal menambahkan program kerja.",
                success: false,
                color: "red",
            })
        } finally {
            setIsProcessing((prev) => ({ ...prev, add: false }))
        }
    }

    return {
        dataProker,
        prokerIsLoading,
        showEditDialog,
        setShowEditDialog,
        showAddDialog,
        setShowAddDialog,
        editProker,
        setEditProker,
        tambahProker,
        setTambahProker,
        handleEdit,
        handleDelete,
        handleAdd,
        handleSubmitEdit,
        handleSubmitTambah,
        isProcessing,
        refetchProkerData: fetchProkerData
    }
}

export const usePengajuanTerbaruRW = (idRW) => {
    const [pengajuanTerakhirRW, setPengajuanTerakhirRW] = useState([])
    const [isLoadingPengajuanRW, setIsLoadingPengajuanRW] = useState(true)
    const [isActionLoadingRW, setIsActionLoadingRW] = useState({})

    const fetchPengajuanDataRW = useCallback(async () => {
        if (!idRW) {
            setPengajuanTerakhirRW([])
            setIsLoadingPengajuanRW(false)
            return
        }
        setIsLoadingPengajuanRW(true)
        try {
            const response = await axios.get(`/api/surat/pending/rw/${idRW}`, { params: { limit: 2 } })
            if (response.status === 200 && response.data && response.data.status === 'success') {
                setPengajuanTerakhirRW(response.data.data)
            } else {
                setPengajuanTerakhirRW([])
                showAlert({
                    title: "Gagal Memuat Pengajuan Terbaru RW",
                    desc: response.data?.message || "Data pengajuan tidak ditemukan atau format salah.",
                    message: "Tidak dapat memuat pengajuan terbaru.",
                    success: false,
                    color: "orange",
                })
            }
        } catch (error) {
            setPengajuanTerakhirRW([])
            showAlert({
                title: "Gagal Memuat Data",
                desc: error.response?.data?.message || error.message,
                message: "Tidak dapat memuat pengajuan terbaru.",
                success: false,
                color: "red",
            })
        } finally {
            setIsLoadingPengajuanRW(false)
        }
    }, [idRW])

    useEffect(() => {
        if (idRW) fetchPengajuanDataRW()
    }, [idRW, fetchPengajuanDataRW])

    const handleActionPengajuanRW = async (id_pengajuan_surat, approvalStatus, catatan = null) => {
        setIsActionLoadingRW(prev => ({ ...prev, [id_pengajuan_surat]: true }))
        try {
            const payload = {
                status_approval: approvalStatus === 'approved' ? 'Disetujui_RW' : 'Ditolak_RW',
                id_rw: idRW, 
            }
            if (catatan) {
                payload.catatan = catatan
            }

            const response = await axios.put(`/api/surat/${id_pengajuan_surat}/approval`, payload)
            
            if (response.status === 200 && response.data && response.data.status === 'success'){
                showAlert({
                    title: "Berhasil!",
                    desc: response.data.message || `Surat ini telah di ${approvalStatus === 'approved' ? 'setujui' : 'tolak'}.`,
                    message: "Status approval surat berhasil diperbarui.",
                    success: true,
                    color: "green",
                })
                await fetchPengajuanDataRW()
            } else {
                 showAlert({
                    title: "Gagal Update Status",
                    desc: response.data?.message || "Tidak dapat memperbarui status approval surat.",
                    message: "Gagal memperbarui status approval surat.",
                    success: false,
                    color: "orange",
                })
            }
        } catch (error) {
            showAlert({
                title: "Terjadi Kesalahan",
                desc: error.response?.data?.message || error.message,
                message: "Gagal memperbarui status approval surat.",
                success: false,
                color: "red",
            })
        } finally {
            setIsActionLoadingRW(prev => ({ ...prev, [id_pengajuan_surat]: false }))
        }
    }

    return {
        pengajuanTerakhirRW,
        isLoadingPengajuanRW,
        handleActionPengajuanRW,
        isActionLoadingRW,
        refetchPengajuanRW: fetchPengajuanDataRW
    }
}

export const useRekapPengajuanRW = (idRW, selectInitial) => {
    const [rekapPengajuanDataRW, setRekapPengajuanDataRW] = useState([])
    const [isLoadingRekapRW, setIsLoadingRekapRW] = useState(true)
    const [openItemsRW, setOpenItemsRW] = useState({})

    const fetchRekapDataRW = useCallback(async () => {
        if (!idRW) {
            setRekapPengajuanDataRW([])
            setIsLoadingRekapRW(false)
            return
        }
        setIsLoadingRekapRW(true)
        try {
            const response = await axios.get(`/api/surat/pending/rw/${idRW}`, { params : { all : true } }) 
            if (response.status === 200 && response.data && response.data.status === 'success') {

                setRekapPengajuanDataRW(response.data.data)
            
                if (selectInitial && response.data.data.length > 0) {
                    const initialItem = response.data.data.find(item => item.id === selectInitial)
                    if (initialItem) {
                        setOpenItemsRW({ [selectInitial]: true })
                    }
                }
            } else {
                setRekapPengajuanDataRW([])
                showAlert({
                    title: "Gagal Memuat Rekap RW",
                    desc: response.data?.message || "Data rekap pengajuan RW tidak ditemukan atau format salah.",
                    message: "Tidak dapat memuat data rekapitulasi pengajuan untuk RW.",
                    success: false,
                    color: "orange",
                })
            }
        } catch (error) {
            setRekapPengajuanDataRW([])
            showAlert({
                title: "Gagal Memuat Data",
                desc: error.response?.data?.message || error.message,
                message: "Tidak dapat memuat data rekapitulasi pengajuan untuk RW.",
                success: false,
                color: "red",
            })
        } finally {
            setIsLoadingRekapRW(false)
        }
    }, [idRW, selectInitial])

    useEffect(() => {
        if (idRW) fetchRekapDataRW()
    }, [idRW, fetchRekapDataRW, selectInitial])

    useEffect(() => {
        if (selectInitial && Array.isArray(rekapPengajuanDataRW) && rekapPengajuanDataRW.length > 0 && !openItemsRW[selectInitial]) {
            const initialItemExists = rekapPengajuanDataRW.some(item => item.id === selectInitial)
            if (initialItemExists) {
                setOpenItemsRW(prev => ({ ...prev, [selectInitial]: true }))
            }
        }
    }, [selectInitial, rekapPengajuanDataRW, openItemsRW])

    const { isSuratActionLoading, previewSurat, downloadSurat } = useSuratActions(fetchRekapDataRW)

    return { 
        rekapPengajuanDataRW, 
        isLoadingRekapRW, 
        openItemsRW, 
        setOpenItemsRW, 
        refetchRekapPengajuanRW: fetchRekapDataRW,
        isActionLoadingRW: isSuratActionLoading,
        previewSurat,
        downloadSurat,
    }
}

export const usePengajuanMasalahRW = (idRW) => {
    const [pengajuanMasalahDataRW, setPengajuanMasalahDataRW] = useState([])
    const [isLoadingDataRW, setIsLoadingDataRW] = useState(true)
    const [openItemsRW, setOpenItemsRW] = useState({}) 
    const [isActionLoadingRW, setIsActionLoadingRW] = useState({})

    const fetchMasalahDataRW = useCallback(async () => {
        if (!idRW) {
            setPengajuanMasalahDataRW([])
            setIsLoadingDataRW(false)
            return
        }
        setIsLoadingDataRW(true)
        try {
            const response = await axios.get(`/api/surat/pending/rw/${idRW}`) 
            if (response.status === 200 && response.data && response.data.status === 'success') {
                setPengajuanMasalahDataRW(response.data.data)
            } else {
                setPengajuanMasalahDataRW([])
                 showAlert({
                    title: "Gagal Memuat Pengajuan Masalah RW",
                    desc: response.data?.message || "Data pengajuan masalah RW tidak ditemukan atau format salah.",
                    message: "Tidak dapat memuat data pengajuan masalah untuk RW.",
                    success: false,
                    color: "orange",
                })
            }
        } catch (error) {
            setPengajuanMasalahDataRW([])
            showAlert({
                title: "Gagal Memuat Data",
                desc: error.response?.data?.message || error.message,
                message: "Tidak dapat memuat data pengajuan masalah untuk RW.",
                success: false,
                color: "red",
            })
        } finally {
            setIsLoadingDataRW(false)
        }
    }, [idRW])

    useEffect(() => {
        if (idRW) fetchMasalahDataRW()
    }, [idRW, fetchMasalahDataRW])

    const { isSuratActionLoading, terbitkanSurat } = useSuratActions(fetchMasalahDataRW)

    const handleActionRW = async (id_pengajuan_surat, approvalStatus, catatan = null) => {
        setIsActionLoadingRW(prev => ({ ...prev, [id_pengajuan_surat]: true }))
        try {
            const payload = {
                status_approval: approvalStatus === 'approved' ? 'Disetujui_RW' : 'Ditolak_RW',
                id_rw: idRW,
            }
            if (catatan) {
                payload.catatan = catatan
            }

            const response = await axios.put(`/api/surat/${id_pengajuan_surat}/approval`, payload)
            
            if (response.status === 200 && response.data && response.data.status === 'success'){
                showAlert({
                    title: "Berhasil!",
                    desc: response.data.message || `Surat ini telah di ${approvalStatus === 'approved' ? 'setujui' : 'tolak'}.`,
                    message: "Status approval surat berhasil diperbarui.",
                    success: true,
                    color: "green",
                })
                await fetchMasalahDataRW()
            } else {
                showAlert({
                    title: "Gagal Update Status",
                    desc: response.data?.message || "Gagal memperbarui status approval surat.",
                    message: "Gagal memperbarui status approval surat.",
                    success: false,
                    color: "orange",
                })
            }
        } catch (error) {
            showAlert({
                title: "Terjadi Kesalahan",
                desc: error.response?.data?.message || error.message,
                message: "Gagal memperbarui status approval surat.",
                success: false,
                color: "red",
            })
        } finally {
            setIsActionLoadingRW(prev => ({ ...prev, [id_pengajuan_surat]: false }))
        }
    }

    return {
        pengajuanMasalahDataRW,
        isLoadingDataRW,
        openItemsRW,
        setOpenItemsRW,
        handleActionRW,
        isActionLoadingRW: { ...isActionLoadingRW, ...isSuratActionLoading },
        refetchPengajuanMasalahRW: fetchMasalahDataRW,
        terbitkanSurat,
    }
}

