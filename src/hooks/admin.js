'use client';
import axios from "@/lib/axios";
import { showAlert } from "@/components/partials/Alert";

// Fungsi untuk mengambil data statistik warga
export const fetchWargaStats = async (setWargaStats) => {
  try {
    const response = await axios.get("/api/biodata/count");
    // API response: { CountWarga: N, CountPejabat: N, ... }
    // No top-level "status" or "data" field.
    if (response.status === 200 && response.data) {
      setWargaStats([
        { label: "Populasi Warga", value: response.data.CountWarga?.toString() || "0" },
        { label: "Total Pengajuan Surat", value: response.data.CountPengajuanSurat?.toString() || "0" },
        { label: "Total Pengajuan Dalam Proses", value: response.data.CountDataPengajuanPending?.toString() || "0" },
        // Mapping total_pending_action to CountDataPengajuanSelesai as a placeholder
        { label: "Total Pengajuan Selesai", value: response.data.CountDataPengajuanSelesai?.toString() || "0" }, 
      ]);
      return true;
    }
    showAlert({
        title: "Gagal Memuat Statistik",
        desc: "Format respons tidak sesuai atau data tidak ditemukan.",
        message: "Tidak dapat memuat statistik warga.",
        success: false, // Ensure correct property name 'success'
        color: "orange",
    });
    return false;
  } catch (error) {
    console.error("Error fetching warga stats:", error);
    showAlert({
      title: "Gagal Memuat Data",
      desc: error.response?.data?.message || error.message,
      message: "Tidak dapat memuat statistik warga.",
      success: false,
      color: "red",
    });
    return false;
  }
};

// Fungsi untuk mengambil data statistik RT/RW
export const fetchRtRwStats = async (setRtRwStats) => {
  try {
    const response = await axios.get("/api/biodata/count");
    // API response: { CountWarga: N, CountPejabat: N, ... }
    if (response.status === 200 && response.data) {
      setRtRwStats([
        // Mapping "Populasi Staff" to CountPejabat
        { label: "Populasi Staff (Pejabat)", value: response.data.CountPejabat?.toString() || "0" },
        { label: "Total Pengajuan Surat", value: response.data.CountPengajuanSurat?.toString() || "0" }, 
        { label: "Total Pengajuan Dalam Proses", value: response.data.CountDataPengajuanPending?.toString() || "0" },
        // Mapping total_pending_action to CountDataPengajuanSelesai as a placeholder
        { label: "Total Pengajuan Selesai", value: response.data.CountDataPengajuanSelesai?.toString() || "0" },
      ]);
      return true;
    }
    showAlert({
        title: "Gagal Memuat Statistik",
        desc: "Format respons tidak sesuai atau data tidak ditemukan.",
        message: "Tidak dapat memuat statistik RT/RW.",
        success: false,
        color: "orange",
    });
    return false;
  } catch (error) {
    console.error("Error fetching RT/RW stats:", error);
    showAlert({
      title: "Gagal Memuat Data",
      desc: error.response?.data?.message || error.message,
      message: "Tidak dapat memuat statistik RT/RW.",
      success: false,
      color: "red",
    });
    return false;
  }
};

// Fungsi untuk mengambil data pengajuan warga yang menunggu persetujuan
export const fetchWargaPendingData = async (setDataWarga, setIsLoading) => {
  try {
    setIsLoading(true);
    const response = await axios.get("/api/biodata/pending-warga");
    // API response: { warga: [ ... ] }
    if (response.status === 200 && response.data && Array.isArray(response.data.warga)) {
      setDataWarga(response.data.warga || []);
    } else {
      setDataWarga([]);
      showAlert({
        title: "Gagal Memuat Data Pending",
        desc: response.data?.message || "Format respons tidak sesuai atau data warga pending tidak ditemukan.",
        message: "Tidak dapat memuat data warga pending.",
        success: false,
        color: "orange",
      });
    }
    return true; // Or based on actual success
  } catch (error) {
    console.error("Error fetching pending warga data:", error);
    setDataWarga([]);
    showAlert({
      title: "Gagal Memuat Data",
      desc: error.response?.data?.message || error.message,
      message: "Tidak dapat memuat data warga pending.",
      success: false,
      color: "red",
    });
    return false;
  } finally {
    setIsLoading(false);
  }
};

