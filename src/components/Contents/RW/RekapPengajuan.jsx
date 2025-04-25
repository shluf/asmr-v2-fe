import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { Check, X, ShieldCheck, Clock } from 'lucide-react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import PrimaryButton from '@/components/Atoms/PrimaryButton';
import { Skeleton } from '@/components/ui/skeleton';
import TextInput from '@/components/Atoms/TextInput';

const RekapPengajuan = ({ idRW, select }) => {
  const [openItems, setOpenItems] = useState( select ? ({[select]: isOpen}) : {} );
  const [pendingSurat, setPendingSurat] = useState([]);

  useEffect(() => {
    fetchRekapRWData(setPendingSurat, idRW);
  }, []);

  return (
    <div className="w-full space-y-4 mb-4">
    <Card>
      <CardHeader>
        <CardTitle>Rekapitulasi Pengajuan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!pendingSurat.data ? (
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
        ) : !pendingSurat.data.length > 0 ? (
          <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-orange" />
            </div>               
            <div className='flex flex-col h-full justify-between'>
              <p className="font-medium flex items-center h-1/2">Tidak ada surat pending</p>
              <p className="text-sm flex h-1/2 text-orange">Semua pengajuan surat telah diproses</p>
            </div>
          </div>
          </CardContent>
        </Card>
        ) : (
          pendingSurat.data.map((surat, index) => (
            <Collapsible
            key={surat.id_pengajuan_surat}
            open={openItems[surat.id_pengajuan_surat]}
            onOpenChange={(isOpen) => 
              setOpenItems({ ...openItems, [surat.id_pengajuan_surat]: isOpen })
            }
          >
            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">

                  {/* Surat Info */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="flex flex-col h-full justify-between">
                      <p className="font-medium flex items-center h-1/2 mb-1">Tanggal Pengajuan</p>
                      <p className="text-sm flex h-1/2 text-blue-600">
                        {format(new Date(surat.created_at), "EEEE, dd MMMM yyyy", { locale: idLocale })}
                      </p>
                    </div>
                    <div className="flex flex-col h-full justify-between">
                      <p className="font-medium flex items-center h-1/2 mb-1">Nama Warga</p>
                      <p className="text-sm flex h-1/2 text-blue-600">{surat.nama_warga}</p>
                    </div>
                    <div className="flex flex-col h-full justify-between">
                      <p className="font-medium flex items-center h-1/2 mb-1">Status Tindak Lanjut</p>
                      <p className="text-sm flex h-1/2 text-blue-600">{surat.status_approval}</p>
                    </div>
                    <div className="flex flex-col h-full justify-between">
                      <p className="font-medium flex items-center h-1/2 mb-1">Penanggung Jawab</p>
                      <p className="text-sm flex h-1/2 text-blue-600">{surat.penanggung_jawab_rt}, {surat.penanggung_jawab_rw}</p>
                    </div>
                    <div className="flex flex-col h-full justify-between">
                      <p className="font-medium flex items-center h-1/2 mb-1">Keperluan</p>
                      <p className="text-sm flex h-1/2 text-blue-600">{surat.jenis_surat}</p>
                    </div>
                    <div className="flex flex-col h-full justify-between">
                      <p className="font-medium flex items-center h-1/2 mb-1">NIK</p>
                      <p className="text-sm flex h-1/2 text-blue-600">{surat.nik_warga}</p>
                    </div>
                  </div>


                    <CollapsibleTrigger asChild>
                      <Button variant="outline" className="rounded-full">
                        {openItems[surat.id_pengajuan_surat] ? "Sembunyikan" : "Detail Surat"}
                      </Button>
                    </CollapsibleTrigger>
                </div>
                </CardContent>
                </Card>

                <CollapsibleContent className='mx-2 rounded-b-lg px-8 md:px-16 bg-[#d9d9d926] p-5 shadow-inner'>
                  <div className="mt-6 space-y-4 md:text-base text-sm">
                    <p className="text-gray-600">
                      Yang bertanda tangan di bawah ini Ketua {surat.penanggung_jawab_rt} {surat.penanggung_jawab_rw} {surat.alamat},
                      memberikan keterangan kepada:
                    </p>
                    <div className="text-gray-800 space-y-2">
                      <p className="flex">
                        <span className="font-semibold w-32 md:w-60">Nama</span>
                        <span className="w-5">:</span>
                        <span className="flex-1">{surat.nama_pemohon}</span>
                      </p>
                      <p className="flex">
                        <span className="font-semibold w-32 md:w-60">NIK</span>
                        <span className="w-5">:</span>
                        <span className="flex-1">{surat.nik_pemohon}</span>
                      </p>
                      <p className="flex">
                        <span className="font-semibold w-32 md:w-60">NO.KK</span>
                        <span className="w-5">:</span>
                        <span className="flex-1">{surat.no_kk_warga}</span>
                      </p>
                      <p className="flex">
                        <span className="font-semibold w-32 md:w-60">Jenis Kelamin</span>
                        <span className="w-5">:</span>
                        <span className="flex-1">{surat.jenis_kelamin_pemohon === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                      </p>
                      <p className="flex">
                        <span className="font-semibold w-32 md:w-60">Agama</span>
                        <span className="w-5">:</span>
                        <span className="flex-1">{surat.agama_pemohon}</span>
                      </p>
                      <p className="flex">
                        <span className="font-semibold w-32 md:w-60">Tempat, tanggal lahir</span>
                        <span className="w-5">:</span>
                        <span className="flex-1">{surat.tempat_tanggal_lahir_pemohon}</span>
                      </p>
                      <p className="flex">
                        <span className="font-semibold w-32 md:w-60">Alamat</span>
                        <span className="w-5">:</span>
                        <span className="flex-1">{surat.alamat_pemohon}</span>
                      </p>
                    </div>

                    <div className="mt-4">
                      <p className="mb-2text-gray-600">Benar bahwa yang bersangkutan adalah warga {surat.penanggung_jawab_rt} {surat.penanggung_jawab_rw} yang beralamat di{" "}
                      {surat.alamat_warga}, dan bermaksud untuk mengurus surat:</p>
                      <div className="mt-4 ml-6 space-y-2">
                        {[
                            "Pengantar KTP",
                            "Pengantar KK",
                            "Pengantar Akta Kelahiran",
                            "Surat Keterangan Kematian",
                            "Surat Domisili Tempat tinggal",
                            "Surat Domisili Usaha",
                            "Surat Keterangan Tidak Mampu",
                            "Surat SKCK",
                            "Surat Ketenagakerjaan",
                            "Surat Pengantar Nikah",
                            "Surat Keterangan Pindah",
                            "lainnya:",
                        ].map((jenis, index) => (
                            <label className="flex items-center" key={index}>
                                <TextInput
                                    color="blue"
                                    type="radio"
                                    name="jenis_surat"
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

                    <div className="flex gap-2 justify-end items-center w-full">
                    {surat.status_rt === 'rejected' ? (
                      <PrimaryButton
                      color={'red'}
                      rounded='full'
                      >
                          Tidak Disetujui RT
                          <X className="w-4 h-4 ml-2" />
                        </PrimaryButton>
                        ) : surat.status_rt === 'approved' ? (
                          <PrimaryButton
                          color={'green'}
                          rounded='full'
                          >
                          Di Setujui RT
                          <Check className="w-4 h-4 ml-2" />
                        </PrimaryButton>
                        ) : (
                          <PrimaryButton
                          color={'yellow'}
                          rounded='full'
                          >
                          Menunggu
                          <Clock className="w-4 h-4 ml-2" />
                        </PrimaryButton>
                        )}
                    {surat.status_rw === 'rejected' ? (
                      <PrimaryButton
                      color={'red'}
                      rounded='full'
                      >
                          Tidak Disetujui RW
                          <X className="w-4 h-4 ml-2" />
                        </PrimaryButton>
                        ) : surat.status_rw === 'approved' ? (
                          <PrimaryButton
                          color={'green'}
                          rounded='full'
                          >
                          Di Setujui RW
                          <Check className="w-4 h-4 ml-2" />
                        </PrimaryButton>
                        ) : (
                          <PrimaryButton
                          color={'yellow'}
                          rounded='full'
                          >
                          Menunggu RW
                          <Clock className="w-4 h-4 ml-2" />
                        </PrimaryButton>
                        )}
                      </div>
                  </CollapsibleContent>

            </Collapsible>
          ))
        )}
      </CardContent>
    </Card>
  </div>
  )
}

export default RekapPengajuan