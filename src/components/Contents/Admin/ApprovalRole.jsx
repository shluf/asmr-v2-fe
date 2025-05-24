import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/Components/ui/skeleton";
import { AlertWrapper, showAlert } from "@/Components/partials/Alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog";
import PrimaryButton from "@/Components/Atoms/PrimaryButton";
import { Check, Loader2, X } from "lucide-react";
import { DataField } from "@/Components/partials/dataField";
import { fetchApprovalRoleData } from "@/hooks/admin";

const ApprovalRole = () => {
    const [dataWarga, setDataWarga] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedWarga, setSelectedWarga] = useState(null);
    const [loading, setLoading] = useState({});
    const [show, setShow] = useState({});

    useEffect(() => {
        fetchApprovalRoleData(setIsLoading, setDataWarga);
    }, []);

    const handleApprove = async (nik_warga) => {
        try {
            setLoading((prev) => ({ ...prev, [nik_warga]: true, ['main']: true }));
            await axios.post(`/approvalRole/approve/${nik_warga}`);
            showAlert({
                title: "Berhasil!!!",
                desc: "Approval diterima",
                message: "Status approval user telah diperbarui",
                color: "green",
                });
            fetchApprovalRoleData(setIsLoading, setDataWarga);
            setLoading((prev) => ({ ...prev, [nik_warga]: false, ['main']: false }));
        } catch (error) {
            console.error("Error approving user:", error);
            showAlert({
                title: "Terjadi Kesalahan",
                desc: error,
                message: "Status approval user gagal diperbarui",
                succes: false,
                color: "red",
                });
        }
    };

    const handleDisapprove = async (nik_warga) => {
        try {
            setLoading((prev) => ({ ...prev, [nik_warga]: true,  ['main']: true }));
            await axios.post(`/approvalRole/disapprove/${nik_warga}`);
            showAlert({
                title: "Berhasil!!!",
                desc: "Approval ditolak",
                message: "Status approval user telah diperbarui",
                color: "green",
                });
            fetchApprovalRoleData(setIsLoading, setDataWarga); 
            setLoading((prev) => ({ ...prev, [nik_warga]: false,  ['main']: false }));
        } catch (error) {
            console.error("Error disapproving user:", error);
            showAlert({
                title: "Terjadi Kesalahan",
                desc: error,
                message: "Status approval user gagal diperbarui",
                succes: false,
                color: "red",
                });
        }
    };

    return (
        <div className="w-full p-6">
            <AlertWrapper />
            <div>
                <h2 className="font-semibold text-lg mb-4">
                    Permintaan Role
                </h2>
                <Table className="relative">                        
                    {loading['main'] && 
                            <div className="absolute top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                                <div className="flex flex-col items-center justify-center">
                                <Loader2 
                                    className="h-12 w-12 animate-spin text-green" 
                                    strokeWidth={2} 
                                />
                                <p className="mt-4 text-gray-700 font-semibold">
                                    Sistem sedang bekerja, mohon tunggu sebentar...
                                </p>
                                </div>
                            </div>
                        }
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nomor KK</TableHead>
                            <TableHead>NIK Warga</TableHead>
                            <TableHead>Nama Warga</TableHead>
                            <TableHead>Jenis Kelamin</TableHead>
                            <TableHead>Nomor Telepon</TableHead>
                            <TableHead>Tempat dan Tanggal Lahir</TableHead>
                            <TableHead>Alamat</TableHead>
                            <TableHead>Approval</TableHead>
                            <TableHead className="text-center">Aksi</TableHead>
                            <TableHead className="text-center">Detail</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>

                        {isLoading ? (
                            Array(5).fill(null).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Skeleton className="h-6 w-6 rounded-full" />
                                            <Skeleton className="h-6 w-6 rounded-full" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            dataWarga.map((warga) => (
                                <TableRow key={warga.nik_warga}>
                                    <TableCell className="font-medium">{warga.nomer_kk}</TableCell>
                                    <TableCell>{warga.nik_warga}</TableCell>
                                    <TableCell>{warga.nama}</TableCell>
                                    <TableCell>{warga.jenis_kelamin}</TableCell>
                                    <TableCell>{warga.phone}</TableCell>
                                    <TableCell>{warga.tempat_dan_tanggal_lahir}</TableCell>
                                    <TableCell>
                                        <div className={`cursor-pointer ${show[warga.nik_warga] ? "" : "line-clamp-3"}`} 
                                            onClick={() => setShow(prev => ({
                                                ...prev, 
                                                [warga.nik_warga]: !prev[warga.nik_warga]
                                            }))}>
                                                {warga.alamat}
                                        </div>
                                    </TableCell>
                                    <TableCell>{warga.approved ? "Disetujui" : warga.approved === 0 ? "Ditolak" : "Pending"}</TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => handleApprove(warga.nik_warga)}
                                                aria-label="Approve Warga"
                                                className="w-10 h-10"
                                            >
                                                <img className="w-6 h-6" src="/img/check-circle.svg" alt="Approve" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDisapprove(warga.nik_warga)}
                                                aria-label="Disapprove Warga"
                                                className="w-10 h-10"
                                            >
                                                <img className="w-6 h-6" src="/img/x-circle.svg" alt="Disapprove" />
                                            </button>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button 
                                                    onClick={() => setSelectedWarga(warga)}
                                                    className="text-nowrap border border-blue-500 text-blue-500 px-4 py-2 rounded-full hover:bg-blue-500 hover:text-white transition"
                                                >
                                                    Lihat data
                                                </button>
                                            </DialogTrigger>
                                            {selectedWarga && (
                                                <DialogContent aria-describedby="dialog-description" className="sm:max-w-[600px]">
                                                    <DialogHeader>
                                                        <DialogTitle>Data Lengkap Warga</DialogTitle>
                                                    </DialogHeader>
                                                    {/* <p id="dialog-description" className="text-sm text-gray-500">
                                                        Berikut adalah data lengkap warga yang dapat Anda tinjau atau ubah statusnya.
                                                    </p> */}
                                                    <div className="grid gap-4 py-4 text-sm">
                                                        <DataField label="Nama" value={selectedWarga.nama} />
                                                        <DataField label="No KK" value={selectedWarga.nomer_kk} />
                                                        <DataField label="NIK" value={selectedWarga.nik_warga} />
                                                        <DataField label="RT" value={selectedWarga.no_rt} />
                                                        <DataField label="RW" value={selectedWarga.no_rw} />
                                                        <DataField label="Status" value={selectedWarga.approved ? "Disetujui" : selectedWarga.approved === 0 ? "Ditolak" : "Pending"} />
                                                        <DataField label="Alamat" value={selectedWarga.alamat} />
                                                        <DataField label="Tanggal Lahir" value={selectedWarga.tempat_dan_tanggal_lahir} />
                                                        <DataField label="Jenis Kelamin" value={selectedWarga.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"} />
                                                    </div>
                                                    <div className="flex gap-2 justify-end items-center w-full">
                                                        <PrimaryButton
                                                            color="red"
                                                            rounded='full'
                                                            disabled={loading[selectedWarga.nik_warga]}
                                                            onClick={() => handleDisapprove(selectedWarga.nik_warga)}
                                                        >
                                                            <X className="w-4 h-4 mr-2" />
                                                            Tolak
                                                        </PrimaryButton>
                                                        <PrimaryButton
                                                            color="green"
                                                            rounded='full'
                                                            disabled={loading[selectedWarga.nik_warga]}
                                                            onClick={() => handleApprove(selectedWarga.nik_warga)}
                                                        >
                                                            <Check className="w-4 h-4 mr-2" />
                                                            Setujui
                                                        </PrimaryButton>
                                                    </div>
                                                </DialogContent>
                                            )}
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default ApprovalRole;