// Fungsi untuk mengambil data biodata RT, RW, dan Warga
export const fetchBiodataUserData = async (setDataRT, setDataRW, setDataWarga, setLoading) => {
  try {
    setLoading(true);
    // Added trailing slash for consistency with API doc
    const response = await axios.get("/api/biodata/"); 
    // API response: { rt: [], rw: [], warga: [] }
    if (response.status === 200 && response.data) {
      setDataRT(response.data.rt || []);
      setDataRW(response.data.rw || []);
      setDataWarga(response.data.warga || []);
    } else {
      setDataRT([]);
      setDataRW([]);
      setDataWarga([]);
      showAlert({
        title: "Gagal Memuat Biodata",
        desc: response.data?.message || "Format respons tidak sesuai atau data biodata tidak ditemukan.",
        message: "Tidak dapat memuat data biodata pengguna.",
        success: false,
        color: "orange",
      });
    }
    return true; // Or based on actual success
  } catch (error) {
    console.error("Error fetching biodata:", error);
    setDataRT([]);
    setDataRW([]);
    setDataWarga([]);
    showAlert({
      title: "Gagal Memuat Data",
      desc: error.response?.data?.message || error.message,
      message: "Tidak dapat memuat data biodata pengguna.",
      success: false,
      color: "red",
    });
    return false;
  } finally {
    setLoading(false);
  }
};

// Fungsi untuk mengambil rekap pengajuan surat
export const fetchRekapPengajuanData = async (setRekapSurat) => {
  try {
    const response = await axios.get("/api/surat/"); 
    if (response.status === 200 && response.data && response.data.status === 'success') {
      console.log(response.data);
      setRekapSurat(response.data || { data: [] }); 
    } else {
      setRekapSurat({ data: [] });
      showAlert({
        title: "Gagal Memuat Rekap Surat",
        desc: response.data?.message || "Format respons tidak sesuai atau data rekap tidak ditemukan.",
        message: "Tidak dapat memuat data rekapitulasi pengajuan surat.",
        success: false,
        color: "orange",
      });
    }
    return true; // Or based on actual success
  } catch (error) {
    console.error("Error fetching rekap pengajuan data:", error);
    setRekapSurat({ data: [] });
    showAlert({
      title: "Gagal Memuat Data",
      desc: error.response?.data?.message || error.message,
      message: "Tidak dapat memuat data rekapitulasi pengajuan surat.",
      success: false,
      color: "red",
    });
    return false;
  }
};

// Fungsi untuk mengambil data approval role warga
export const fetchApprovalRoleData = async (setIsLoading, setDataWarga) => {
  try {
    setIsLoading(true);
    const response = await axios.get("/api/approval-role/warga");
    // API response: { message: "...", data: [ ... ] }
    if (response.status === 200 && response.data && Array.isArray(response.data.data)) {
      setDataWarga(response.data.data || []);
    } else {
      setDataWarga([]);
      showAlert({
        title: "Gagal Memuat Approval Role",
        desc: response.data?.message || "Format respons tidak sesuai atau data approval tidak ditemukan.",
        message: "Tidak dapat memuat data approval role.",
        success: false,
        color: "orange",
      });
    }
    return true; // Or based on actual success
  } catch (error) {
    console.error("Error fetching approval role data:", error);
    setDataWarga([]);
    showAlert({
      title: "Gagal Memuat Data",
      desc: error.response?.data?.message || error.message,
      message: "Tidak dapat memuat data approval role.",
      success: false,
      color: "red",
    });
    return false;
  } finally {
    setIsLoading(false);
  }
}; 