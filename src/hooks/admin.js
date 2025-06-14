'use client'
import axios from "@/lib/axios"
import { showAlert } from "@/components/partials/Alert"

// Fungsi untuk mengambil data statistik warga
export const fetchCountPengajuanJenis = async (setCountPengajuanJenis) => {
  try {
    const response = await axios.get("/api/grafik/jumlah-pengajuan-jenis")
    if (response.status === 200 && response.data) {
      setCountPengajuanJenis(response.data || [])
      return true
    }
    showAlert({
        title: "Gagal Memuat Statistik",
        desc: "Format respons tidak sesuai atau data tidak ditemukan.",
        message: "Tidak dapat memuat statistik warga.",
        success: false,
        color: "orange",
    })
    return false
  } catch (error) {
    showAlert({
      title: "Gagal Memuat Data",
      desc: error.response?.data?.message || error.message,
      message: "Tidak dapat memuat statistik warga.",
      success: false,
      color: "red",
    })
    return false
  }
}

export const fetchPengajuanBulanan = async (setPengajuanBulanan, year, half = null) => {
  if (!year) {
    showAlert({
      title: "Tahun Wajib Diisi",
      desc: "Parameter tahun (year) harus diberikan untuk mengambil data statistik.",
      message: "Tahun belum dipilih.",
      success: false,
      color: "orange",
    })
    return false
  }
  try {
    const data = { year }
    if (half) data.half = half
    const response = await axios.post("/api/grafik/jumlah-pengajuan-bulan", data)
    if (response.status === 200 && response.data) {
      setPengajuanBulanan(response.data || [])
      return true
    }
    showAlert({
      title: "Gagal Memuat Statistik",
      desc: "Format respons tidak sesuai atau data tidak ditemukan.",
      message: "Tidak dapat memuat statistik RT/RW.",
      success: false,
      color: "orange",
    })
    return false
  } catch (error) {
    showAlert({
      title: "Gagal Memuat Data",
      desc: error.response?.data?.message || error.message,
      message: "Tidak dapat memuat statistik RT/RW.",
      success: false,
      color: "red",
    })
    return false
  }
}

// Fungsi untuk mengambil data pengajuan warga yang menunggu persetujuan
export const fetchWargaPendingData = async (setDataWarga, setIsLoading) => {
  try {
    setIsLoading(true)
    const response = await axios.get("/api/biodata/pending-warga")
    // API response: { warga: [ ... ] }
    if (response.status === 200 && response.data && Array.isArray(response.data.warga)) {
      setDataWarga(response.data.warga || [])
    } else {
      setDataWarga([])
      showAlert({
        title: "Gagal Memuat Data Pending",
        desc: response.data?.message || "Format respons tidak sesuai atau data warga pending tidak ditemukan.",
        message: "Tidak dapat memuat data warga pending.",
        success: false,
        color: "orange",
      })
    }
    return true 
  } catch (error) {
    setDataWarga([])
    showAlert({
      title: "Gagal Memuat Data",
      desc: error.response?.data?.message || error.message,
      message: "Tidak dapat memuat data warga pending.",
      success: false,
      color: "red",
    })
    return false
  } finally {
    setIsLoading(false)
  }
}

// Fungsi untuk mengambil data biodata RT, RW, dan Warga
export const fetchBiodataUserData = async (setDataRT, setDataRW, setDataWarga, setLoading) => {
  try {
    setLoading(true)
    const response = await axios.get("/api/biodata/") 
    // API response: { rt: [], rw: [], warga: [] }
    if (response.status === 200 && response.data) {
      setDataRT(response.data.rt || [])
      setDataRW(response.data.rw || [])
      setDataWarga(response.data.warga || [])
    } else {
      setDataRT([])
      setDataRW([])
      setDataWarga([])
      showAlert({
        title: "Gagal Memuat Biodata",
        desc: response.data?.message || "Format respons tidak sesuai atau data biodata tidak ditemukan.",
        message: "Tidak dapat memuat data biodata pengguna.",
        success: false,
        color: "orange",
      })
    }
    return true 
  } catch (error) {
    setDataRT([])
    setDataRW([])
    setDataWarga([])
    showAlert({
      title: "Gagal Memuat Data",
      desc: error.response?.data?.message || error.message,
      message: "Tidak dapat memuat data biodata pengguna.",
      success: false,
      color: "red",
    })
    return false
  } finally {
    setLoading(false)
  }
}

