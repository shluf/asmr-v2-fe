'use client'

import axios from '@/lib/axios'
import { useState, useEffect, useCallback } from "react"
import { showAlert } from "@/components/partials/Alert"

export const useProgramKerjaWarga = () => {
  const [dataProkerWarga, setDataProkerWarga] = useState([])
  const [prokerIsLoadingWarga, setProkerIsLoadingWarga] = useState(true)

  const fetchProkerDataWarga = useCallback(async () => {
      setProkerIsLoadingWarga(true)
      try {
          const response = await axios.get("/api/proker/") 
          if (response.status === 200 && response.data && response.data.success) {
              setDataProkerWarga(response.data.data || [])
          } else {
              setDataProkerWarga([])
              showAlert({
                  title: "Gagal Memuat Program Kerja",
                  desc: response.data?.message || "Data program kerja tidak ditemukan atau format salah.",
                  message: "Tidak dapat memuat program kerja.",
                  success: false,
                  color: "orange",
              })
          }
      } catch (error) {
          setDataProkerWarga([])
          showAlert({
              title: "Gagal Memuat Data",
              desc: error.response?.data?.message || error.message,
              message: "Tidak dapat memuat program kerja.",
              success: false,
              color: "red",
          })
      } finally {
          setProkerIsLoadingWarga(false)
      }
  }, [])
  
  useEffect(() => {
    fetchProkerDataWarga()
}, [fetchProkerDataWarga])

  return { dataProkerWarga, prokerIsLoadingWarga, refetchProkerDataWarga: fetchProkerDataWarga }
}

export const fetchAkunData = async ( setProfileWarga, setData ) => {
  try {
    const response = await axios.get(`/api/surat/data-warga`)
    if (response.data && response.data.warga) {
      const wargaData = response.data.warga
      const userData = response.data.user

      setProfileWarga({ user: userData, warga: wargaData })
      setData({
        phone: wargaData?.phone || '',
        alamat: wargaData?.alamat?.alamat || '',
        kabupaten: wargaData?.alamat?.kabupaten || '',
        provinsi: wargaData?.alamat?.provinsi || '',
        agama: wargaData?.agama || '',
      })

      return wargaData.tempat_lahir + ", " + wargaData.tanggal_lahir
    }
  } catch (error) {
    setData({ phone: '', alamat: '', kabupaten: '', provinsi: '', agama: '' })
    return ''
  }
}

export const fetchPengajuanAkunData = async (setProfileWarga, setData) => {
  try {
    const response = await axios.get(`/api/surat/data-warga`)
    
    if (response.data && response.data.warga) {
      const wargaData = response.data.warga
      
      setProfileWarga(wargaData)
      
      setData({
        phone: wargaData?.phone || '',
        alamat: wargaData?.alamat?.alamat || '',
        kabupaten: wargaData?.alamat?.kabupaten || '',
        provinsi: wargaData?.alamat?.provinsi || '',
        agama: wargaData?.agama || '', 
        no_kk: wargaData?.nomor_kk || '',
      })
      
      return wargaData.jenis_kelamin || ''
    } else {
      setData({ phone: '', alamat: '', kabupaten: '', provinsi: '', agama: '' })
      return ''
    }
  } catch (error) {
    setData({ phone: '', alamat: '', kabupaten: '', provinsi: '', agama: '' })
    return ''
  }
}

export const submitPengajuan = async (formData) => {
  try {
    const payload = {
      nama_pemohon: formData.nama_pemohon,
      nik_pemohon: formData.nik_pemohon,
      no_kk_pemohon: formData.no_kk_pemohon,
      phone_pemohon: formData.phone_pemohon || '',
      tempat_tanggal_lahir_pemohon: formData.tempat_tanggal_lahir_pemohon,
      jenis_kelamin_pemohon: formData.jenis_kelamin_pemohon === 'L' ? 'Laki-Laki' : formData.jenis_kelamin_pemohon === 'P' ? 'Perempuan' : '',
      jenis_surat: formData.jenis_surat,
      agama_pemohon: formData.agama_pemohon,
      alamat_pemohon: formData.alamat_pemohon,
      keterangan: formData.deskripsi,
    }

    const response = await axios.post('/api/surat/pengajuan', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (response.status === 201 && response.data.pengajuan) {
      return { success: true, data: response.data.pengajuan, message: response.data.message }
    } else {
      return { 
        success: false, 
        message: response.data?.message || 'Gagal mengirim pengajuan, respons tidak sesuai.' 
      }
    }
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Terjadi kesalahan pada server.',
      errors: error.response?.data?.errors || {}
    }
  }
}

export const fetchHistoryPengajuan = async (idWarga) => {
  try {
    const response = await axios.get(`/api/surat/riwayat-pengajuan/${idWarga}`)
    
    if (response.status === 200 && Array.isArray(response.data)) {
      return { success: true, data: response.data }
    } else {
      return { success: false, data: [], message: 'Gagal mengambil data riwayat atau format data salah.' }
    }
  } catch (error) {
    return { 
      success: false, 
      data: [], 
      message: error.response?.data?.message || 'Gagal mengambil data riwayat.' 
    }
  }
}

export const fetchDashboardData = async () => {
  try {
    const response = await axios.get(`/api/surat/data-warga`)
    
    if (response.status === 200 && response.data && response.data.user && response.data.warga) {
      return { success: true, data: response.data }
    } else {
      return { 
        success: false, 
        data: {}, 
        message: response.data?.message || 'Gagal mengambil data dashboard atau format data salah.' 
      }
    }
  } catch (error) {
    return { 
      success: false, 
      data: {}, 
      message: error.response?.data?.message || 'Gagal mengambil data dashboard.' 
    }
  }
} 