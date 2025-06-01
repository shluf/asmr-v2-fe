import { showAlert } from "@/components/partials/Alert";
import { DataField } from "@/components/partials/dataField";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import axios from "@/lib/axios";
import { ArrowUpDown, Trash2, Edit3, Save, XCircle, Loader2, UserX2 } from "lucide-react";
import { useEffect, useState } from "react";
import { format, parseISO } from 'date-fns';

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return format(parseISO(dateString), 'dd MMM yyyy');
    } catch (error) {
        return dateString;
    }
};

export const columnsRT = (fetchData) => [
    {
        accessorFn: row => row.warga?.nama,
        id: "nama_pejabat",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Nama
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="capitalize">{row.original.data?.warga.nama || <p className="text-red-500 text-xs">---</p>}</div>,
    },
    {
        accessorKey: "jabatan",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Jabatan
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="text-left font-medium text-nowrap">{row.original.nama_rt || <p className="text-red-500 text-xs">---</p>}</div>,
    },
    {
        accessorFn: row => row.warga?.email,
        id: "email_pejabat",
        header: "Email",
        cell: ({ row }) => <div className="lowercase">{row.original.data?.user?.email || <p className="text-red-500 text-xs">---</p>}</div>,
    },
    {
        accessorFn: row => `${formatDate(row.periode_mulai)} - ${formatDate(row.periode_selesai)}`,
        id: "periode_pejabat",
        header: () => <div className="text-left">Periode</div>,
        cell: ({ row }) => (
            <div className="text-left font-medium text-nowrap">
                { row.original.data?.pejabat.periode_mulai && row.original.data?.pejabat.periode_selesai ? `${formatDate(row.original.data?.pejabat.periode_mulai)} - ${formatDate(row.original.data?.pejabat.periode_selesai)}` : <p className="text-red-500 text-xs">---</p>}
            </div>
        ),
    },
    {
        accessorFn: row => row.warga?.rt?.rw?.no_rw,
        id: "no_rw_penanggung_jawab",
        header: "Penanggung Jawab",
        cell: ({ row }) => <div className="text-center font-medium">{row.original.rw?.nama_rw || 'N/A'}</div>,
    },
    {
        accessorFn: row => row.warga?.alamat_ktp || row.warga?.alamat?.nama_jalan,
        id: "alamat_pejabat",
        header: () => <div className="text-left">Alamat</div>,
        cell: ({ row }) => {
            const [show, setShow] = useState(false);
            const alamat = row.original.data?.warga?.alamat ? row.original.data?.warga?.alamat?.alamat + ', ' + row.original.data?.warga?.alamat?.kabupaten + ', ' + row.original.data?.warga?.alamat?.provinsi : null;
            return (
                <div className="text-left font-medium">
                    <div
                        className={`cursor-pointer ${show ? "" : "line-clamp-1"}`}
                        onClick={() => setShow(!show)}
                        title={alamat}
                    >
                        {alamat ? alamat : <p className="text-red-500 text-xs">---</p>}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "id",
        header: () => null,
        cell: () => null,
        enableHiding: false,
    },
    {
        id: "actions",
        enableHiding: false,
        header: () => <div className="text-center">Aksi</div>,
        cell: ({ row }) => {
            const pejabat = row.original;
            const pejabatId = pejabat.id;

            const initialFormState = {
                nama: pejabat.data?.warga?.nama || "",
                nama_rt: pejabat.nama_rt || "",
                email: pejabat.data?.user?.email || "",
                periode_mulai: pejabat.data?.pejabat.periode_mulai,
                periode_selesai: pejabat.data?.pejabat.periode_selesai,
            };

            const [formData, setFormData] = useState(initialFormState);
            const [fileTTD, setFileTTD] = useState(null);
            const [isSubmitting, setIsSubmitting] = useState(false);
            const [isDialogOpen, setIsDialogOpen] = useState(false);

            useEffect(() => {
                if (isDialogOpen) {
                    setFormData({
                        nama: pejabat.data?.warga?.nama || "",
                        nama_rt: pejabat.nama_rt || "",
                        email: pejabat.data?.user?.email || "",
                        periode_mulai: pejabat.data?.pejabat.periode_mulai,
                        periode_selesai: pejabat.data?.pejabat.periode_selesai,
                    });
                    setFileTTD(null);
                }
            }, [isDialogOpen, pejabat]);

            const handleInputChange = (e) => {
                const { name, value, type, checked } = e.target;
                setFormData((prev) => ({
                    ...prev,
                    [name]: type === 'checkbox' ? checked : value,
                }));
            };

            const handleFileChange = (e) => {
                setFileTTD(e.target.files[0]);
            };

            const handleUpdate = async () => {
                setIsSubmitting(true);
                const payload = new FormData();
                payload.append("nama", formData.nama);
                payload.append("nama_rt", formData.nama_rt);
                payload.append("email", formData.email);
                payload.append("periode_mulai", formData.periode_mulai);
                payload.append("periode_selesai", formData.periode_selesai);
                if (fileTTD) {
                    payload.append("ttd", fileTTD);
                }
                payload.append("_method", "PUT");

                try {
                    await axios.post(`/api/pejabat/rt/${pejabatId}`, payload, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    showAlert({
                        title: "Berhasil!",
                        desc: `Data RT ${formData.nama_rt} telah diperbarui.`,
                        success: true,
                        color: "green",
                        onConfirm: () => fetchData(),
                    });
                    setIsDialogOpen(false);
                } catch (error) {
                    console.error("Error updating RT:", error.response?.data || error.message);
                    showAlert({
                        title: "Gagal!",
                        desc: error.response?.data?.message || "Terjadi kesalahan saat memperbarui data.",
                        success: false,
                        color: "red",
                        errors: error.response?.data?.errors
                    });
                } finally {
                    setIsSubmitting(false);
                }
            };

            const handleDelete = async () => {
                setIsSubmitting(true);
                try {
                    const response = await axios.delete(`/api/pejabat/rt/${pejabatId}`);
                    if (response.data.deleted) {
                        showAlert({
                            title: "Berhasil!",
                            desc: "Data Pejabat RT telah dihapus",
                            success: true,
                            color: "green",
                            onConfirm: () => fetchData(),
                        });
                    }
                } catch (error) {
                    console.error("Error deleting RT:", error.response?.data || error.message);
                    showAlert({
                        title: "Gagal!",
                        desc: error.response?.data?.message || "Terjadi kesalahan saat menghapus data.",
                        success: false,
                        color: "red",
                    });
                } finally {
                    setIsSubmitting(false);
                }
            };

            return (
                <div className="flex items-center justify-center gap-2">
                    {pejabat.data?.warga ? (
                        <>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 px-3">
                                        <Edit3 className="h-4 w-4" /> Edit
                                    </Button>
                                </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Edit Data RT: {pejabat.nama_rt}</DialogTitle>
                                <DialogDescription>
                                    Pastikan data yang dimasukkan sudah benar.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                                <DataField label="Nama Warga" id="nama" name="nama" value={formData.nama} onChange={handleInputChange} />
                                <DataField label="Nama RT" id="nama_rt" name="nama_rt" value={formData.nama_rt} onChange={handleInputChange} placeholder="Contoh: RT 001" />
                                <DataField label="Email" id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Contoh: email@example.com" />
                                <DataField label="Periode" name={{mulai: "periode_mulai", selesai: "periode_selesai"}} value={{mulai: formData.periode_mulai, selesai: formData.periode_selesai}} onChange={{mulai: handleInputChange.periode_mulai, selesai: handleInputChange.periode_selesai}} period={true} />
                                <DataField label="Alamat" id="alamat" name="alamat"textarea value={formData.alamat} onChange={handleInputChange} />
                                <DataField label="Tanda Tangan" id="ttd" name="ttd" type="file" onChange={handleFileChange} accept=".png,.jpg,.jpeg" file={true} />
                                {pejabat.ttd && (
                                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-md border border-blue-200 mt-2">
                                        <div className="text-sm flex items-center">
                                            <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span className="font-medium">File TTD saat ini:</span>
                                            <a 
                                                href={pejabat.ttd} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="ml-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors flex items-center"
                                            >
                                                Lihat File
                                                <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <DialogFooter className="mt-4">
                                <DialogClose asChild>
                                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                                </DialogClose>
                                <Button onClick={handleUpdate} disabled={isSubmitting}>
                                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : <><Save className="mr-2 h-4 w-4" /> Simpan Perubahan</>}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="destructive" size="icon" className="h-8 w-8">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Konfirmasi Hapus</DialogTitle>
                                <DialogDescription>
                                    Apakah Anda yakin ingin menghapus data pejabat RT: <strong>{pejabat.data?.warga?.nama}</strong> ({pejabat.nama_rt})? Tindakan ini tidak dapat diurungkan.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="mt-6">
                                <DialogClose asChild>
                                    <Button variant="outline">Batal</Button>
                                </DialogClose>
                                <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
                                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menghapus...</> : <><XCircle className="mr-2 h-4 w-4" /> Ya, Hapus</>}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    </>
                    ) : (
                        <Button variant="outline" size="icon" className="h-8 w-full">
                            <UserX2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            );
        },
    },
];
