'use client'

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserFilled } from "@/utility/svg-icons"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { ChevronRight, ShieldCheck } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import ProgramKerja from "@/components/partials/ProgramKerja"
import Link from "next/link"
import { useProgramKerjaRT, usePengajuanTerbaruRT } from "@/hooks/rt"
import { AlertWrapper } from "@/components/partials/Alert"
import { useAuthTokenClient } from "@/lib/jwt"

const DashboardContent = () => {
    const { payload } = useAuthTokenClient()
    const { dataProkerRT, prokerIsLoadingRT } = useProgramKerjaRT()
    const {
        pengajuanTerakhirRT,
        isLoadingPengajuanRT,
        handleActionPengajuan,
        isActionLoadingRT,
    } = usePengajuanTerbaruRT(payload.id_rt)

    return (
        <>
            <AlertWrapper />
            <div className="space-y-8 overflow-hidden w-full mb-4">
                <ProgramKerja
                    dataProker={dataProkerRT}
                    loading={prokerIsLoadingRT}
                />

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            Pengajuan Surat Terakhir
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isLoadingPengajuanRT ? (
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
                        ) : !pengajuanTerakhirRT || pengajuanTerakhirRT.length === 0 ? (
                            <Card>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                        <ShieldCheck className="h-6 w-6 text-orange" />
                                    </div>
                                    <div className="flex flex-col h-full justify-between">
                                        <p className="font-medium flex items-center h-1/2">
                                            Tidak ada pengajuan surat yang tersedia
                                        </p>
                                        <p className="text-sm flex h-1/2 text-orange">
                                            Belum ada surat yang diajukan oleh warga
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        ) : (
                            pengajuanTerakhirRT.map((submission) => (
                                <Card key={submission.id_pengajuan_surat} className="overflow-hidden">
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
                                                        {submission.warga.nama ||
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
                                                        {submission.warga.nik ||
                                                            "-"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex md:flex-col p-4 gap-2 bg-gray-50 md:w-32 justify-center items-center">
                                                {submission.approval_surat?.status_approval === "Pending_RT" ? (
                                                    <>
                                                        <Button
                                                            variant="destructive"
                                                            className="rounded-md w-full"
                                                            onClick={() => handleActionPengajuan(submission.id, 'rejected')}
                                                            disabled={isActionLoadingRT[submission.id]}
                                                        >
                                                            {isActionLoadingRT[submission.id] ? 'Menolak...' : 'Tolak'}
                                                        </Button>
                                                        <Button
                                                            variant="default"
                                                            className="rounded-md bg-green-600 hover:bg-green-700 w-full"
                                                            onClick={() => handleActionPengajuan(submission.id, 'approved')}
                                                            disabled={isActionLoadingRT[submission.id]}
                                                        >
                                                            {isActionLoadingRT[submission.id] ? 'Menyetujui...' : 'Setujui'}
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button
                                                        variant="default"
                                                        disabled
                                                        className={`rounded-md w-full ${
                                                            submission.approval_surat?.status_approval === "Disetujui_RT"
                                                                ? "bg-green-600 hover:bg-green-700"
                                                                : submission.approval_surat?.status_approval === "Ditolak_RT" ? "bg-red-600 hover:bg-red-700"
                                                                : "bg-gray-400"
                                                        }`}
                                                    >
                                                        {submission.approval_surat?.status_approval === "Disetujui_RT" ? "Disetujui" : submission.approval_surat?.status_approval === "Ditolak_RT" ? "Ditolak" : submission.approval_surat?.status_approval?.replace(/_/g, ' ')}
                                                    </Button>
                                                )}
                                            </div>
                                            <Link href={`/rt/rekap-pengajuan/${submission.id}`} className="flex items-center justify-center p-4 bg-gray-200 hover:bg-gray-300">
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
            </div>
        </>
    )
}

export default DashboardContent