import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { Check, X, ShieldCheck, Clock } from 'lucide-react'
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
import { fetchRekapPengajuanData } from '@/hooks/admin'

const RekapPengajuan = ({ select }) => {
  const [openItems, setOpenItems] = useState(select ? { [select]: true } : {})
  const [rekapSurat, setRekapSurat] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await fetchRekapPengajuanData(setRekapSurat)
      setIsLoading(false)
    }
    loadData()
  }, [])

  return (
    <div className="w-full space-y-4 mb-8">
    <Card>
      <CardHeader>
        <CardTitle>Rekapitulasi Pengajuan</CardTitle>
      </CardHeader>
      <CardContent className="mt-2 space-y-4">
        {isLoading ? (
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
                      <Skeleton className="h-10 w-32 rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
        ) : !rekapSurat || !rekapSurat.data || rekapSurat.data.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-orange-500" />
              </div>               
              <div className='flex flex-col h-full justify-between'>
                <p className="font-medium flex items-center h-1/2">Tidak ada pengajuan surat</p>
                <p className="text-sm flex h-1/2 text-orange-600">Belum ada data rekapitulasi pengajuan.</p>
              </div>
            </div>
            </CardContent>
          </Card>
        ) : (
          rekapSurat.data.map((surat) => {
            const isItemOpen = openItems[surat.id] || false
            let rtStatus = 'pending'
            if (surat.approval?.status_rt === 'Disetujui' || surat.status === 'Diproses_RW' || surat.status === 'Selesai' || surat.status === 'Disetujui' || surat.status === 'Ditolak_RW') {
              rtStatus = 'approved'
            } else if (surat.approval?.status_rt === 'Ditolak' || surat.status === 'Ditolak_RT') {
              rtStatus = 'rejected'
            } else if (surat.status === 'Diajukan' || surat.status === 'Diproses_RT' || surat.approval?.status_rt === 'Diproses') {
              rtStatus = 'pending'
            }

            let rwStatus = 'pending'
            if (rtStatus === 'approved') {
                if (surat.approval?.status_rw === 'Disetujui' || surat.status === 'Selesai' || surat.status === 'Disetujui') {
                    rwStatus = 'approved'
                } else if (surat.approval?.status_rw === 'Ditolak' || surat.status === 'Ditolak_RW') {
                    rwStatus = 'rejected'
                } else if (surat.status === 'Diproses_RW' || surat.approval?.status_rw === 'Diproses') {
                    rwStatus = 'pending'
                }
            } else if (rtStatus === 'rejected') {
                rwStatus = 'disabled'
            }

            return (
            <Collapsible
              key={surat.id}
              open={isItemOpen}
              onOpenChange={(isOpen) => 
                setOpenItems((prev) => ({ ...prev, [surat.id]: isOpen }))
              }
            >
              <Card className="mt-6 shadow-md sticky top-0 z-10">
                <div className='absolute -top-[25px] w-full h-6 bg-white' />
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 text-sm">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div className="flex flex-col h-full justify-between">
                        <p className="font-bold flex items-center h-1/2 mb-1">Tanggal Pengajuan</p>
                        <p className="text-sm flex h-1/2 text-black">
                          {surat.created_at ? format(new Date(surat.created_at), "EEEE, dd MMMM yyyy", { locale: idLocale }) : '-'}
                        </p>
                      </div>
                      <div className="flex flex-col h-full justify-between">
                        <p className="font-bold flex items-center h-1/2 mb-1">Nama Warga</p>
                        <p className="text-sm flex h-1/2 text-black">{surat.warga?.nama || 'N/A'}</p>
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
                        <p className="text-sm flex h-1/2 text-black">
                          {surat.warga?.rt ? `${surat.warga.rt.nama_rt}` : 'RT -'}, {surat.warga?.rt?.rw ? `${surat.warga.rt.rw.nama_rw}` : 'RW -'}
                        </p>
                      </div>
                      <div className="flex flex-col h-full justify-between">
                        <p className="font-bold flex items-center h-1/2 mb-1">Keperluan</p>
                        <p className="text-sm flex h-1/2 text-black">{surat.jenis_surat || 'N/A'}</p>
                      </div>
                      <div className="flex flex-col h-full justify-between">
                        <p className="font-bold flex items-center h-1/2 mb-1">NIK</p>
                        <p className="text-sm flex h-1/2 text-black">{surat.warga?.nik || '-'}</p>
                      </div>
                    </div>

                    <CollapsibleTrigger asChild>
                      <Button variant="outline" className="rounded-full">
                        {isItemOpen ? "Sembunyikan" : "Detail Surat"}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </CardContent>
              </Card>

              <CollapsibleContent className='mb-7 mx-2 rounded-b-lg px-8 md:px-16 bg-[#d9d9d926] p-5 shadow-inner'>
                <div className="mt-6 space-y-4 text-sm">
                  <p className="text-gray-600">
                    Yang bertanda tangan di bawah ini Ketua RT {surat.approval?.pejabat_rt?.warga?.nama || 'undefined'} RW {surat.approval?.pejabat_rw?.warga?.nama || 'undefined'} {surat.warga?.alamat_ktp || surat.warga?.alamat?.nama_jalan || 'Alamat undefined'},
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
                        <span className="flex-1">
                          {surat.detail_pemohon?.tempat_tanggal_lahir_pemohon ? `${surat.detail_pemohon?.tempat_tanggal_lahir_pemohon}` : 'N/A'}
                        </span>
                      </p>
                      <p className="flex">
                        <span className="font-semibold w-32 md:w-60">Alamat</span>
                        <span className="w-5">:</span>
                        <span className="flex-1">{surat.detail_pemohon?.alamat_pemohon || 'N/A'}</span>
                      </p>
                  </div>

                  <div className="mt-4">
                    <p className="mb-2 text-gray-600">Benar bahwa yang bersangkutan adalah warga RT {surat.approval?.pejabat_rt?.warga?.nama || 'undefined'} RW {surat.approval?.pejabat_rw?.warga?.nama || 'undefined'} yang beralamat di{" "}
                    {surat.detail_pemohon?.alamat_pemohon || 'Alamat undefined'}, dan bermaksud untuk mengurus surat:</p>
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
                                  name={`jenis_surat_admin_rekap_${surat.id}`}
                                  value={jenis}
                                  className="form-radio text-blue"
                                  checked={surat.jenis_surat === jenis} 
                                  readOnly
                              />
                              <span className="ml-2">{jenis}</span>
                          </label>
                      ))}
                      <p className='ml-8'>{surat.keterangan || surat.deskripsi || 'Tidak ada deskripsi tambahan.'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end items-center w-full mt-4">
                  {rtStatus === 'rejected' ? (
                    <PrimaryButton color={'red'} rounded='full'>
                        Tidak Disetujui RT <X className="w-4 h-4 ml-2" />
                      </PrimaryButton>
                      ) : rtStatus === 'approved' ? (
                        <PrimaryButton color={'green'} rounded='full'>
                        Di Setujui RT <Check className="w-4 h-4 ml-2" />
                      </PrimaryButton>
                      ) : (
                        <PrimaryButton color={'yellow'} rounded='full'>
                        Menunggu RT <Clock className="w-4 h-4 ml-2" />
                      </PrimaryButton>
                      )}
                  
                  {rwStatus === 'rejected' ? (
                    <PrimaryButton color={'red'} rounded='full'>
                        Tidak Disetujui RW <X className="w-4 h-4 ml-2" />
                      </PrimaryButton>
                      ) : rwStatus === 'approved' ? (
                        <PrimaryButton color={'green'} rounded='full'>
                        Di Setujui RW <Check className="w-4 h-4 ml-2" />
                      </PrimaryButton>
                      ) : rwStatus === 'pending' && rtStatus === 'approved' ? (
                        <PrimaryButton color={'yellow'} rounded='full'>
                        Menunggu RW <Clock className="w-4 h-4 ml-2" />
                      </PrimaryButton>
                      ) : null }
                </div>
              </CollapsibleContent>
            </Collapsible>
          )})
        )}
      </CardContent>
    </Card>
  </div>
  )
}

export default RekapPengajuan