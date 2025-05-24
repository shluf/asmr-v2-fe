import { useState, useEffect, useCallback } from "react";
import axios from "@/lib/axios";
import { showAlert } from "@/components/partials/Alert";

export const useProgramKerjaRT = () => {
    const [dataProkerRT, setDataProkerRT] = useState([]);
    const [prokerIsLoadingRT, setProkerIsLoadingRT] = useState(true);

    const fetchProkerDataRT = useCallback(async () => {
        setProkerIsLoadingRT(true);
        try {
            const response = await axios.get("/program-kerja"); 
            setDataProkerRT(response.data.proker || response.data || []);
        } catch (error) {
            console.error("Error fetching program kerja data for RT:", error);
            setDataProkerRT([]);
            showAlert({
                title: "Gagal Memuat Data",
                desc: error.message,
                message: "Tidak dapat memuat program kerja.",
                succes: false,
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
            const response = await axios.get(`/surat/pengajuan/?id_rt=${idRT}&length=2`); 
            setPengajuanTerakhirRT(response.data || []);
        } catch (error) {
            console.error("Error fetching recent pengajuan for RT:", error);
            setPengajuanTerakhirRT([]);
            showAlert({
                title: "Gagal Memuat Data",
                desc: error.message,
                message: "Tidak dapat memuat pengajuan terbaru.",
                succes: false,
                color: "red",
            });
        } finally {
            setIsLoadingPengajuanRT(false);
        }
    }, [idRT]);

    useEffect(() => {
        fetchPengajuanDataRT();
    }, [fetchPengajuanDataRT]);

    const handleActionPengajuan = async (id_pengajuan_surat, status) => {
        setIsActionLoadingRT(prev => ({ ...prev, [id_pengajuan_surat]: true }));
        try {
            await axios.put(`/surat/approval/${id_pengajuan_surat}`, {
                status_approval: status, // 'approved' or 'rejected'
                approver_type: 'rt', // RT is approving/rejecting
                id_approver: idRT
            });
            showAlert({
                title: "Berhasil!",
                desc: `Surat ini telah di ${status === 'approved' ? 'setujui' : 'tolak'} oleh Anda.`,
                message: "Status approval surat berhasil diperbarui.",
                succes: true,
                color: "green",
            });
            await fetchPengajuanDataRT(); // Refetch the list of submissions
        } catch (error) {
            console.error("Error updating submission status for RT:", error);
            showAlert({
                title: "Terjadi Kesalahan",
                desc: error.message,
                message: "Gagal memperbarui status approval surat.",
                succes: false,
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
            const response = await axios.get(`/surat/rt-pending-list/?id_rt=${idRT}`); 
            setPengajuanMasalahDataRT(response.data || []);
        } catch (error) {
            console.error("Error fetching pengajuan masalah data for RT:", error);
            setPengajuanMasalahDataRT([]);
            showAlert({
                title: "Gagal Memuat Data",
                desc: error.message,
                message: "Tidak dapat memuat data pengajuan masalah.",
                succes: false,
                color: "red",
            });
        } finally {
            setIsLoadingDataRT(false);
        }
    }, [idRT]);

    useEffect(() => {
        fetchMasalahDataRT();
    }, [fetchMasalahDataRT]);

    const handleActionRT = async (id_pengajuan_surat, status) => {
        setIsActionLoadingRT(prev => ({ ...prev, [id_pengajuan_surat]: true }));
        try {
            await axios.put(`/surat/approval/${id_pengajuan_surat}`, {
                status_approval: status,
                approver_type: 'rt',
                id_approver: idRT
            });
            showAlert({
                title: "Berhasil!",
                desc: `Surat ini telah di ${status === 'approved' ? 'setujui' : 'tolak'} oleh Anda.`,
                message: "Status approval surat berhasil diperbarui.",
                succes: true,
                color: "green",
            });
            await fetchMasalahDataRT(); // Refetch data
        } catch (error) {
            console.error("Error updating status for RT:", error);
            showAlert({
                title: "Terjadi Kesalahan",
                desc: error.message,
                message: "Gagal memperbarui status approval surat.",
                succes: false,
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
            const response = await axios.get(`/surat/rekap-pengajuan-rt/?id_rt=${idRT}`); 
            setRekapPengajuanDataRT(response.data || []);
            
            if (selectInitial && response.data && response.data.data) {
                const initialItem = response.data.data.find(item => item.id_pengajuan_surat === selectInitial);
                if (initialItem) {
                    setOpenItemsRT({ [selectInitial]: true });
                }
            }
        } catch (error) {
            console.error("Error fetching rekap pengajuan data for RT:", error);
            setRekapPengajuanDataRT([]);
            showAlert({
                title: "Gagal Memuat Data",
                desc: error.message,
                message: "Tidak dapat memuat data rekapitulasi pengajuan.",
                succes: false,
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
        if (selectInitial && rekapPengajuanDataRT && rekapPengajuanDataRT.data && !openItemsRT[selectInitial]) {
            const initialItemExists = rekapPengajuanDataRT.data.some(item => item.id_pengajuan_surat === selectInitial);
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