'use client'

import { useState, useEffect } from "react"
import { format } from "date-fns"
import idLocale from "date-fns/locale/id"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserFilled } from "@/utility/svg-icons"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { ShieldCheck } from "lucide-react"
import ProgramKerja from "@/components/partials/ProgramKerja"
import axios from "@/lib/axios"
import { useProgramKerjaWarga } from "@/hooks/warga"

const DashboardContent = () => {
    const [dataPengajuan, setDataPengajuan] = useState([])
    const [pengajuanIsLoading, setPengajuanIsLoading] = useState(true)

    const { dataProkerWarga, 
        prokerIsLoadingWarga,
    } = useProgramKerjaWarga()

    useEffect(() => {   
        const fetchPengajuan = async () => {
            try {
                const response = await axios.get('/api/surat/riwayat-pengajuan')
                if (response.data.status === 'success') {
                    setDataPengajuan(response.data.pengajuan)
                }
            } catch (error) {
                // console.error('Error fetching pengajuan data:', error)
            } finally {
                setPengajuanIsLoading(false)
            }
        }
        
        fetchPengajuan()
    }, [])

    return (
        <div className="space-y-8 overflow-hidden w-full mb-4">
            <ProgramKerja
                dataProker={dataProkerWarga}
                loading={prokerIsLoadingWarga}
            />

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        Pengajuan Surat Terakhir
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                {pengajuanIsLoading ? (
                        <>
                            {[...Array(2)].map((_, index) => (
                                <Card key={index}>
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                                {[...Array(6)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex flex-col h-full justify-between"
                                                    >
                                                        <Skeleton className="h-4 w-24 mb-2" />
                                                        <Skeleton className="h-4 w-32" />
                                                    </div>
                                                ))}
                                            </div>
                                            <Skeleton className="h-10 w-32 rounded-full" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </>
                    )  : !dataPengajuan.length > 0 ? (
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <ShieldCheck className="h-6 w-6 text-green" />
                                    </div>
                                    <div className="flex flex-col h-full justify-between">
                                        <p className="font-medium flex items-center h-1/2">
                                            Tidak ada pengajuan surat
                                        </p>
                                        <p className="text-sm flex h-1/2 text-green">
                                            Anda belum melakukan pengajuan surat
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : dataPengajuan.map((dataPengajuan, index) => (
                        <Card key={index}>
                            <CardContent className="flex items-center p-6">
                                <div className="w-12 h-12 bg-green-3 rounded-[12px] flex items-center justify-center text-2xl">
                                    <UserFilled size={6} />
                                </div>
                                <div className="grid grid-cols-2 gap-1 md:gap-4 ml-4 w-full items-center">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 items-center">
                                        <div>
                                            <p className="font-medium mt-2 text-left mb-1">
                                                Tanggal pengajuan
                                            </p>
                                            <p className="font-medium text-sm text-slate-700 text-left">
                                                {format(
                                                    new Date(
                                                        dataPengajuan.created_at
                                                    ),
                                                    "EEEE, dd MMMM yyyy",
                                                    { locale: idLocale }
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="font-medium mt-2 text-left mb-1">
                                                Keperluan
                                            </p>
                                            <p className="font-medium text-sm text-slate-700 text-left">
                                                {dataPengajuan.jenis_surat}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4 items-center">
                                        <div>
                                            <p className="font-medium mt-2 text-left mb-1">
                                                Status tindak lanjut
                                            </p>
                                            
                                            <div className={`${dataPengajuan.approval_surat?.status_approval === "Selesai" ? "bg-green" : dataPengajuan.approval_surat?.status_approval === "Ditolak_RT" || dataPengajuan.approval_surat?.status_approval === "Ditolak_RW" ? "bg-red" : "bg-orange"} rounded-full font-medium text-sm text-slate-100 text-center py-1`}>
                                                {dataPengajuan.approval_surat?.status_approval.replace(/_/g, ' ')}
                                            </div>
                                        </div>
                                        <Link href="/warga/histori">
                                            <Button
                                                variant="outline"
                                                className="rounded-full mt-2"
                                            >
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}

export default DashboardContent
