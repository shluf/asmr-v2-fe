import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { Check, X, ShieldCheck, Clock, Eye, EyeOff } from 'lucide-react';
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
import { Skeleton } from '@/Components/ui/skeleton';
import { fetchRekapPengajuanData } from '@/hooks/admin';

const RekapPengajuan = ({ select }) => {
  const [openItems, setOpenItems] = useState(select ? { [select]: true } : {});
  const [rekapSurat, setRekapSurat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchRekapPengajuanData(setRekapSurat);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const getApprovalDisplay = (status) => {
    switch (status) {
      case 'Disetujui_RT':
      case 'Disetujui_RW':
      case 'Disetujui':
      case 'Selesai':
        return { text: 'Disetujui', Icon: Check, color: 'green' };
      case 'Ditolak_RT':
      case 'Ditolak_RW':
      case 'Ditolak':
        return { text: 'Ditolak', Icon: X, color: 'red' };
      case 'Diproses_RT':
        return { text: 'Menunggu Persetujuan RT', Icon: Clock, color: 'yellow' };
      case 'Diproses_RW':
        return { text: 'Menunggu Persetujuan RW', Icon: Clock, color: 'yellow' };
      case 'Diajukan':
      default:
        return { text: 'Menunggu Proses', Icon: Clock, color: 'gray' };
    }
  };

  return (
    <div className="w-full space-y-4 mb-8">
    <Card>
      <CardHeader>
        <CardTitle>Rekapitulasi Pengajuan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-blue-500" />
              </div>               
              <div className='flex flex-col h-full justify-between'>
                <p className="font-medium flex items-center h-1/2">Tidak ada data pengajuan</p>
                <p className="text-sm flex h-1/2 text-blue-500">Saat ini tidak ada data pengajuan surat yang tercatat.</p>
              </div>
            </div>
            </CardContent>
          </Card>
        ) : (
          rekapSurat.data.map((surat) => {
            const approvalDisplay = getApprovalDisplay(surat.status);
            const isItemOpen = openItems[surat.id];

            return (
            <Collapsible
              key={surat.id}
              open={isItemOpen}
              onOpenChange={(isOpen) => 
                setOpenItems((prev) => ({ ...prev, [surat.id]: isOpen }))
              }
            >
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 text-sm">
                      <div className="flex flex-col">
                        <p className="font-semibold text-gray-600 mb-1">Tgl. Pengajuan</p>
                        <p className="text-gray-800">
                          {surat.created_at ? format(new Date(surat.created_at), "dd MMM yyyy, HH:mm", { locale: idLocale }) : '-'}
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <p className="font-semibold text-gray-600 mb-1">Pemohon</p>
                        <p className="text-gray-800 truncate">{surat.warga?.nama || 'N/A'}</p>
                      </div>
                      <div className="flex flex-col">
                        <p className="font-semibold text-gray-600 mb-1">Jenis Surat</p>
                        <p className="text-gray-800 truncate">{surat.jenis_surat || 'N/A'}</p>
                      </div>
                      <div className="flex flex-col">
                        <p className="font-semibold text-gray-600 mb-1">Status</p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full text-${approvalDisplay.color}-700 bg-${approvalDisplay.color}-100`}>
                          {approvalDisplay.text}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <p className="font-semibold text-gray-600 mb-1">Penanggung Jawab</p>
                        <p className="text-gray-800 truncate">
                          RT: {surat.approval?.pejabat_rt?.warga?.nama || '-'}<br/>
                          RW: {surat.approval?.pejabat_rw?.warga?.nama || '-'}
                        </p>
                      </div>
                    </div>

                    <CollapsibleTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full flex-shrink-0">
                        {isItemOpen ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{isItemOpen ? "Sembunyikan Detail" : "Lihat Detail"}</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </CardContent>
              </Card>

              <CollapsibleContent className='mx-1 md:mx-2 rounded-b-lg px-4 md:px-6 py-4 bg-slate-50 shadow-inner'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Detail Pemohon:</h4>
                    <p><span className="font-medium w-32 inline-block">Nama</span>: {surat.warga?.nama || 'N/A'}</p>
                    <p><span className="font-medium w-32 inline-block">NIK</span>: {surat.warga?.nik || 'N/A'}</p>
                    <p><span className="font-medium w-32 inline-block">No. KK</span>: {surat.warga?.no_kk || 'N/A'}</p>
                    <p><span className="font-medium w-32 inline-block">Jenis Kelamin</span>: {surat.warga?.jenis_kelamin === 'L' ? 'Laki-laki' : surat.warga?.jenis_kelamin === 'P' ? 'Perempuan' : 'N/A'}</p>
                    <p><span className="font-medium w-32 inline-block">Agama</span>: {surat.warga?.agama || 'N/A'}</p>
                    <p><span className="font-medium w-32 inline-block">Tempat, Tgl Lahir</span>: {surat.warga?.tempat_lahir}, {surat.warga?.tanggal_lahir ? format(new Date(surat.warga.tanggal_lahir), "dd MMM yyyy", { locale: idLocale }) : 'N/A'}</p>
                    <p><span className="font-medium w-32 inline-block">Alamat KTP</span>: {surat.warga?.alamat_ktp || surat.warga?.alamat?.nama_jalan || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Detail Pengajuan:</h4>
                    <p><span className="font-medium w-32 inline-block">Jenis Surat</span>: {surat.jenis_surat || 'N/A'}</p>
                    <p><span className="font-medium w-32 inline-block">Keperluan (Deskripsi)</span>: {surat.keterangan || surat.deskripsi || '-'}</p>
                    <p><span className="font-medium w-32 inline-block">Status RT</span>: {surat.approval?.status_rt || surat.status_rt_display || '-'}</p>
                    <p><span className="font-medium w-32 inline-block">Catatan RT</span>: {surat.approval?.catatan_rt || '-'}</p>
                    <p><span className="font-medium w-32 inline-block">Status RW</span>: {surat.approval?.status_rw || surat.status_rw_display || '-'}</p>
                    <p><span className="font-medium w-32 inline-block">Catatan RW</span>: {surat.approval?.catatan_rw || '-'}</p>
                    <p><span className="font-medium w-32 inline-block">File Surat (jika ada)</span>: {surat.file_surat ? <a href={surat.file_surat} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Download/Lihat</a> : '-'}</p>
                  </div>
                </div>

                <div className="flex gap-2 justify-end items-center mt-6 pt-4 border-t">
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