'use client'

import React from 'react'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { Check, X, ShieldCheck, UploadIcon } from 'lucide-react'
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import PrimaryButton from '@/components/Atoms/PrimaryButton'
import { Skeleton } from '@/components/ui/skeleton'
import TextInput from '@/components/Atoms/TextInput'
import { usePengajuanMasalahRW } from '@/hooks/rw'
import { useAuthTokenClient } from "@/lib/jwt"

const PengajuanMasalah = () => {
  const { payload } = useAuthTokenClient()
  const idRW = payload?.id_rw

  const {
    pengajuanMasalahDataRW,
    isLoadingDataRW,
    openItemsRW,
    setOpenItemsRW,
    handleActionRW,
    isActionLoadingRW,
    terbitkanSurat,
  } = usePengajuanMasalahRW(idRW)

  return (
    <>
      <div className="w-full space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Surat Menunggu Persetujuan RW</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingDataRW ? (
              <>
                {[...Array(3)].map((_, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                          {[...Array(6)].map((_, i) => (
                            <div key={i} className='flex flex-col h-full justify-between'>
                              <Skeleton className="h-4 w-24 mb-2" />
                              <Skeleton className="h-4 w-32" />
                            </div>
                          ))}
                        </div>
                        <Skeleton className="h-10 w-32" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : !pengajuanMasalahDataRW || pengajuanMasalahDataRW.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-orange-500" />
                  </div>               
                  <div className='flex flex-col h-full justify-between'>
                    <p className="font-medium flex items-center h-1/2">Tidak ada surat pending</p>
                    <p className="text-sm flex h-1/2 text-orange-600">Semua pengajuan surat telah diproses</p>
                  </div>
                </div>
                </CardContent>
              </Card>
            ) : (
              pengajuanMasalahDataRW.map((surat) => (
                <Collapsible
                  key={surat.id}
                  open={openItemsRW[surat.id] || false}
                  onOpenChange={(isOpen) => 
                    setOpenItemsRW((prev) => ({ ...prev, [surat.id]: isOpen }))
                  }
                >
                  <Card className="shadow-md mt-6 sm:sticky top-0 z-10 text-sm">
                    <div className='absolute -top-[25px] w-full h-6 bg-white' />
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                          <div className="flex flex-col h-full justify-between">
                            <p className="font-bold flex items-center h-1/2 mb-1">Tanggal Pengajuan</p>
                            <p className="text-sm flex h-1/2 text-black">
                              {format(new Date(surat.created_at), "EEEE, dd MMMM yyyy", { locale: idLocale })}
                            </p>
                          </div>
                          <div className="flex flex-col h-full justify-between">
                            <p className="font-bold flex items-center h-1/2 mb-1">Nama Warga</p>
                            <p className="text-sm flex h-1/2 text-black">{surat.warga?.nama || 'Undefined'}</p>
                          </div>
                          <div className="flex flex-col h-full justify-between">
                            <p className="font-bold flex items-center h-1/2 mb-1">Status Tindak Lanjut</p>
                            { surat.status === 'Diajukan' || surat.status === 'Diproses_RT' || surat.status === 'Diproses_RW' ? (
                          <div className="flex justify-center items-center bg-yellow-100 text-yellow-600 rounded-full px-2 py-1">
                            <p className="text-sm">
                              {surat.status?.replace("_"," ") || 'N/A'}
                            </p>  
                          </div>
                        ) : surat.status === 'Ditolak' ? (
                          <div className="flex justify-center items-center bg-red-100 text-red-600 rounded-full px-2 py-1">
                            <p className="text-sm">
                              {surat.status?.replace("_"," ") || 'N/A'}
                            </p>  
                          </div>
                        ) : surat.status === 'Selesai' || surat.status === 'Disetujui' ? (
                          <div className="flex justify-center items-center bg-green-100 text-green-600 rounded-full px-2 py-1">
                            <p className="text-sm">
                              {surat.status?.replace("_"," ") || 'N/A'}
                            </p>  
                          </div>
                        ) : <p className="text-sm text-black">
                          {surat.status?.replace("_"," ") || 'N/A'}
                        </p> }
                          </div>
                          <div className="flex flex-col h-full justify-between">
                            <p className="font-bold flex items-center h-1/2 mb-1">Penanggung Jawab</p>
                            <p className="text-sm flex h-1/2 text-black">{surat.rt?.nama_rt || 'RT -'}, {surat.rw?.nama_rw || 'RW -'}</p>
                          </div>
                          <div className="flex flex-col h-full justify-between">
                            <p className="font-bold flex items-center h-1/2 mb-1">Keperluan</p>
                            <p className="text-sm flex h-1/2 text-black">{surat.jenis_surat}</p>
                          </div>
                          <div className="flex flex-col h-full justify-between">
                            <p className="font-bold flex items-center h-1/2 mb-1">NIK</p>
                            <p className="text-sm flex h-1/2 text-black">{surat.warga?.nik || '-'}</p>
                          </div>
                        </div>

                        <CollapsibleTrigger asChild>
                          <Button id="expand-button" className="rounded-lg bg-[#444444] text-white">
                            {openItemsRW[surat.id] ? "Sembunyikan" : "Detail Surat"}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </CardContent>
                  </Card>

                  <CollapsibleContent className='mb-7 mx-2 rounded-b-lg px-8 md:px-16 bg-[#d9d9d926] p-5 shadow-inner'>
                    <div id={`collapsible-content-${surat.id}`} className="mt-6 space-y-4 md:text-base text-sm">
                      <p className="text-gray-600">
                        Yang bertanda tangan di bawah ini Ketua {surat.rt?.nama_rt || 'RT undefined'} {surat.rw?.nama_rw || 'RW undefined'} {surat.detail_pemohon?.alamat_pemohon || surat.alamat_warga || 'Alamat undefined'},
                        memberikan keterangan kepada:
                      </p>
                      <div className="text-gray-800 space-y-2">
                        <p className="flex">
                          <span className="font-semibold w-32 md:w-60">Nama</span>
                          <span className="w-5">:</span>
                          <span className="flex-1">{surat.detail_pemohon?.nama_pemohon || 'N/A'}</span>
                        </p>
                        <p className="flex">
                          <span className="font-semibold w-32 md:w-60">NIK</span>
                          <span className="w-5">:</span>
                          <span className="flex-1">{surat.detail_pemohon?.nik_pemohon || 'N/A'}</span>
                        </p>
                        <p className="flex">
                          <span className="font-semibold w-32 md:w-60">NO.KK</span>
                          <span className="w-5">:</span>
                          <span className="flex-1">{surat.detail_pemohon?.no_kk_pemohon || 'N/A'}</span>
                        </p>
                        <p className="flex">
                          <span className="font-semibold w-32 md:w-60">Jenis Kelamin</span>
                          <span className="w-5">:</span>
                          <span className="flex-1">{surat.detail_pemohon?.jenis_kelamin_pemohon || 'N/A'}</span>
                        </p>
                        <p className="flex">
                          <span className="font-semibold w-32 md:w-60">Agama</span>
                          <span className="w-5">:</span>
                          <span className="flex-1">{surat.detail_pemohon?.agama_pemohon || 'N/A'}</span>
                        </p>
                        <p className="flex">
                          <span className="font-semibold w-32 md:w-60">Tempat, tanggal lahir</span>
                          <span className="w-5">:</span>
                          <span className="flex-1">{surat.detail_pemohon?.tempat_tanggal_lahir_pemohon || 'N/A'}</span>
                        </p>
                        <p className="flex">
                          <span className="font-semibold w-32 md:w-60">Alamat</span>
                          <span className="w-5">:</span>
                          <span className="flex-1">{surat.detail_pemohon?.alamat_pemohon || 'N/A'}</span>
                        </p>
                      </div>

                      <div className="mt-4">
                        <p className="mb-2 text-gray-600">Benar bahwa yang bersangkutan adalah warga {surat.rt?.nama_rt || 'RT undefined'} {surat.rw?.nama_rw || 'RW undefined'} yang beralamat di{" "}
                        {surat.detail_pemohon?.alamat_pemohon || surat.alamat_warga || 'Alamat undefined'}, dan bermaksud untuk mengurus surat:</p>
                        <div className="mt-4 ml-6 space-y-2">
                          {[
                              "Pengantar KTP", "Pengantar KK", "Pengantar Akta Kelahiran",
                              "Surat Keterangan Kematian", "Surat Domisili Tempat tinggal", "Surat Domisili Usaha",
                              "Surat Keterangan Tidak Mampu", "Surat SKCK", "Surat Ketenagakerjaan",
                              "Surat Pengantar Nikah", "Surat Keterangan Pindah", "Lainnya",
                          ].map((jenis, index) => (
                              <label className="flex items-center" key={index}>
                                  <TextInput
                                      color="blue"
                                      type="radio"
                                      name={`jenis_surat_rw_masalah_${surat.id}`}
                                      value={jenis}
                                      className="form-radio text-blue"
                                      checked={surat.jenis_surat === jenis} 
                                      readOnly
                                  />
                                  <span className="ml-2">{jenis}</span>
                              </label>
                          ))}
                          <p className='ml-8'>{surat.detail_pemohon?.deskripsi || surat.deskripsi || 'Tidak ada deskripsi tambahan.'}</p>
                        </div>
                      </div>
                    </div>

                    {(surat.approval_surat?.status_approval === 'Pending_RW' || surat.approval_surat?.status_approval === 'Disetujui_RT') ? (
                      <div className="flex gap-2 justify-end items-center w-full mt-4">
                        <PrimaryButton
                          id="reject-button"
                          color="red"
                          rounded='full'
                          disabled={isActionLoadingRW[surat.id]}
                          onClick={() => handleActionRW(surat.id, 'rejected')}
                        >
                          <X className="w-4 h-4 mr-2" />
                          {isActionLoadingRW[surat.id] ? 'Menolak...' : 'Tolak'}
                        </PrimaryButton>
                        <PrimaryButton
                          id="approve-button"
                          color="green"
                          rounded='full'
                          disabled={isActionLoadingRW[surat.id]}
                          onClick={() => handleActionRW(surat.id, 'approved')}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          {isActionLoadingRW[surat.id] ? 'Menyetujui...' : 'Setujui'}
                        </PrimaryButton>
                      </div>
                    ) : surat.approval_surat?.status_approval === "Disetujui_RW" ? (
                      <div className="flex gap-2 justify-end items-center w-full mt-4">
                      <PrimaryButton 
                        id="publish-button"
                        color="green"
                        rounded='full'
                        disabled={isActionLoadingRW[surat.id]}
                        onClick={() => terbitkanSurat(surat.id)}
                      >
                        <UploadIcon className="w-4 h-4 mr-2" />
                        {isActionLoadingRW[surat.id] ? 'Memproses...' : 'Terbitkan'}
                      </PrimaryButton>
                      </div>
                    ) : surat.approval_surat?.status_approval === "Ditolak_RW" ? (
                      <div className="flex gap-2 justify-end items-center w-full mt-4">
                      <PrimaryButton 
                        color="red"
                        rounded='full'
                        disabled
                      >
                        <X className="w-4 h-4 mr-2" />
                        Ditolak
                      </PrimaryButton>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-end items-center w-full mt-4">
                        <p className="text-sm text-gray-500">Status: {surat.approval_surat?.status_approval?.replace("_"," ") || "Tidak Diketahui"}</p>
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default PengajuanMasalah