// Fungsi untuk mengambil rekap pengajuan surat
export const fetchRekapPengajuanData = async (setRekapSurat) => {
  try {
    const response = await axios.get("/api/surat/") 
    if (response.status === 200 && response.data && response.data.status === 'success') {
      setRekapSurat(response.data || { data: [] }) 
    } else {
      setRekapSurat({ data: [] })
      showAlert({
        title: "Gagal Memuat Rekap Surat",
        desc: response.data?.message || "Format respons tidak sesuai atau data rekap tidak ditemukan.",
        message: "Tidak dapat memuat data rekapitulasi pengajuan surat.",
        success: false,
        color: "orange",
      })
    }
    return true 
  } catch (error) {
    setRekapSurat({ data: [] })
    showAlert({
      title: "Gagal Memuat Data",
      desc: error.response?.data?.message || error.message,
      message: "Tidak dapat memuat data rekapitulasi pengajuan surat.",
      success: false,
      color: "red",
    })
    return false
  }
}

// Fungsi untuk mengambil data approval role warga
export const fetchApprovalRoleData = async (setIsLoading, setDataWarga) => {
  try {
    setIsLoading(true)
    const response = await axios.get("/api/approval-role/warga")
    // API response: { message: "...", data: [ ... ] }
    if (response.status === 200 && response.data && Array.isArray(response.data.data)) {
      setDataWarga(response.data.data || [])
    } else {
      setDataWarga([])
      showAlert({
        title: "Gagal Memuat Approval Role",
        desc: response.data?.message || "Format respons tidak sesuai atau data approval tidak ditemukan.",
        message: "Tidak dapat memuat data approval role.",
        success: false,
        color: "orange",
      })
    }
    return true 
  } catch (error) {
    setDataWarga([])
    showAlert({
      title: "Gagal Memuat Data",
      desc: error.response?.data?.message || error.message,
      message: "Tidak dapat memuat data approval role.",
      success: false,
      color: "red",
    })
    return false
  } finally {
    setIsLoading(false)
  }
}

// -------------------------------
// START: RT/RW Management Hooks
// -------------------------------

// Fetch all RWs
export const fetchAllRW = async (setRWList, setIsLoading) => {
  setIsLoading(true)
  try {
    const response = await axios.get("/api/wilayah/rw")
    if (response.status === 200 && response.data && response.data.success) {
      setRWList(response.data.data || [])
      return true
    }
    setRWList([])
    showAlert({ title: "Gagal Memuat Data RW", desc: response.data?.message || "Data RW tidak ditemukan.", message: "Silakan coba lagi.", success: false, color: "orange" })
    return false
  } catch (error) {
    setRWList([])
    showAlert({ title: "Gagal Memuat Data RW", desc: error.response?.data?.message || error.message, message: "Silakan coba lagi.", success: false, color: "red" })
    return false
  } finally {
    setIsLoading(false)
  }
}

// Fetch all RTs
export const fetchAllRT = async (setRTList, setIsLoading) => {
  setIsLoading(true)
  try {
    const response = await axios.get("/api/wilayah/all-rt")
    if (response.status === 200 && response.data && response.data.success) {
      setRTList(response.data.data || [])
      return true
    }
    setRTList([])
    showAlert({ title: "Gagal Memuat Data RT", desc: response.data?.message || "Data RT tidak ditemukan.", message: "Silakan coba lagi.", success: false, color: "orange" })
    return false
  } catch (error) {
    setRTList([])
    showAlert({ title: "Gagal Memuat Data RT", desc: error.response?.data?.message || error.message, message: "Silakan coba lagi.", success: false, color: "red" })
    return false
  } finally {
    setIsLoading(false)
  }
}


