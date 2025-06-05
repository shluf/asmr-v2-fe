import { Button } from "@/components/ui/button"
import { ArrowUpDown, Eye, UserCog, UserX, Info } from "lucide-react"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import axios from "@/lib/axios"
import { useState } from "react"
import { DataField } from "@/components/partials/dataField"
import { showAlert } from "@/components/partials/Alert"
import { format, parseISO } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import PrimaryButton from "@/components/Atoms/PrimaryButton"

const formatDateSafe = (dateString, formatStr = 'dd MMM yyyy') => {
  if (!dateString) return 'N/A'
  try {
    return format(parseISO(dateString), formatStr, { locale: idLocale })
  } catch (error) {
    return dateString 
  }
}

export const columnsWarga = (fetchData) => [
    {
        accessorKey: "nomor kk",
        header: () => <div className="text-left">Nomor KK</div>,
        cell: ({ row }) => <div className="text-left font-medium">{row.original.nomor_kk || 'N/A'}</div>,
    },
    {
        accessorKey: "nama",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Nama <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="capitalize">{row.original.nama || 'N/A'}</div>,
    },
    {
        accessorKey: "jenis kelamin",
        header: () => <div className="text-center">Jenis Kelamin</div>,
        cell: ({ row }) => {
            const jk = row.original.jenis_kelamin
            return <div className="text-left font-medium">{jk === "Pria" ? "Laki-laki" : jk === "Perempuan" ? "Perempuan" : jk || 'N/A'}</div>
        },
    },
    {
        accessorKey: "nik",
        header: () => <div className="text-center">NIK</div>,
        cell: ({ row }) => <div className="text-center font-medium">{row.original.nik || 'N/A'}</div>,
    },
    {
        accessorFn: row => row.rt?.no_rt,
        id: "no rt",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                RT <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="text-center font-medium">{row.original.no_rt || 'N/A'}</div>,
    },
    {
        accessorFn: row => row.rt?.rw?.no_rw,
        id: "no rw",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                RW <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="text-center font-medium">{row.original.no_rw || 'N/A'}</div>,
    },
    {
        accessorKey: "no telp",
        header: () => <div className="text-left">Nomor Telp</div>,
        cell: ({ row }) => <div className="text-left font-medium">{row.original.phone || 'N/A'}</div>,
    },
 
    {
        id: "actions",
        enableHiding: false,
        header: () => <div className="text-center">Aksi</div>,
        cell: ({ row }) => {
            const warga = row.original
            const wargaId = warga.id
            const isUserActive = warga.user?.status_akun === 1

            const [isSubmitting, setIsSubmitting] = useState(false)
            const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
            const [isConfirmDeactivateDialogOpen, setIsConfirmDeactivateDialogOpen] = useState(false)

            const handleToggleUserStatus = async () => {

                setIsSubmitting(true)
                try {
                    const response = await axios.put(`/api/approval-role/warga/${wargaId}/${isUserActive ? "reject" : "approve"}`)
                    const newStatus = response.data.status

                    showAlert({
                        title: "Berhasil!",
                        desc: `Akun pengguna untuk ${warga.nama} telah di-${newStatus === 1 ? 'aktifkan' : 'nonaktifkan'}.`,
                        success: true,
                        message: `Berhasil mengubah status akun warga.`,
                        color: "green",
                        onConfirm: () => fetchData(),
                    })
                    setIsConfirmDeactivateDialogOpen(false)
                } catch (error) {
                    showAlert({
                        title: "Gagal!",
                        desc: error.response?.data?.message || "Gagal mengubah status akun warga.",
                        success: false,
                        message: error.response?.data?.message || "Gagal mengubah status akun warga.",
                        color: "red",
                        errors: error.response?.data?.errors
                    })
                } finally {
                    setIsSubmitting(false)
                }
            }

            return (
                <div className="flex items-center justify-center gap-2">
                    <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 px-3" onClick={() => setIsDetailDialogOpen(true)}>
                                <Eye className="h-4 w-4" /> Lihat Detail
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Detail Data Warga: {warga.nama}</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-y-2 gap-x-4 py-4 text-sm max-h-[70vh] w-full overflow-y-auto pr-2">
                                <DataField className="md:col-span-2" label="Nama Lengkap" value={warga.nama || 'N/A'} />
                                <DataField label="Email" value={warga.email || 'N/A'} />
                                <DataField label="Alamat" textarea value={warga.alamat.alamat ? `${warga.alamat.alamat}, Kab. ${warga.alamat.kabupaten}, Prov. ${warga.alamat.provinsi}` : 'N/A'} />
                                <DataField label="Tempat, Tanggal Lahir" value={`${warga.tempat_lahir}, ${formatDateSafe(warga.tanggal_lahir)}`} />
                                <DataField label="Agama" value={warga.agama || 'N/A'} />
                                <DataField label="NIK" value={warga.nik || 'N/A'} />
                                <DataField label="No. KK" value={warga.nomor_kk || 'N/A'} />
                                <DataField label="Jenis Kelamin" value={warga.jenis_kelamin === "Pria" ? "Laki-laki" : warga.jenis_kelamin === "Perempuan" ? "Perempuan" : warga.jenis_kelamin || 'N/A'} />
                                <DataField label="No. Telepon" value={warga.phone || 'N/A'} />
                                <DataField label="RT" value={warga.no_rt || 'N/A'} />
                                <DataField label="RW" value={warga.no_rw || 'N/A'} />
                            </div>
                            <DialogFooter className="mt-4">
                                <div className="flex items-center gap-2">Status</div>
                                <PrimaryButton
                                    color={warga.user?.status_akun === 1 ? "green" : warga.user?.status_akun === 2 ? "red" : "yellow"}
                                >
                                    {warga.user?.status_akun === 1 ? "Aktif" : warga.user?.status_akun === 2 ? "Nonaktif" : "Menunggu"}
                                </PrimaryButton>
                                <DialogClose asChild>
                                    <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>Tutup</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {warga.user && (
                         <Dialog open={isConfirmDeactivateDialogOpen} onOpenChange={setIsConfirmDeactivateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant={isUserActive ? "destructive" : "outline"} size="icon" className="h-8 w-8" onClick={() => setIsConfirmDeactivateDialogOpen(true)} title={isUserActive ? "Nonaktifkan Akun" : "Aktifkan Akun"}>
                                    {isUserActive ? <UserX className="h-4 w-4" /> : <UserCog className="h-4 w-4" />}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Konfirmasi: {isUserActive ? "Nonaktifkan" : "Aktifkan"} Akun Pengguna</DialogTitle>
                                    <DialogDescription>
                                        Apakah Anda yakin ingin {isUserActive ? "menonaktifkan" : "mengaktifkan"} akun pengguna untuk <strong>{warga.nama}</strong>?
                                        {isUserActive ? " Pengguna tidak akan bisa login.": " Pengguna akan bisa login kembali."}
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="mt-6">
                                    <DialogClose asChild>
                                        <Button variant="outline" onClick={() => setIsConfirmDeactivateDialogOpen(false)}>Batal</Button>
                                    </DialogClose>
                                    <Button variant={isUserActive ? "destructive" : "default"} onClick={handleToggleUserStatus} disabled={isSubmitting}>
                                        {isSubmitting ? "Memproses..." : `Ya, ${isUserActive ? "Nonaktifkan" : "Aktifkan"}`}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                    {!warga.user && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Warga ini tidak memiliki akun pengguna">
                            <Info className="h-4 w-4 text-gray-400" />
                        </Button>
                    )}
                </div>
            )
        },
    },
]

