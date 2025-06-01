import { useState, useEffect, useCallback } from "react";
import axios from "@/lib/axios";
import { showAlert } from "@/components/partials/Alert";

export const useProgramKerjaRT = () => {
    const [dataProkerRT, setDataProkerRT] = useState([]);
    const [prokerIsLoadingRT, setProkerIsLoadingRT] = useState(true);

    const fetchProkerDataRT = useCallback(async () => {
        setProkerIsLoadingRT(true);
        try {
            const response = await axios.get("/api/proker/"); 
            if (response.status === 200 && response.data && response.data.success) {
                setDataProkerRT(response.data.data || []);
            } else {
                setDataProkerRT([]);
                showAlert({
                    title: "Gagal Memuat Program Kerja",
                    desc: response.data?.message || "Data program kerja tidak ditemukan atau format salah.",
                    message: "Tidak dapat memuat program kerja.",
                    success: false,
                    color: "orange",
                });
            }
        } catch (error) {
            console.error("Error fetching program kerja data for RT:", error);
            setDataProkerRT([]);
            showAlert({
                title: "Gagal Memuat Data",
                desc: error.response?.data?.message || error.message,
                message: "Tidak dapat memuat program kerja.",
                success: false,
                color: "red",
            });
        } finally {
            setProkerIsLoadingRT(false);
        }
    }, []);

    useEffect(() => {
        fetchProkerDataRT();
    }, [fetchProkerDataRT]);

    return { dataProkerRT, prokerIsLoadingRT, refetchProkerDataRT: fetchProkerDataRT };
};

export const usePengajuanTerbaruRT = (idRT) => {
    const [pengajuanTerakhirRT, setPengajuanTerakhirRT] = useState([]);
    const [isLoadingPengajuanRT, setIsLoadingPengajuanRT] = useState(true);
    const [isActionLoadingRT, setIsActionLoadingRT] = useState({});

    const fetchPengajuanDataRT = useCallback(async () => {
        if (!idRT) {
            setPengajuanTerakhirRT([]);
            setIsLoadingPengajuanRT(false);
            return;
        }
        setIsLoadingPengajuanRT(true);
        try {
            const response = await axios.get(`/api/surat/pending/rt/${idRT}`, { params : { limit : 2 } }); 
            if (response.status === 200 && response.data && response.data.status === 'success') {
                setPengajuanTerakhirRT(response.data.data || []);
            } else {
                setPengajuanTerakhirRT([]);
                showAlert({
                    title: "Gagal Memuat Pengajuan Terbaru",
                    desc: response.data?.message || "Data pengajuan tidak ditemukan atau format salah.",
                    message: "Tidak dapat memuat pengajuan terbaru.",
                    success: false,
                    color: "orange",
                });
            }
        } catch (error) {
            console.error("Error fetching recent pengajuan for RT:", error);
            setPengajuanTerakhirRT([]);
            showAlert({
                title: "Gagal Memuat Data",
                desc: error.response?.data?.message || error.message,
                message: "Tidak dapat memuat pengajuan terbaru.",
                success: false,
                color: "red",
            });
        } finally {
            setIsLoadingPengajuanRT(false);
        }
    }, []);

    useEffect(() => {
        fetchPengajuanDataRT();
    }, []);

    const handleActionPengajuan = async (id_pengajuan_surat, approvalStatus, catatan = null) => {
        setIsActionLoadingRT(prev => ({ ...prev, [id_pengajuan_surat]: true }));
        try {
            const payload = {
                status_approval: approvalStatus === 'approved' ? 'Disetujui_RT' : 'Ditolak_RT',
                id_pejabat_rt: idRT, 
            };
            if (catatan) {
                payload.catatan = catatan;
            }

            const response = await axios.put(`/api/surat/${id_pengajuan_surat}/approval`, payload);
            
            if (response.status === 200 && response.data && response.data.status === 'success'){
                showAlert({
                    title: "Berhasil!",
                    desc: response.data.message || `Surat ini telah di ${approvalStatus === 'approved' ? 'setujui' : 'tolak'}.`,
                    message: "Status approval surat berhasil diperbarui.",
                    success: true,
                    color: "green",
                });
                await fetchPengajuanDataRT(); 
            } else {
                 showAlert({
                    title: "Gagal Update Status",
                    desc: response.data?.message || "Tidak dapat memperbarui status approval surat.",
                    message: "Gagal memperbarui status approval surat.",
                    success: false,
                    color: "orange",
                });
            }
        } catch (error) {
            console.error("Error updating submission status for RT:", error);
            showAlert({
                title: "Terjadi Kesalahan",
                desc: error.response?.data?.message || error.message,
                message: "Gagal memperbarui status approval surat.",
                success: false,
                color: "red",
            });
        } finally {
            setIsActionLoadingRT(prev => ({ ...prev, [id_pengajuan_surat]: false }));
        }
    };

    return {
        pengajuanTerakhirRT,
        isLoadingPengajuanRT,
        handleActionPengajuan,
        isActionLoadingRT,
        refetchPengajuanRT: fetchPengajuanDataRT
    };
};