// Fetch RTs by RW ID
export const fetchRTsByRW = async (idRw, setRTList, setIsLoading) => {
  setIsLoading(true)
  try {
    const response = await axios.get(`/api/wilayah/rt/${idRw}`)
    if (response.status === 200 && response.data && response.data.success) {
      setRTList(response.data.data || [])
      return true
    }
    setRTList([])
    showAlert({ title: "Gagal Memuat Data RT", desc: response.data?.message || `Data RT untuk RW ${idRw} tidak ditemukan.`, message: "Silakan coba lagi.", success: false, color: "orange" })
    return false
  } catch (error) {
    setRTList([])
    showAlert({ title: "Gagal Memuat Data RT", desc: error.response?.data?.message || error.message, message: "Silakan coba lagi.", success: false, color: "red" })
    return false
  } finally {
    setIsLoading(false)
  }
}

// Fetch details of a specific RT (including Pejabat)
export const fetchRTDetails = async (idRt, setRTDetail, setIsLoading) => {
  setIsLoading(true)
  try {
    const response = await axios.get(`/api/pejabat/rt/${idRt}/details`)
    if (response.status === 200 && response.data && response.data.success) { 
      setRTDetail(response.data.data || null)
      return true
    }
    setRTDetail(null)
    showAlert({ title: "Gagal Memuat Detail RT", desc: response.data?.message || "Detail RT tidak ditemukan.", message: "Silakan coba lagi.", success: false, color: "orange" })
    return false
  } catch (error) {
    setRTDetail(null)
    showAlert({ title: "Gagal Memuat Detail RT", desc: error.response?.data?.message || error.message, message: "Silakan coba lagi.", success: false, color: "red" })
    return false
  } finally {
    setIsLoading(false)
  }
}

// Fetch details of a specific RW (including Pejabat)
export const fetchRWDetails = async (idRw, setRWDetail, setIsLoading) => {
  setIsLoading(true)
  try {
    const response = await axios.get(`/api/pejabat/rw/${idRw}/details`)
     if (response.status === 200 && response.data && response.data.success) { 
      setRWDetail(response.data.data || null)
      return true
    }
    setRWDetail(null)
    showAlert({ title: "Gagal Memuat Detail RW", desc: response.data?.message || "Detail RW tidak ditemukan.", message: "Silakan coba lagi.", success: false, color: "orange" })
    return false
  } catch (error) {
    setRWDetail(null)
    showAlert({ title: "Gagal Memuat Detail RW", desc: error.response?.data?.message || error.message, message: "Silakan coba lagi.", success: false, color: "red" })
    return false
  } finally {
    setIsLoading(false)
  }
}


// Fetch Warga by NIK
export const fetchWargaByNIK = async (nik, setWargaList, setIsLoading) => {
  setIsLoading(true)
  try {
    const response = await axios.get(`/api/pejabat/warga/${nik}`)
    if (response.status === 200 && response.data && response.data.warga) {
      setWargaList(response.data.warga || []) // API returns { warga: [...] }
      return true
    }
    setWargaList([])
    showAlert({ title: "Gagal Mencari Warga", desc: response.data?.message || "Warga dengan NIK tersebut tidak ditemukan.", message: "Silakan coba lagi.", success: false, color: "orange" })
    return false
  } catch (error) {
    setWargaList([])
    showAlert({ title: "Gagal Mencari Warga", desc: error.response?.data?.message || error.message, message: "Silakan coba lagi.", success: false, color: "red" })
    return false
  } finally {
    setIsLoading(false)
  }
}

// Fetch Warga within a specific RT
export const fetchWargaByRT = async (idRt, setWargaList, setIsLoading) => {
  setIsLoading(true)
  try {
    const response = await axios.get(`/api/wilayah/rt/${idRt}/warga`)
    if (response.status === 200 && response.data && response.data.success) {
      setWargaList(response.data.data || [])
      return true
    }
    setWargaList([])
    showAlert({ title: "Gagal Memuat Warga RT", desc: response.data?.message || "Data Warga untuk RT ini tidak ditemukan.", message: "Silakan coba lagi.", success: false, color: "orange" })
    return false
  } catch (error) {
    setWargaList([])
    showAlert({ title: "Gagal Memuat Warga RT", desc: error.response?.data?.message || error.message, message: "Silakan coba lagi.", success: false, color: "red" })
    return false
  } finally {
    setIsLoading(false)
  }
}

