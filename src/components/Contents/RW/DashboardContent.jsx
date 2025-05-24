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
import axios from "@/lib/axios";
import { id as idLocale } from "date-fns/locale";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import InputLabel from "@/components/Atoms/InputLabel";
import TextInput from "@/components/Atoms/TextInput";
import { AlertWrapper, showAlert } from "@/components/partials/Alert";
import Link from "next/link";
import ProgramKerja from "@/components/partials/ProgramKerja";
import { ChevronRight } from "lucide-react";
import { useProgramKerjaRW, usePengajuanRW } from "@/hooks/rw";

const DashboardContent = ({ idRW }) => {
    const {
        pengajuanTerakhir,
        isLoadingPengajuan,
    } = usePengajuanRW(idRW);

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
    } = useProgramKerjaRW();

    const handleEditChange = (e) => {
        setEditProker((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleTambahChange = (e) => {
        setTambahProker((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <>
            <AlertWrapper />
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
                        {isLoadingPengajuan ? (
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
                        ) : !pengajuanTerakhir || !pengajuanTerakhir.data || pengajuanTerakhir.data.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                Tidak ada pengajuan surat yang tersedia
                            </div>
                        ) : (
                            pengajuanTerakhir.data.map((submission, index) => (
                                <Card key={index} className="overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row lg-28">
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
                                                        {submission.nama_pemohon ||
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
                                                        {submission.nik ||
                                                            "3302029309209030"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex md:flex-col p-4 gap-2 bg-gray-50 md:w-32 justify-center">
                                                {submission.status_rw ===
                                                "pending" && submission.status_rt === "approved" ? (
                                                  <>
                                                  <Button
                                                      variant="destructive"
                                                      className="rounded-md"
                                                  >
                                                      Tolak
                                                  </Button>
                                                  <Button
                                                      variant="default"
                                                      className="rounded-md bg-green-600 hover:bg-green-700"
                                                  >
                                                      Setujui
                                                  </Button>
                                              </>
                                                ) : (
                                                    <Button
                                                        variant="default"
                                                        disabled
                                                        className={`rounded-md ${
                                                            submission.status_rw ===
                                                            "approved"
                                                                ? "bg-green-600 hover:bg-green-700"
                                                                : submission.status_rw === "rejected" ? "bg-red-600 hover:bg-red-700" 
                                                                : "bg-gray-400"
                                                        }`}
                                                    >
                                                        {submission.status_rw}
                                                    </Button>

                                                )}
                                            </div>
                                            <Link
                                                href="/dashboard/pengajuanMasalah"
                                                className="flex items-center justify-center p-4 bg-gray-200"
                                            >
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
                                <InputLabel htmlFor="edit-tanggal">
                                    Tanggal
                                </InputLabel>
                                <TextInput
                                    id="edit-tanggal"
                                    color="orange"
                                    type="date"
                                    name="tanggal"
                                    value={editProker.tanggal}
                                    onChange={handleEditChange}
                                    className="w-full border p-2 rounded-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <InputLabel htmlFor="edit-waktu">
                                    Waktu
                                </InputLabel>
                                <TextInput
                                    id="edit-waktu"
                                    color="orange"
                                    type="text"
                                    name="waktu"
                                    value={editProker.waktu}
                                    onChange={handleEditChange}
                                    className="w-full border p-2 rounded-md"
                                    placeholder="Contoh: 19.30 - 21.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <InputLabel htmlFor="edit-jenis_kegiatan">
                                    Kegiatan
                                </InputLabel>
                                <TextInput
                                    id="edit-jenis_kegiatan"
                                    color="orange"
                                    type="text"
                                    name="jenis_kegiatan"
                                    value={editProker.jenis_kegiatan}
                                    onChange={handleEditChange}
                                    className="w-full border p-2 rounded-md"
                                    placeholder="Contoh: Rapat RT/RW"
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
                                    placeholder="Contoh: Balai warga RT02"
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
                                    placeholder="Contoh: Ketua RT"
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
                                <InputLabel htmlFor="add-tanggal">
                                    Tanggal
                                </InputLabel>
                                <TextInput
                                    id="add-tanggal"
                                    color="orange"
                                    type="date"
                                    name="tanggal"
                                    value={tambahProker.tanggal}
                                    onChange={handleTambahChange}
                                    className="w-full border p-2 rounded-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <InputLabel htmlFor="add-waktu">
                                    Waktu
                                </InputLabel>
                                <TextInput
                                    id="add-waktu"
                                    color="orange"
                                    type="text"
                                    name="waktu"
                                    value={tambahProker.waktu}
                                    onChange={handleTambahChange}
                                    className="w-full border p-2 rounded-md"
                                    placeholder="Contoh: 19.30 - 21.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <InputLabel htmlFor="add-jenis_kegiatan">
                                    Kegiatan
                                </InputLabel>
                                <TextInput
                                    id="add-jenis_kegiatan"
                                    color="orange"
                                    type="text"
                                    name="jenis_kegiatan"
                                    value={tambahProker.jenis_kegiatan}
                                    onChange={handleTambahChange}
                                    className="w-full border p-2 rounded-md"
                                    placeholder="Contoh: Rapat RT/RW"
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
                                    placeholder="Contoh: Balai warga RT02"
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
                                    placeholder="Contoh: Ketua RT"
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
