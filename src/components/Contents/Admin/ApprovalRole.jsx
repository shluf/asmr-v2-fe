import React, { useState, useEffect } from "react"
import axios from "@/lib/axios"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { showAlert } from "@/components/partials/Alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, Loader2, X, Eye } from "lucide-react"
import { DataField } from "@/components/partials/dataField"
import { fetchApprovalRoleData } from "@/hooks/admin"
import { format, parseISO } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

const formatDateSafe = (dateString, formatStr = 'EEEE, dd MMMM yyyy') => {
  if (!dateString) return 'N/A'
  try {
    return format(parseISO(dateString), formatStr, { locale: idLocale })
  } catch (error) {
    return dateString 
  }
}

const ApprovalRole = () => {
    const [dataWargaPending, setDataWargaPending] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedWargaPending, setSelectedWargaPending] = useState(null)
    const [actionLoading, setActionLoading] = useState({})
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

    const loadData = () => {
        fetchApprovalRoleData(setIsLoading, setDataWargaPending)

    }

    useEffect(() => {
        loadData()
    }, [])

    const handleApprovalAction = async (pendingId, newStatus) => {

        setActionLoading(prev => ({ ...prev, [pendingId]: true }))
        const status = newStatus === 'approved' ? 'approve' : 'reject'
        try {
            await axios.put(`/api/approval-role/warga/${pendingId}/${status}`)
            showAlert({
                title: "Berhasil!",
                desc: `Permintaan berhasil di-${newStatus === 'approved' ? 'setujui' : 'tolak'}.`,
                message: `Silakan cek kembali data warga yang telah di-${newStatus === 'approved' ? 'setujui' : 'tolak'}.`,
                success: true,
                color: "green",
            })
            loadData()
            if (selectedWargaPending && selectedWargaPending.user.id === pendingId) {
                setIsDetailDialogOpen(false)
                setSelectedWargaPending(null)
            }
        } catch (error) {
            showAlert({
                title: "Gagal!",
                desc: error.response?.data?.message || `Gagal ${newStatus === 'approved' ? 'menyetujui' : 'menolak'} permintaan.`,
                message: "Silakan coba lagi.",
                success: false,
                color: "red",
                errors: error.response?.data?.errors
            })
        } finally {
            setActionLoading(prev => ({ ...prev, [pendingId]: false }))
        }
    }

    const openDetailDialog = (wargaPending) => {
        setSelectedWargaPending(wargaPending)
        setIsDetailDialogOpen(true)
    }

    return (
        <div className="w-full p-6">
            <div>
                <h2 className="font-semibold text-lg mb-4 text-gray-800">
                    Permintaan Persetujuan Akun Warga
                </h2>
                <div className="rounded-md border">
                <Table className="relative">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-gray-600">Tanggal</TableHead>
                            <TableHead className="text-gray-600">Nama Warga</TableHead>
                            <TableHead className="text-gray-600">NIK</TableHead>
                            <TableHead className="text-gray-600">RT</TableHead>
                            <TableHead className="text-gray-600">RW</TableHead>
                            <TableHead className="text-center text-gray-600">Status Permintaan</TableHead>
                            <TableHead className="text-center text-gray-600">Detail</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array(5).fill(null).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell className="text-center"><Skeleton className="h-8 w-20 mx-auto" /></TableCell>
                                    <TableCell className="text-center"><Skeleton className="h-8 w-20 mx-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : dataWargaPending.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                                    Tidak ada permintaan persetujuan akun saat ini.
                                </TableCell>
                            </TableRow>
                        ) : (
                            dataWargaPending.sort((a, b) => {
                                if (a.user.status_akun !== b.user.status_akun) {
                                    return a.user.status_akun - b.user.status_akun;
                                }
                                return new Date(b.created_at) - new Date(a.created_at);
                            }).map((wp) => {
                                const isItemLoading = actionLoading[wp.id]
                                return (
                                <TableRow key={wp.id}>
                                    <TableCell className="font-medium py-3">{formatDateSafe(wp.created_at)}</TableCell>
                                    <TableCell className="font-medium py-3">{wp.nama || 'N/A'}</TableCell>
                                    <TableCell className="font-medium py-3">{wp.nik || 'N/A'}</TableCell>
                                    <TableCell className="font-medium py-3">{wp.rt?.nama_rt || 'N/A'}</TableCell>
                                    <TableCell className="font-medium py-3">{wp.rt?.rw?.nama_rw || 'N/A'}</TableCell>
                                    <TableCell className="text-center py-2">
                                        {wp.user.status_akun == 0 ? (
                                            <div className="flex space-x-2 justify-center">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 px-3 border-red-500 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50"
                                                    onClick={() => handleApprovalAction(wp.id, 'rejected')}
                                                    disabled={isItemLoading}
                                                    title="Tolak Permintaan"
                                                >
                                                    {isItemLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />} Tolak
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 px-3 border-green-500 text-green-500 hover:bg-green-500 hover:text-white disabled:opacity-50"
                                                    onClick={() => handleApprovalAction(wp.id, 'approved')}
                                                    disabled={isItemLoading}
                                                    title="Setujui Permintaan"
                                                >
                                                    {isItemLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Setujui
                                                </Button>
                                            </div>
                                        ) : (
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                                                ${wp.user.status_akun == 1 ? 'bg-green-100 text-green-700' : 
                                                 wp.user.status_akun == 2 ? 'bg-red-100 text-red-700' : 
                                                 'bg-yellow-100 text-yellow-700'}`}>
                                                {wp.user.status_akun == 1 ? 'Disetujui' : 
                                                 wp.user.status_akun == 2 ? 'Ditolak' : 'Pending'}
                                            </span>
                                        )
                                    }
                                    </TableCell>
                                    <TableCell className="text-center py-2">
                                        <Button 
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openDetailDialog(wp)}
                                            className="h-8 px-3"
                                        >
                                            <Eye className="h-4 w-4 mr-2" /> Lihat
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
                </div>
            </div>

            {selectedWargaPending && (
                <Dialog open={isDetailDialogOpen} onOpenChange={(isOpen) => { if(!isOpen) setSelectedWargaPending(null); setIsDetailDialogOpen(isOpen)}}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Detail Permintaan Persetujuan: {selectedWargaPending.nama}</DialogTitle>
                            <DialogDescription>
                                Tinjau detail data warga yang mengajukan persetujuan akun.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-y-2 gap-x-4 py-4 text-sm max-h-[60vh] overflow-y-auto pr-2">
                            <DataField className="md:col-span-2" label="Nama Lengkap" value={selectedWargaPending.nama || 'N/A'} />
                            <DataField label="Email" value={selectedWargaPending.user.email || 'N/A'} />
                            <DataField 
                                className="md:col-span-2" 
                                label="Alamat" 
                                textarea 
                                value={selectedWargaPending.alamat ? 
                                  (selectedWargaPending.alamat.alamat ? 
                                    `${selectedWargaPending.alamat.alamat}${selectedWargaPending.alamat.kabupaten ? `, Kab. ${selectedWargaPending.alamat.kabupaten}` : ''}${selectedWargaPending.alamat.provinsi ? `, Prov. ${selectedWargaPending.alamat.provinsi}` : ''}` 
                                    : 'N/A') 
                                  : 'N/A'}
                            />
                            <DataField label="Tempat, Tanggal Lahir" value={`${selectedWargaPending.tempat_lahir || 'N/A'}, ${formatDateSafe(selectedWargaPending.tanggal_lahir)}`} />
                            <DataField label="Agama" value={selectedWargaPending.agama || 'N/A'} />
                            <DataField label="NIK" value={selectedWargaPending.nik || 'N/A'} />
                            <DataField label="No. KK" value={selectedWargaPending.nomor_kk || 'N/A'} />
                            <DataField label="Jenis Kelamin" value={selectedWargaPending.jenis_kelamin === "Pria" ? "Laki-laki" : selectedWargaPending.jenis_kelamin === "Perempuan" ? "Perempuan" : selectedWargaPending.jenis_kelamin || 'N/A'} />
                            <DataField label="No. Telepon" value={selectedWargaPending.phone || 'N/A'} />
                            <DataField label="RT" value={selectedWargaPending.rt?.nama_rt || 'N/A'} />
                            <DataField label="RW" value={selectedWargaPending.rt?.rw?.nama_rw || 'N/A'} />
                            <DataField className="md:col-span-2" label="Status Akun" value={selectedWargaPending.user.status_akun == 1 ? 'Disetujui' : selectedWargaPending.user.status_akun == 2 ? 'Ditolak' : 'Pending'} />
                            {selectedWargaPending.catatan && <DataField className="md:col-span-2" label="Catatan Sebelumnya" value={selectedWargaPending.catatan} />}
                        </div>
                        <DialogFooter className="mt-4 pt-4 border-t">
                            {selectedWargaPending.user.status_akun == 0 ? (
                                <div className="flex gap-2 justify-end items-center w-full">
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleApprovalAction(selectedWargaPending.id, 'rejected')}
                                        disabled={actionLoading[selectedWargaPending.id]}
                                    >
                                        {actionLoading[selectedWargaPending.id] ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <X className="w-4 h-4 mr-2" />} Tolak
                                    </Button>
                                    <Button
                                        variant="default"
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => handleApprovalAction(selectedWargaPending.id, 'approved')}
                                        disabled={actionLoading[selectedWargaPending.id]}
                                    >
                                        {actionLoading[selectedWargaPending.id] ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />} Setujui
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex gap-2 justify-end items-center w-full">
                                    <DialogClose asChild>
                                        <Button variant="outline">Tutup</Button>
                                    </DialogClose>
                                </div>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}

export default ApprovalRole
