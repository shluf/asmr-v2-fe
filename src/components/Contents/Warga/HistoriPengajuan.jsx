'use client'

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import idLocale from "date-fns/locale/id";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Cog, Download, ShieldCheck, X, HelpCircle } from "lucide-react";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { fetchHistoryPengajuan } from "@/hooks/warga";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "@/lib/axios";
import { useAuthTokenClient } from "@/lib/jwt";

const getStatusIcon = (status) => {
  switch (status) {
    case "approved":
      return <Check className="h-6 w-6 text-white" />;
    case "in-progress":
      return <Cog className="h-6 w-6 text-white" />;
    case "rejected":
      return <X className="h-6 w-6 text-white" />;
    default:
      return <HelpCircle className="h-6 w-6 text-white" />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "approved":
      return "bg-green-500";
    case "in-progress":
      return "bg-yellow-500";
    case "rejected":
      return "bg-red-500";
    default:
      return "bg-gray-400";
  }
};

const HistoriPengajuan = () => {
  const [dataPengajuan, setDataPengajuan] = useState([]);
  const [openItems, setOpenItems] = useState({});
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const {payload} = useAuthTokenClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchHistoryPengajuan(payload.id_warga);
        if (result.success) {
          setDataPengajuan(result.data);
        } else {
          console.error('Error fetching history:', result.message);
        }
      } catch (error) {
        console.error('Error in history fetch:', error);
      } finally {
        setIsHistoryLoading(false);
      }
    };

    if (payload) {
      fetchData();
    }
  }, []);

  const handleDownloadSurat = async (id) => {
    try {
      setIsDownloadLoading(true);
      const response = await axios.get(`/api/download-surat/${id}`, {
        responseType: 'blob'
      });
      
      // Buat objek URL untuk blob
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Buat link untuk download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `surat-pengajuan-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Bersihkan
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading document:', error);
    } finally {
      setIsDownloadLoading(false);
    }
  }

  return (
    <div className="w-full mb-4">
      <Card>
        <CardContent className="space-y-4 p-6">
          {isHistoryLoading ? (
            [...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-4 w-[100px]" />
                          <Skeleton className="h-4 w-[120px]" />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <Skeleton className="w-32 h-10 rounded-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : !dataPengajuan.length > 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-green" />
                </div>               
                <div className='flex flex-col h-full justify-between'>
                  <p className="font-medium flex items-center h-1/2">Tidak ada surat yang diajukan</p>
                  <p className="text-sm flex h-1/2 text-green">Anda belum mengajukan surat</p>
                </div>
              </div>
              </CardContent>
            </Card>
          ) : (
            dataPengajuan.map((submission, index) => (
              <Collapsible
                key={index}
                open={openItems[index] || false}
                onOpenChange={(isOpen) =>
                  setOpenItems((prev) => ({ ...prev, [index]: isOpen }))
                }
              >
                <Card className="shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <ShieldCheck className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <p className="font-medium mb-1">Tanggal Pengajuan</p>
                          <p className="text-sm text-blue-600">
                            {submission?.created_at
                              ? format(new Date(submission.created_at), "EEEE, dd MMMM yyyy", {
                                  locale: idLocale,
                                })
                              : "Tanggal tidak tersedia"}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Keperluan</p>
                          <p className="text-sm text-blue-600">{submission?.jenis_surat || "Keperluan tidak tersedia"}</p>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Status Tindak Lanjut</p>
                          <p className="text-sm text-blue-600">{submission?.status.replace(/_/g, ' ') || "Status tidak tersedia"}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {submission?.progress?.some(
                          (step) => step.title === "Penerbitan Surat" && step.status === "approved"
                        ) && (
                          <Button disable={`${isDownloadLoading}`} variant="outline" className="rounded-full" onClick={() => handleDownloadSurat(submission.id_pengajuan_surat)}>
                            <Download className="w-4 h-4 mr-2" /> Unduh
                          </Button>
                        )}
                        <CollapsibleTrigger asChild>
                          <Button variant="outline" className="rounded-full">
                            {openItems[index] ? "Sembunyikan" : "Lihat Selengkapnya"}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>
                    </CardContent>
                    </Card>

                    <CollapsibleContent className="mx-2 py-6 rounded-b-lg px-8 md:px-16 bg-[#d9d9d926] shadow-inner">
                      <div className="relative space-y-4">
                        <span className="absolute top-4 left-[18.5px] bottom-4 bg-slate-300 w-[3px] z-10"></span>
                        {submission?.progress?.map((step, stepIndex) =>
                          step.status !== "pending" ? (
                            <div key={stepIndex} className="flex items-center gap-4">
                              <div
                                className={`w-10 h-10 rounded-full z-20 flex items-center justify-center ${getStatusColor(
                                  step.status
                                )}`}
                              >
                                {getStatusIcon(step.status)}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{step.title}</h4>
                                <p className="text-sm text-gray-500">{step.description}</p>
                                {step.tgl_approval
                              &&
                              <p className="text-xs text-gray-500 mt-1 px-2 border-l-2">
                                  {format(new Date(step.tgl_approval), "dd MMMM yyyy  HH:II", {
                                    locale: idLocale,
                                  })} WIB
                                </p>
                                }
                              </div>
                            </div>
                          ) : null
                        )}
                      </div>
                    </CollapsibleContent>

              </Collapsible>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoriPengajuan;
