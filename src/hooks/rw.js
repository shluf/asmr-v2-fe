import { useState, useEffect, useCallback } from "react";
import axios from "@/lib/axios";
import { showAlert } from "@/components/partials/Alert";

export const useProgramKerjaRW = () => {
    const [dataProker, setDataProker] = useState([]);
    const [prokerIsLoading, setProkerIsLoading] = useState(true);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [editProker, setEditProker] = useState({
        id_program_kerja: null,
        tanggal: "",
        waktu: "",
        jenis_kegiatan: "",
        tempat: "",
        penanggung_jawab: "",
    });
    const [tambahProker, setTambahProker] = useState({
        tanggal: "",
        waktu: "",
        jenis_kegiatan: "",
        tempat: "",
        penanggung_jawab: "",
    });
    const [isProcessing, setIsProcessing] = useState({
        edit: false,
        add: false,
        delete: false,
    });

    const fetchProkerData = useCallback(async () => {
        setProkerIsLoading(true);
        try {
            const response = await axios.get("/program-kerja");
            setDataProker(response.data.proker || response.data || []);
        } catch (error) {
            console.error("Error fetching program kerja data:", error);
            setDataProker([]); // Set to empty on error
            showAlert({
                title: "Gagal Memuat Data",
                desc: error.message,
                message: "Tidak dapat memuat program kerja.",
                succes: false,
                color: "red",
            });
        } finally {
            setProkerIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProkerData();
    }, [fetchProkerData]);

    const handleEdit = (proker) => {
        setEditProker(proker);
        setShowEditDialog(true);
    };

    const handleDelete = async (id) => {
        setIsProcessing((prev) => ({ ...prev, delete: true }));
        try {
            await axios.delete(`/program-kerja/delete/${id}`);
            await fetchProkerData(); // Refetch using the memoized function
            showAlert({
                title: "Berhasil!",
                desc: "Program kerja berhasil dihapus.",
                message: "Data telah diperbarui.",
                succes: true,
                color: "green",
            });
        } catch (error) {
            showAlert({
                title: "Terjadi Kesalahan",
                desc: error.message,
                message: "Gagal menghapus program kerja.",
                succes: false,
                color: "red",
            });
        } finally {
            setIsProcessing((prev) => ({ ...prev, delete: false }));
        }
    };

    const handleAdd = () => {
        setTambahProker({
            tanggal: "",
            waktu: "",
            jenis_kegiatan: "",
            tempat: "",
            penanggung_jawab: "",
        });
        setShowAddDialog(true);
    };

    const handleSubmitEdit = async () => {
        setIsProcessing((prev) => ({ ...prev, edit: true }));
        try {
            await axios.put(
                `/program-kerja/update/${editProker.id_program_kerja}`,
                editProker
            );
            await fetchProkerData(); // Refetch
            showAlert({
                title: "Berhasil!",
                desc: "Program kerja berhasil diperbarui.",
                message: "Data telah diperbarui.",
                succes: true,
                color: "green",
            });
            setShowEditDialog(false);
        } catch (error) {
            showAlert({
                title: "Terjadi Kesalahan",
                desc: error.message,
                message: "Gagal memperbarui program kerja.",
                succes: false,
                color: "red",
            });
            console.error("Error updating data:", error);
        } finally {
            setIsProcessing((prev) => ({ ...prev, edit: false }));
        }
    };

    const handleSubmitTambah = async () => {
        setIsProcessing((prev) => ({ ...prev, add: true }));
        try {
            await axios.post(`/program-kerja/store`, tambahProker);
            await fetchProkerData(); // Refetch
            showAlert({
                title: "Berhasil!",
                desc: "Program kerja berhasil ditambahkan.",
                message: "Data telah diperbarui.",
                succes: true,
                color: "green",
            });
            setTambahProker({ 
                tanggal: "",
                waktu: "",
                jenis_kegiatan: "",
                tempat: "",
                penanggung_jawab: "",
            });
            setShowAddDialog(false);
        } catch (error) {
            showAlert({
                title: "Terjadi Kesalahan",
                desc: error.message,
                message: "Gagal menambahkan program kerja.",
                succes: false,
                color: "red",
            });
            console.error("Error adding data:", error);
        } finally {
            setIsProcessing((prev) => ({ ...prev, add: false }));
        }
    };

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
    };
};

export const usePengajuanRW = (idRW) => {
    const [pengajuanTerakhir, setPengajuanTerakhir] = useState([]);
    const [isLoadingPengajuan, setIsLoadingPengajuan] = useState(true);

    useEffect(() => {
        const actualFetchPengajuan = async () => {
            if (!idRW) {
                setPengajuanTerakhir([]); 
                setIsLoadingPengajuan(false);
                return;
            }
            setIsLoadingPengajuan(true);
            try {
                const response = await axios.get(
                    `/surat/pengajuan/?id_rw=${idRW}&length=2`
                );
                setPengajuanTerakhir(response.data || []); // Ensure it's an array
            } catch (error) {
                console.error("Error fetching data pengajuan terbaru:", error);
                setPengajuanTerakhir([]); // Set to empty on error
                showAlert({
                    title: "Gagal Memuat Data",
                    desc: error.message,
                    message: "Tidak dapat memuat data pengajuan terbaru.",
                    succes: false,
                    color: "red",
                });
            } finally {
                setIsLoadingPengajuan(false);
            }
        };

        actualFetchPengajuan();
    }, [idRW]); // Rerun when idRW changes

    // Function to allow manual refetching if needed from component
    const refetchPengajuan = useCallback(async () => {
        if (!idRW) {
            setPengajuanTerakhir([]);
            setIsLoadingPengajuan(false);
            return;
        }
        setIsLoadingPengajuan(true);
        try {
            const response = await axios.get(
                `/surat/pengajuan/?id_rw=${idRW}&length=2`
            );
            setPengajuanTerakhir(response.data || []);
        } catch (error) {
            console.error("Error refetching data pengajuan terbaru:", error);
            setPengajuanTerakhir([]);
            showAlert({
                title: "Gagal Memuat Ulang Data",
                desc: error.message,
                message: "Tidak dapat memuat ulang data pengajuan terbaru.",
                succes: false,
                color: "red",
            });
        } finally {
            setIsLoadingPengajuan(false);
        }
    }, [idRW]);

    return { pengajuanTerakhir, isLoadingPengajuan, refetchPengajuan };
};