// Fetch Warga within a specific RW's scope
export const fetchWargaByRW = async (idRw, setWargaList, setIsLoading) => {
  setIsLoading(true)
  try {
    const response = await axios.get(`/api/wilayah/rw/${idRw}/warga`)
     if (response.status === 200 && response.data && response.data.success) {
      setWargaList(response.data.data || [])
      return true
    }
    setWargaList([])
    showAlert({ title: "Gagal Memuat Warga RW", desc: response.data?.message || "Data Warga untuk RW ini tidak ditemukan.", message: "Silakan coba lagi.", success: false, color: "orange" })
    return false
  } catch (error) {
    setWargaList([])
    showAlert({ title: "Gagal Memuat Warga RW", desc: error.response?.data?.message || error.message, message: "Silakan coba lagi.", success: false, color: "red" })
    return false
  } finally {
    setIsLoading(false)
  }
}


// Create new RT entity
export const createRTEntity = async (data, setIsLoading, callback) => {
  setIsLoading(true)
  try {
    const response = await axios.post("/api/pejabat/jabatan/rt", data)
    if (response.status === 200 || response.status === 201) { 
      showAlert({ title: "Sukses", desc: "RT baru berhasil ditambahkan.", message: "Silakan cek kembali data RT yang telah ditambahkan.", success: true, color: "green" })
      if (callback) callback(response.data.data)
      return true
    }
    showAlert({ title: "Gagal Menambahkan RT", desc: response.data?.message || "Gagal membuat RT baru.", message: "Silakan coba lagi.", success: false, color: "orange" })
    return false
  } catch (error) {
    showAlert({ title: "Gagal Menambahkan RT", desc: error.response?.data?.message || error.message, message: "Silakan coba lagi.", success: false, color: "red" })
    return false
  } finally {
    setIsLoading(false)
  }
}

// Create new RW entity
export const createRWEntity = async (data, setIsLoading, callback) => {
  setIsLoading(true)
  try {
    const response = await axios.post("/api/pejabat/jabatan/rw", data)
     if (response.status === 200 || response.status === 201) {
      showAlert({ title: "Sukses", desc: "RW baru berhasil ditambahkan.", message: "Silakan cek kembali data RW yang telah ditambahkan.", success: true, color: "green" })
      if (callback) callback(response.data.data)
      return true
    }
    showAlert({ title: "Gagal Menambahkan RW", desc: response.data?.message || "Gagal membuat RW baru.", message: "Silakan coba lagi.", success: false, color: "orange" })
    return false
  } catch (error) {
    showAlert({ title: "Gagal Menambahkan RW", desc: error.response?.data?.message || error.message, message: "Silakan coba lagi.", success: false, color: "red" })
    return false
  } finally {
    setIsLoading(false)
  }
}

