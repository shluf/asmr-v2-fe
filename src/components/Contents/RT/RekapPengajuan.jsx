import React from 'react'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { Check, X, ShieldCheck, Eye, Download } from 'lucide-react'
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
import { useRekapPengajuanRT } from '@/hooks/rt'
import { useAuthTokenClient } from '@/lib/jwt'

const RekapPengajuan = ({ select }) => {
  const { payload } = useAuthTokenClient()
  const {
    rekapPengajuanDataRT,
    isLoadingRekapRT,
    openItemsRT,
    setOpenItemsRT,
    previewSurat,
    downloadSurat,
  } = useRekapPengajuanRT(payload.id_rt, select)

  return (
    <>
      <div className="w-full space-y-4 mb-4">
      <Card>
        <CardHeader>
          <CardTitle>Rekapitulasi Pengajuan</CardTitle>
        </CardHeader>
        <CardContent className="mt-2 space-y-4">
          {isLoadingRekapRT ? (
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
          ) : !rekapPengajuanDataRT || rekapPengajuanDataRT.length === 0 ? (
            <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-yellow-500" />
              </div>               
              <div className='flex flex-col h-full justify-between'>
                <p className="font-medium flex items-center h-1/2">Tidak ada pengajuan surat</p>
                <p className="text-sm flex h-1/2 text-yellow-600">Belum ada data rekapitulasi pengajuan.</p>
              </div>
            </div>
            </CardContent>
          </Card>
          ) : (
            rekapPengajuanDataRT.map((surat) => (
              <Collapsible
              key={surat.id}
              open={openItemsRT[surat.id] || false}
              onOpenChange={(isOpen) => 
                setOpenItemsRT((prev) => ({ ...prev, [surat.id]: isOpen }))
              }
            >
              <Card className="mt-6 shadow-md sticky top-0 z-10">
                <div className='absolute -top-[25px] w-full h-6 bg-white' />
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    {/* Surat Info */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div className="flex flex-col h-full justify-between">
                        <p className="font-bold flex items-center h-1/2 mb-1">Tanggal Pengajuan</p>
                        <p className="text-sm flex h-1/2 text-black">
                          {format(new Date(surat.created_at), "EEEE, dd MMMM yyyy", { locale: idLocale })}
                        </p>
                      </div>
                      <div className="flex flex-col h-full justify-between">
                        <p className="font-bold flex items-center h-1/2 mb-1">Nama Warga</p>
                        <p className="text-sm flex h-1/2 text-black">{surat.warga.nama}</p>
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
                        <p className="text-sm flex h-1/2 text-black">{surat.rt.nama_rt}, {surat.rw.nama_rw}</p>
                      </div>
                      <div className="flex flex-col h-full justify-between">
                        <p className="font-bold flex items-center h-1/2 mb-1">Keperluan</p>
                        <p className="text-sm flex h-1/2 text-black">{surat.jenis_surat}</p>
                      </div>
                      <div className="flex flex-col h-full justify-between">
                        <p className="font-bold flex items-center h-1/2 mb-1">NIK</p>
                        <p className="text-sm flex h-1/2 text-black">{surat.warga.nik}</p>
                      </div>
                    </div>

                      <CollapsibleTrigger asChild>
                        <Button variant="outline" className="rounded-full">
                          {openItemsRT[surat.id] ? "Sembunyikan" : "Detail Surat"}
                        </Button>
                      </CollapsibleTrigger>
                  </div>
                  </CardContent>
                  </Card>

                  <CollapsibleContent className='mb-7 mx-2 rounded-b-lg px-8 md:px-16 bg-[#d9d9d926] p-5 shadow-inner'>
                    <div className="mt-6 space-y-4 md:text-base text-sm">
                      <p className="text-gray-600">
                        Yang bertanda tangan di bawah ini Ketua {surat.rt.nama_rt} {surat.rw.nama_rw} {surat.alamat},
                        memberikan keterangan kepada:
                      </p>
                      <div className="text-gray-800 space-y-2">
                        <p className="flex">
                          <span className="font-semibold w-32 md:w-60">Nama</span>
                          <span className="w-5">:</span>
                          <span className="flex-1">{surat.detail_pemohon.nama_pemohon}</span>
                        </p>
                        <p className="flex">
                          <span className="font-semibold w-32 md:w-60">NIK</span>
                          <span className="w-5">:</span>
                          <span className="flex-1">{surat.detail_pemohon.nik_pemohon}</span>
                        </p>
                        <p className="flex">
                          <span className="font-semibold w-32 md:w-60">NO.KK</span>
                          <span className="w-5">:</span>
                          <span className="flex-1">{surat.detail_pemohon.no_kk_pemohon}</span>
                        </p>
                        <p className="flex">
                          <span className="font-semibold w-32 md:w-60">Jenis Kelamin</span>
                          <span className="w-5">:</span>
                          <span className="flex-1">{surat.detail_pemohon.jenis_kelamin_pemohon}</span>
                        </p>
                        <p className="flex">
                          <span className="font-semibold w-32 md:w-60">Agama</span>
                          <span className="w-5">:</span>
                          <span className="flex-1">{surat.detail_pemohon.agama_pemohon}</span>
                        </p>
                        <p className="flex">
                          <span className="font-semibold w-32 md:w-60">Tempat, tanggal lahir</span>
                          <span className="w-5">:</span>
                          <span className="flex-1">{surat.detail_pemohon.tempat_tanggal_lahir_pemohon}</span>
                        </p>
                        <p className="flex">
                          <span className="font-semibold w-32 md:w-60">Alamat</span>
                          <span className="w-5">:</span>
                          <span className="flex-1">{surat.detail_pemohon.alamat_pemohon}</span>
                        </p>
                      </div>

                      <div className="mt-4">
                        <p className="mb-2 text-gray-600">Benar bahwa yang bersangkutan adalah warga {surat.penanggung_jawab_rt} {surat.penanggung_jawab_rw} yang beralamat di{" "}
                        {surat.alamat_warga}, dan bermaksud untuk mengurus surat:</p>
                        <div className="mt-4 ml-6 space-y-2">
                          {[
                              "Pengantar KTP", "Pengantar KK", "Pengantar Akta Kelahiran",
                              "Surat Keterangan Kematian", "Surat Domisili Tempat tinggal", "Surat Domisili Usaha",
                              "Surat Keterangan Tidak Mampu", "Surat SKCK", "Surat Ketenagakerjaan",
                              "Surat Pengantar Nikah", "Surat Keterangan Pindah", "lainnya:",
                          ].map((jenis, index) => (
                              <label className="flex items-center" key={index}>
                                  <TextInput
                                      color="blue"
                                      type="radio"
                                      name={`jenis_surat_rt_rekap_${surat.id}`}
                                      value={jenis}
                                      className="form-radio text-blue"
                                      checked={surat.jenis_surat === jenis} 
                                      readOnly
                                  />
                                  <span className="ml-2">{jenis}</span>
                              </label>
                          ))}
                        <p className='ml-8'>{surat.deskripsi}</p>
                      </div>
                      </div>
                    </div>

                      <div className="flex gap-2 justify-end items-center w-full mt-4">
                      {surat.approval_surat.status_approval === 'Ditolak_RT' ? (
                        <PrimaryButton color={'red'} rounded='full'>
                            Tidak Disetujui RT <X className="w-4 h-4 ml-2" />
                          </PrimaryButton>
                          ) : surat.approval_surat.status_approval === 'Disetujui_RT' || surat.approval_surat.status_approval === 'Disetujui_RW' || surat.approval_surat.status_approval === 'Ditolak_RW' ? (
                            <PrimaryButton color={'green'} rounded='full'>
                            Di Setujui RT <Check className="w-4 h-4 ml-2" />
                          </PrimaryButton>
                          ) : null
                        }
                      {surat.approval_surat.status_approval === 'Ditolak_RW' ? (
                        <PrimaryButton color={'red'} rounded='full'>
                            Tidak Disetujui RW <X className="w-4 h-4 ml-2" />
                          </PrimaryButton>
                          ) : surat.approval_surat.status_approval === 'Disetujui_RW' ? (
                            <PrimaryButton color={'green'} rounded='full'>
                            Di Setujui RW <Check className="w-4 h-4 ml-2" />
                          </PrimaryButton>
                          ) : surat.approval_surat?.status_approval === "Selesai" ? (
                            <div className="flex gap-2 justify-end items-center w-full mt-4">
                              <PrimaryButton 
                                color="green"
                                rounded='full'
                                onClick={() => previewSurat(surat.id)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                              </PrimaryButton>
                              <PrimaryButton 
                                color="blue"
                                rounded='full'
                                onClick={() => downloadSurat(surat.id)}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </PrimaryButton>
                            </div>
                          ) : null
                        }
                      </div>
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

export default RekapPengajuan