export const useRekapPengajuanRW = (idRW, selectInitial) => {
    const [rekapPengajuanData, setRekapPengajuanData] = useState([]);
    const [isLoadingRekap, setIsLoadingRekap] = useState(true);
    const [openItems, setOpenItems] = useState({});

    const fetchRekapData = useCallback(async () => {
        if (!idRW) {
            setRekapPengajuanData([]);
            setIsLoadingRekap(false);
            return;
        }
        setIsLoadingRekap(true);
        try {
            // Assuming the endpoint for rekap data is something like this.
            // The original component had `fetchRekapRWData` but its implementation wasn't visible.
            // Adjust the endpoint as necessary.
            const response = await axios.get(`/surat/rekap-pengajuan/?id_rw=${idRW}`); 
            setRekapPengajuanData(response.data || []);
            if (selectInitial && response.data && response.data.data) {
                 // Assuming response.data.data is the array of submissions
                const initialItem = response.data.data.find(item => item.id_pengajuan_surat === selectInitial);
                if (initialItem) {
                    setOpenItems({ [selectInitial]: true });
                }
            }
        } catch (error) {
            console.error("Error fetching rekap pengajuan data:", error);
            setRekapPengajuanData([]);
            showAlert({
                title: "Gagal Memuat Data",
                desc: error.message,
                message: "Tidak dapat memuat data rekapitulasi pengajuan.",
                succes: false,
                color: "red",
            });
        } finally {
            setIsLoadingRekap(false);
        }
    }, [idRW, selectInitial]);

    useEffect(() => {
        fetchRekapData();
    }, [fetchRekapData]);

    // Effect to handle initial selection if data loads after `selectInitial` is set
    useEffect(() => {
        if (selectInitial && rekapPengajuanData && rekapPengajuanData.data && !openItems[selectInitial]) {
            const initialItemExists = rekapPengajuanData.data.some(item => item.id_pengajuan_surat === selectInitial);
            if (initialItemExists) {
                setOpenItems(prev => ({ ...prev, [selectInitial]: true }));
            }
        }
    }, [selectInitial, rekapPengajuanData, openItems]);


    return { rekapPengajuanData, isLoadingRekap, openItems, setOpenItems, refetchRekapPengajuan: fetchRekapData };
};

export const usePengajuanMasalahRW = (idRW) => {
    const [pengajuanMasalahData, setPengajuanMasalahData] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [openItems, setOpenItems] = useState({});
    const [isActionLoading, setIsActionLoading] = useState({}); // Tracks loading state for individual item actions

    const fetchData = useCallback(async () => {
        if (!idRW) {
            setPengajuanMasalahData([]);
            setIsLoadingData(false);
            return;
        }
        setIsLoadingData(true);
        try {
            // Assuming endpoint for fetching pengajuan masalah specifically for RW approval
            // The original component had `fetchPengajuanMasalahData`
            const response = await axios.get(`/surat/rw-approval-list/?id_rw=${idRW}`); 
            setPengajuanMasalahData(response.data || []);
        } catch (error) {
            console.error("Error fetching pengajuan masalah data:", error);
            setPengajuanMasalahData([]);
            showAlert({
                title: "Gagal Memuat Data",
                desc: error.message,
                message: "Tidak dapat memuat data pengajuan masalah.",
                succes: false,
                color: "red",
            });
        } finally {
            setIsLoadingData(false);
        }
    }, [idRW]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAction = async (id_pengajuan_surat, status) => {
        setIsActionLoading(prev => ({ ...prev, [id_pengajuan_surat]: true }));
        try {
            await axios.put(`/surat/approval/${id_pengajuan_surat}`, {
                status_approval: status,
                approver_type: 'rw',
                id_approver: idRW
            });
            showAlert({
                title: "Berhasil!",
                desc: `Surat ini telah di ${status === 'approved' ? 'setujui' : 'tolak'} oleh Anda.`,
                message: "Status approval surat berhasil diperbarui",
                succes: true,
                color: "green",
            });
            await fetchData(); // Refetch data after action
        } catch (error) {
            showAlert({
                title: "Terjadi Kesalahan",
                desc: error.message, // error.message is better than just error object
                message: "Status approval surat gagal diperbarui",
                succes: false,
                color: "red",
            });
            console.error('Error updating status:', error);
        } finally {
            setIsActionLoading(prev => ({ ...prev, [id_pengajuan_surat]: false }));
        }
    };

    return {
        pengajuanMasalahData,
        isLoadingData,
        openItems,
        setOpenItems,
        handleAction,
        isActionLoading,
        refetchPengajuanMasalah: fetchData
    };
}; 