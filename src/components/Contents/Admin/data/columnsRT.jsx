import { showAlert } from "@/components/partials/Alert"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import axios from "@/lib/axios"
import { ArrowUpDown, Trash2, Edit3, XCircle, Loader2, UserX2 } from "lucide-react"
import { useState } from "react"
import { format, parseISO } from 'date-fns'
import Link from "next/link"

const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
        return format(parseISO(dateString), 'dd MMM yyyy')
    } catch (error) {
        return dateString
    }
}

export const columnsRT = (fetchData) => [
    {
        accessorFn: row => row.warga?.nama,
        id: "nama",
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
        id: "email",
        header: "Email",
        cell: ({ row }) => <div className="lowercase">{row.original.data?.user?.email || <p className="text-red-500 text-xs">---</p>}</div>,
    },
    {
        accessorFn: row => `${formatDate(row.periode_mulai)} - ${formatDate(row.periode_selesai)}`,
        id: "periode",
        header: () => <div className="text-left">Periode</div>,
        cell: ({ row }) => (
            <div className="text-left font-medium text-nowrap">
                { row.original.data?.pejabat.periode_mulai && row.original.data?.pejabat.periode_selesai ? `${formatDate(row.original.data?.pejabat.periode_mulai)} - ${formatDate(row.original.data?.pejabat.periode_selesai)}` : <p className="text-red-500 text-xs">---</p>}
            </div>
        ),
    },
    {
        accessorFn: row => row.warga?.rt?.rw?.no_rw,
        id: "no rw",
        header: "Penanggung Jawab",
        cell: ({ row }) => <div className="text-center font-medium">{row.original.rw?.nama_rw || 'N/A'}</div>,
    },
    {
        accessorFn: row => row.warga?.alamat_ktp || row.warga?.alamat?.nama_jalan,
        id: "alamat pejabat",
        header: () => <div className="text-left">Alamat</div>,
        cell: ({ row }) => {
            const [show, setShow] = useState(false)
            const alamat = row.original.data?.warga?.alamat ? row.original.data?.warga?.alamat?.alamat + ', ' + row.original.data?.warga?.alamat?.kabupaten + ', ' + row.original.data?.warga?.alamat?.provinsi : null
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
            )
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
        enableHiding: true,
        header: () => <div className="text-center">Aksi</div>,
        cell: ({ row }) => {
            const pejabat = row.original
            const pejabatId = pejabat.id

            const [isSubmitting, setIsSubmitting] = useState(false)

            const handleDelete = async () => {
                setIsSubmitting(true)
                try {
                    const response = await axios.delete(`/api/pejabat/rt/${pejabatId}`)
                    if (response.data.deleted) {
                        showAlert({
                            title: "Berhasil!",
                            desc: "Data Pejabat RT telah dihapus",
                            success: true,
                            color: "green",
                            onConfirm: () => fetchData(),
                        })
                    }
                } catch (error) {
                    showAlert({
                        title: "Gagal!",
                        desc: error.response?.data?.message || "Terjadi kesalahan saat menghapus data.",
                        success: false,
                        color: "red",
                    })
                } finally {
                    setIsSubmitting(false)
                }
            }

            return (
                <div className="flex items-center justify-center gap-2">
                    {pejabat.data?.warga ? (
                        <>
                            <Link href={`/admin/kelola-rtrw/rt/${pejabatId}`} passHref legacyBehavior>
                                <Button as="a" size="sm" className="h-8 px-3 bg-[#444444] text-white">
                                    <Edit3 className="h-4 w-4" /> Edit
                                </Button>
                            </Link>
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
            )
        },
    },
]