export const usePengajuanMasalahRT = (idRT) => {
    const [pengajuanMasalahDataRT, setPengajuanMasalahDataRT] = useState([]);
    const [isLoadingDataRT, setIsLoadingDataRT] = useState(true);
    const [openItemsRT, setOpenItemsRT] = useState({});
    const [isActionLoadingRT, setIsActionLoadingRT] = useState({});

    const fetchMasalahDataRT = useCallback(async () => {
        if (!idRT) {
            setPengajuanMasalahDataRT([]);
            setIsLoadingDataRT(false);
            return;
        }
        setIsLoadingDataRT(true);
        try {
            const response = await axios.get(`/api/surat/pending/rt/${idRT}`); 
            if (response.status === 200 && response.data && response.data.status === 'success') {
                setPengajuanMasalahDataRT(response.data.data || []);
            } else {
                setPengajuanMasalahDataRT([]);
                 showAlert({
                    title: "Gagal Memuat Pengajuan Masalah",
                    desc: response.data?.message || "Data pengajuan masalah tidak ditemukan atau format salah.",
                    message: "Tidak dapat memuat data pengajuan masalah.",
                    success: false,
                    color: "orange",
                });
            }
        } catch (error) {
            console.error("Error fetching pengajuan masalah data for RT:", error);
            setPengajuanMasalahDataRT([]);
            showAlert({
                title: "Gagal Memuat Data",
                desc: error.response?.data?.message || error.message,
                message: "Tidak dapat memuat data pengajuan masalah.",
                success: false,
                color: "red",
            });
        } finally {
            setIsLoadingDataRT(false);
        }
    }, [idRT]);

    useEffect(() => {
        fetchMasalahDataRT();
    }, [fetchMasalahDataRT]);

    const handleActionRT = async (id_pengajuan_surat, approvalStatus, catatan = null) => {
        setIsActionLoadingRT(prev => ({ ...prev, [id_pengajuan_surat]: true }));
        try {
            const payload = {
                status_approval: approvalStatus === 'approved' ? 'Disetujui_RT' : 'Ditolak_RT',
                id_pejabat_rt: idRT,
            };
            if (catatan) {
                payload.catatan = catatan;
            }

            const response = await axios.put(`/api/surat/${id_pengajuan_surat}/approval`, payload);
            
            if (response.status === 200 && response.data && response.data.status === 'success'){
                showAlert({
                    title: "Berhasil!",
                    desc: response.data.message || `Surat ini telah di ${approvalStatus === 'approved' ? 'setujui' : 'tolak'}.`,
                    message: "Status approval surat berhasil diperbarui.",
                    success: true,
                    color: "green",
                });
                await fetchMasalahDataRT(); // Refetch data
            } else {
                showAlert({
                    title: "Gagal Update Status",
                    desc: response.data?.message || "Gagal memperbarui status approval surat.",
                    message: "Gagal memperbarui status approval surat.",
                    success: false,
                    color: "orange",
                });
            }
        } catch (error) {
            console.error("Error updating status for RT:", error);
            showAlert({
                title: "Terjadi Kesalahan",
                desc: error.response?.data?.message || error.message,
                message: "Gagal memperbarui status approval surat.",
                success: false,
                color: "red",
            });
        } finally {
            setIsActionLoadingRT(prev => ({ ...prev, [id_pengajuan_surat]: false }));
        }
    };

    return {
        pengajuanMasalahDataRT,
        isLoadingDataRT,
        openItemsRT,
        setOpenItemsRT,
        handleActionRT,
        isActionLoadingRT,
        refetchPengajuanMasalahRT: fetchMasalahDataRT
    };
};

export const useRekapPengajuanRT = (idRT, selectInitial) => {
    const [rekapPengajuanDataRT, setRekapPengajuanDataRT] = useState([]);
    const [isLoadingRekapRT, setIsLoadingRekapRT] = useState(true);
    const [openItemsRT, setOpenItemsRT] = useState({});

    const fetchRekapDataRT = useCallback(async () => {
        if (!idRT) {
            setRekapPengajuanDataRT([]);
            setIsLoadingRekapRT(false);
            return;
        }
        setIsLoadingRekapRT(true);
        try {
            const response = await axios.get(`/api/surat/pending/rt/${idRT}`, { params : { all : true } }); 
            if (response.status === 200 && response.data && response.data.status === 'success') {
                const dataArray = response.data.data || [];
                setRekapPengajuanDataRT(dataArray);
            
                if (selectInitial && dataArray.length > 0) {
                    const initialItem = dataArray.find(item => item.id === selectInitial);
                    if (initialItem) {
                        setOpenItemsRT({ [selectInitial]: true });
                    }
                }
            } else {
                setRekapPengajuanDataRT([]);
                showAlert({
                    title: "Gagal Memuat Rekap Pengajuan",
                    desc: response.data?.message || "Data rekap pengajuan tidak ditemukan atau format salah.",
                    message: "Tidak dapat memuat data rekapitulasi pengajuan.",
                    success: false,
                    color: "orange",
                });
            }
        } catch (error) {
            console.error("Error fetching rekap pengajuan data for RT:", error);
            setRekapPengajuanDataRT([]);
            showAlert({
                title: "Gagal Memuat Data",
                desc: error.response?.data?.message || error.message,
                message: "Tidak dapat memuat data rekapitulasi pengajuan.",
                success: false,
                color: "red",
            });
        } finally {
            setIsLoadingRekapRT(false);
        }
    }, [idRT, selectInitial]);

    useEffect(() => {
        fetchRekapDataRT();
    }, [fetchRekapDataRT]);

    useEffect(() => {
        if (selectInitial && Array.isArray(rekapPengajuanDataRT) && rekapPengajuanDataRT.length > 0 && !openItemsRT[selectInitial]) {
            const initialItemExists = rekapPengajuanDataRT.some(item => item.id === selectInitial);
            if (initialItemExists) {
                setOpenItemsRT(prev => ({ ...prev, [selectInitial]: true }));
            }
        }
    }, [selectInitial, rekapPengajuanDataRT, openItemsRT]);

    return { 
        rekapPengajuanDataRT, 
        isLoadingRekapRT, 
        openItemsRT, 
        setOpenItemsRT, 
        refetchRekapPengajuanRT: fetchRekapDataRT 
    };
}; 