"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserFilled } from "@/utility/svg-icons";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";
import { id as idLocale } from "date-fns/locale";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import InputLabel from "@/components/Atoms/InputLabel";
import TextInput from "@/components/Atoms/TextInput";
import Link from "next/link";
import ProgramKerja from "@/components/partials/ProgramKerja";
import { ChevronRight } from "lucide-react";
import { useProgramKerjaRW, usePengajuanTerbaruRW } from "@/hooks/rw";
import { useAuthTokenClient } from "@/lib/jwt";

const DashboardContent = () => {
    const { payload } = useAuthTokenClient();
    const idRW = payload?.id_rw;

    const {
        pengajuanTerakhirRW,
        isLoadingPengajuanRW,
        handleActionPengajuanRW,
        isActionLoadingRW,
    } = usePengajuanTerbaruRW(idRW);

    const {
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
        handleEdit: handleEditProker,
        handleDelete: handleDeleteProker,
        handleAdd: handleAddProker,
        handleSubmitEdit: handleSubmitEditProker,
        handleSubmitTambah: handleSubmitTambahProker,
        isProcessing: isProcessingProker,
    } = useProgramKerjaRW(idRW);

    const handleEditChange = (e) => {
        setEditProker((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleTambahChange = (e) => {
        setTambahProker((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <>
            <div className="space-y-8 overflow-hidden w-full mb-4">
                <ProgramKerja
                    dataProker={dataProker}
                    loading={prokerIsLoading}
                    editable={true}
                    onEdit={handleEditProker}
                    onDelete={handleDeleteProker}
                    onAdd={handleAddProker}
                    isProcessing={isProcessingProker}
                />

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            Pengajuan Surat Terakhir
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isLoadingPengajuanRW ? (
                            <>
                                {[...Array(2)].map((_, index) => (
                                    <Card key={index}>
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                                    {[...Array(6)].map(
                                                        (_, i) => (
                                                            <div
                                                                key={i}
                                                                className="flex flex-col h-full justify-between"
                                                            >
                                                                <Skeleton className="h-4 w-24 mb-2" />
                                                                <Skeleton className="h-4 w-32" />
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                                <Skeleton className="h-10 w-32 rounded-full" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </>
                        ) : !pengajuanTerakhirRW || pengajuanTerakhirRW.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                Tidak ada pengajuan surat yang tersedia
                            </div>
                        ) : (
                            pengajuanTerakhirRW.map((submission) => (
                                <Card key={submission.id} className="overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row h-auto md:h-28">
                                            <div className="bg-green-100 p-4 flex items-center justify-center md:w-24">
                                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                                                    <UserFilled size={6} />
                                                </div>
                                            </div>
                                            <div className="p-4 flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Tanggal Pengajuan
                                                    </p>
                                                    <p className="font-medium">
                                                        {format(
                                                            new Date(
                                                                submission.created_at
                                                            ),
                                                            "d MMMM yyyy",
                                                            { locale: idLocale }
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Nama Warga
                                                    </p>
                                                    <p className="font-medium">
                                                        {submission.warga?.nama ||
                                                            "Undefined"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Keperluan
                                                    </p>
                                                    <p className="font-medium">
                                                        {submission.jenis_surat}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        NIK
                                                    </p>
                                                    <p className="font-medium">
                                                        {submission.warga?.nik ||
                                                            "-"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex md:flex-col p-4 gap-2 bg-gray-50 md:w-32 justify-center items-center">
                                                {submission.approval_surat?.status_approval === "Pending_RW" || submission.approval_surat?.status_approval === "Disetujui_RT" ? (
                                                    <>
                                                        <Button
                                                            variant="destructive"
                                                            className="rounded-md w-full"
                                                            onClick={() => handleActionPengajuanRW(submission.id, 'rejected')}
                                                            disabled={isActionLoadingRW[submission.id]}
                                                        >
                                                            {isActionLoadingRW[submission.id] ? 'Menolak...' : 'Tolak'}
                                                        </Button>
                                                        <Button
                                                            variant="default"
                                                            className="rounded-md bg-green-600 hover:bg-green-700 w-full"
                                                            onClick={() => handleActionPengajuanRW(submission.id, 'approved')}
                                                            disabled={isActionLoadingRW[submission.id]}
                                                        >
                                                            {isActionLoadingRW[submission.id] ? 'Menyetujui...' : 'Setujui'}
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button
                                                        variant="default"
                                                        disabled
                                                        className={`rounded-md w-full ${submission.approval_surat?.status_approval === "Disetujui_RW"
                                                                ? "bg-green-600 hover:bg-green-700"
                                                                : submission.approval_surat?.status_approval === "Ditolak_RW" ? "bg-red-600 hover:bg-red-700"
                                                                : "bg-gray-400"
                                                            }`}
                                                    >
                                                        {submission.approval_surat?.status_approval === "Disetujui_RW" ? "Disetujui" 
                                                            : submission.approval_surat?.status_approval === "Ditolak_RW" ? "Ditolak" 
                                                            : submission.approval_surat?.status_approval?.replace(/_/g, ' ') || "Menunggu"}
                                                    </Button>
                                                )}
                                            </div>
                                            <Link href={`/rw/rekap-pengajuan/${submission.id}`} className="flex items-center justify-center p-4 bg-gray-200 hover:bg-gray-300">
                                                <Button
                                                    variant="ghost"
                                                    className="rounded-full h-10 w-10 p-0"
                                                >
                                                    <ChevronRight className="h-6 w-6" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </CardContent>
                </Card>

                <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Program Kerja</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <InputLabel htmlFor="edit-nama_program_kerja">
                                    Nama Program Kerja
                                </InputLabel>
                                <TextInput
                                    id="edit-nama_program_kerja"
                                    color="orange"
                                    type="text"
                                    name="nama_program_kerja"
                                    value={editProker.nama_program_kerja}
                                    onChange={handleEditChange}
                                    className="w-full border p-2 rounded-md"
                                    placeholder="Contoh: Kerja Bakti Bulanan"
                                />
                            </div>
                            <div className="space-y-2">
                                <InputLabel htmlFor="edit-tempat">
                                    Tempat
                                </InputLabel>
                                <TextInput
                                    id="edit-tempat"
                                    color="orange"
                                    type="text"
                                    name="tempat"
                                    value={editProker.tempat}
                                    onChange={handleEditChange}
                                    className="w-full border p-2 rounded-md"
                                    placeholder="Contoh: Balai Warga"
                                />
                            </div>
                            <div className="space-y-2">
                                <InputLabel htmlFor="edit-tanggal_mulai">
                                    Tanggal Mulai
                                </InputLabel>
                                <TextInput
                                    id="edit-tanggal_mulai"
                                    color="orange"
                                    type="date"
                                    name="tanggal_mulai"
                                    value={editProker.tanggal_mulai}
                                    onChange={handleEditChange}
                                    className="w-full border p-2 rounded-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <InputLabel htmlFor="edit-tanggal_selesai">
                                    Tanggal Selesai
                                </InputLabel>
                                <TextInput
                                    id="edit-tanggal_selesai"
                                    color="orange"
                                    type="date"
                                    name="tanggal_selesai"
                                    value={editProker.tanggal_selesai}
                                    onChange={handleEditChange}
                                    className="w-full border p-2 rounded-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <InputLabel htmlFor="edit-waktu_mulai">
                                    Waktu Mulai
                                </InputLabel>
                                <TextInput
                                    id="edit-waktu_mulai"
                                    color="orange"
                                    type="time"
                                    name="waktu_mulai"
                                    value={editProker.waktu_mulai}
                                    onChange={handleEditChange}
                                    className="w-full border p-2 rounded-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <InputLabel htmlFor="edit-waktu_selesai">
                                    Waktu Selesai
                                </InputLabel>
                                <TextInput
                                    id="edit-waktu_selesai"
                                    color="orange"
                                    type="time"
                                    name="waktu_selesai"
                                    value={editProker.waktu_selesai}
                                    onChange={handleEditChange}
                                    className="w-full border p-2 rounded-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <InputLabel htmlFor="edit-penanggung_jawab">
                                    Penanggung Jawab
                                </InputLabel>
                                <TextInput
                                    id="edit-penanggung_jawab"
                                    color="orange"
                                    type="text"
                                    name="penanggung_jawab"
                                    value={editProker.penanggung_jawab}
                                    onChange={handleEditChange}
                                    className="w-full border p-2 rounded-md"
                                    placeholder="Contoh: Ketua RW"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setShowEditDialog(false)}
                                disabled={isProcessingProker.edit}
                            >
                                Batal
                            </Button>
                            <Button
                                variant="default"
                                onClick={handleSubmitEditProker}
                                disabled={isProcessingProker.edit}
                            >
                                {isProcessingProker.edit ? "Menyimpan..." : "Simpan"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tambah Program Kerja</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <InputLabel htmlFor="add-nama_program_kerja">
                                    Nama Program Kerja
                                </InputLabel>
                                <TextInput
                                    id="add-nama_program_kerja"
                                    color="orange"
                                    type="text"
                                    name="nama_program_kerja"
                                    value={tambahProker.nama_program_kerja}
                                    onChange={handleTambahChange}
                                    className="w-full border p-2 rounded-md"
                                    placeholder="Contoh: Kerja Bakti Bulanan"
                                />
                            </div>
                            <div className="space-y-2">
                                <InputLabel htmlFor="add-tempat">
                                    Tempat
                                </InputLabel>
                                <TextInput
                                    id="add-tempat"
                                    color="orange"
                                    type="text"
                                    name="tempat"
                                    value={tambahProker.tempat}
                                    onChange={handleTambahChange}
                                    className="w-full border p-2 rounded-md"
                                    placeholder="Contoh: Balai Warga"
                                />
                            </div>
                            <div className="space-y-2">
                                <InputLabel htmlFor="add-tanggal_mulai">
                                    Tanggal Mulai
                                </InputLabel>
                                <TextInput
                                    id="add-tanggal_mulai"
                                    color="orange"
                                    type="date"
                                    name="tanggal_mulai"
                                    value={tambahProker.tanggal_mulai}
                                    onChange={handleTambahChange}
                                    className="w-full border p-2 rounded-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <InputLabel htmlFor="add-tanggal_selesai">
                                    Tanggal Selesai
                                </InputLabel>
                                <TextInput
                                    id="add-tanggal_selesai"
                                    color="orange"
                                    type="date"
                                    name="tanggal_selesai"
                                    value={tambahProker.tanggal_selesai}
                                    onChange={handleTambahChange}
                                    className="w-full border p-2 rounded-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <InputLabel htmlFor="add-waktu_mulai">
                                    Waktu Mulai
                                </InputLabel>
                                <TextInput
                                    id="add-waktu_mulai"
                                    color="orange"
                                    type="time"
                                    name="waktu_mulai"
                                    value={tambahProker.waktu_mulai}
                                    onChange={handleTambahChange}
                                    className="w-full border p-2 rounded-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <InputLabel htmlFor="add-waktu_selesai">
                                    Waktu Selesai
                                </InputLabel>
                                <TextInput
                                    id="add-waktu_selesai"
                                    color="orange"
                                    type="time"
                                    name="waktu_selesai"
                                    value={tambahProker.waktu_selesai}
                                    onChange={handleTambahChange}
                                    className="w-full border p-2 rounded-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <InputLabel htmlFor="add-penanggung_jawab">
                                    Penanggung Jawab
                                </InputLabel>
                                <TextInput
                                    id="add-penanggung_jawab"
                                    color="orange"
                                    type="text"
                                    name="penanggung_jawab"
                                    value={tambahProker.penanggung_jawab}
                                    onChange={handleTambahChange}
                                    className="w-full border p-2 rounded-md"
                                    placeholder="Contoh: Ketua RW"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setShowAddDialog(false)}
                                disabled={isProcessingProker.add}
                            >
                                Batal
                            </Button>
                            <Button
                                variant="default"
                                onClick={handleSubmitTambahProker}
                                disabled={isProcessingProker.add}
                            >
                               {isProcessingProker.add ? "Menyimpan..." : "Simpan"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
};

export default DashboardContent;