// Register/Assign Pejabat (RT/RW)
export const registerPejabat = async (formData, setIsLoading, callback) => {
  setIsLoading(true)
  try {
    const response = await axios.post("/api/pejabat/register", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    if (response.status === 200) {
      showAlert({ title: "Sukses", desc: response.data?.message || "Pejabat berhasil didaftarkan/diperbarui.", success: true, color: "green" })
      if (callback) callback(response.data.data)
      return true
    }
    showAlert({ title: "Gagal Mendaftarkan Pejabat", desc: response.data?.message || "Proses gagal.", message: "Silakan coba lagi.", success: false, color: "orange" })
    return false
  } catch (error) {
    const errorMessages = error.response?.data?.messages
    let desc = error.response?.data?.message || error.message
    if (errorMessages) {
        desc = Object.values(errorMessages).flat().join('; ')
    }
    showAlert({ title: "Gagal Mendaftarkan Pejabat", desc: desc, message: "Silakan coba lagi.", success: false, color: "red"})
    return false
  } finally {
    setIsLoading(false)
  }
}

// Update Pejabat RT & RT Details
export const updatePejabatRT = async (idRt, formData, setIsLoading, callback) => {
  setIsLoading(true)
  try {
    formData.append('_method', 'PUT')
    const response = await axios.post(`/api/pejabat/rt/${idRt}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
     if (response.status === 200) {
      showAlert({ title: "Sukses", desc: response.data?.message || "Data RT dan Pejabat berhasil diperbarui.", success: true, color: "green" })
      if (callback) callback(response.data.data)
      return true
    }
    showAlert({ title: "Gagal Update RT", desc: response.data?.message || "Proses update gagal.", message: "Silakan coba lagi.", success: false, color: "orange" })
    return false
  } catch (error) {
    const errorMessages = error.response?.data?.messages
    let desc = error.response?.data?.message || error.message
    if (errorMessages) {
        desc = Object.values(errorMessages).flat().join('; ')
    }
    showAlert({ title: "Gagal Update RT", desc: desc, message: "Silakan coba lagi.", success: false, color: "red"})
    return false
  } finally {
    setIsLoading(false)
  }
}

// Update Pejabat RW & RW Details
export const updatePejabatRW = async (idRw, formData, setIsLoading, callback) => {
  setIsLoading(true)
  try {
    formData.append('_method', 'PUT')
    const response = await axios.post(`/api/pejabat/rw/${idRw}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    if (response.status === 200) {
      showAlert({ title: "Sukses", desc: response.data?.message || "Data RW dan Pejabat berhasil diperbarui.", success: true, color: "green" })
      if (callback) callback(response.data.data)
      return true
    }
    showAlert({ title: "Gagal Update RW", desc: response.data?.message || "Proses update gagal.", message: "Silakan coba lagi.", success: false, color: "orange" })
    return false
  } catch (error) {
     const errorMessages = error.response?.data?.messages
    let desc = error.response?.data?.message || error.message
    if (errorMessages) {
        desc = Object.values(errorMessages).flat().join('; ')
    }
    showAlert({ title: "Gagal Update RW", desc: desc, message: "Silakan coba lagi.", success: false, color: "red"})
    return false
  } finally {
    setIsLoading(false)
  }
}

// Unassign Pejabat from RT (deletes PejabatRT record)
export const unassignPejabatRT = async (idRt, setIsLoading, callback) => {
  setIsLoading(true)
  try {
    const response = await axios.delete(`/api/pejabat/rt/${idRt}`)
    if (response.status === 200) {
      showAlert({ title: "Sukses", desc: response.data?.message || "Pejabat RT berhasil dihapus.", success: true, color: "green" })
      if (callback) callback()
      return true
    }
    showAlert({ title: "Gagal Hapus Pejabat RT", desc: response.data?.message || "Proses gagal.", message: "Silakan coba lagi.", success: false, color: "orange" })
    return false
  } catch (error) {
    showAlert({ title: "Gagal Hapus Pejabat RT", desc: error.response?.data?.message || error.message, message: "Silakan coba lagi.", success: false, color: "red" })
    return false
  } finally {
    setIsLoading(false)
  }
}

// Unassign Pejabat from RW (deletes PejabatRW record)
export const unassignPejabatRW = async (idRw, setIsLoading, callback) => {
  setIsLoading(true)
  try {
    const response = await axios.delete(`/api/pejabat/rw/${idRw}`)
     if (response.status === 200) {
      showAlert({ title: "Sukses", desc: response.data?.message || "Pejabat RW berhasil dihapus.", success: true, color: "green" })
      if (callback) callback()
      return true
    }
    showAlert({ title: "Gagal Hapus Pejabat RW", desc: response.data?.message || "Proses gagal.", message: "Silakan coba lagi.", success: false, color: "orange" })
    return false
  } catch (error) {
    showAlert({ title: "Gagal Hapus Pejabat RW", desc: error.response?.data?.message || error.message, message: "Silakan coba lagi.", success: false, color: "red" })
    return false
  } finally {
    setIsLoading(false)
  }
}

// -------------------------------
// END: RT/RW Management Hooks
// -------------------------------
