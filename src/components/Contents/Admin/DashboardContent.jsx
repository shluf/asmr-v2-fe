'use client';

import React, { useState, useEffect } from "react";
import { UserFilled } from "@/utility/svg-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DataCard from "@/components/partials/DataCard";
import { ShieldCheck, ChevronRight } from 'lucide-react';
import { fetchRtRwStats, fetchWargaPendingData, fetchWargaStats } from "@/hooks/admin";
import Link from "next/link";
import { 
  BarChart, 
  Bar as RechartsBar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  PieChart,
  Pie as RechartsPie,
  Cell
} from 'recharts';

const DashboardContent = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [dataWarga, setDataWarga] = useState([]);
    const [activeMonth, setActiveMonth] = useState("Jan");

    const [wargaStats, setWargaStats] = useState([
        { label: "Populasi Warga", value: "···" },
        { label: "Total Pengajuan Surat", value: "···" },
        { label: "Total Pengajuan Dalam Proses", value: "···" },
        { label: "Total Pengajuan Selesai", value: "···" },
    ]);

    const [RtRwStats, setRtRwStats] = useState([
        { label: "Populasi Staff (Pejabat)", value: "···" },
        { label: "Total Pengajuan Surat", value: "···" },
        { label: "Total Pengajuan Dalam Proses", value: "···" },
        { label: "Total Pengajuan Selesai", value: "···" },
    ]);

    useEffect(() => {
        fetchWargaPendingData(setDataWarga, setIsLoading);
        fetchWargaStats(setWargaStats);
        fetchRtRwStats(setRtRwStats);
    }, []);

    // Bar chart data
    const barChartData = [
        { name: "Nov", diterima: 80, ditolak: 70 },
        { name: "Dec", diterima: 60, ditolak: 55 },
        { name: "Jan", diterima: 35, ditolak: 30 },
        { name: "Feb", diterima: 80, ditolak: 70 },
        { name: "Mar", diterima: 55, ditolak: 50 },
        { name: "Apr", diterima: 65, ditolak: 60 },
    ];
  
    // Pie chart data
    const pieChartData = [
        { name: 'Pengantar KTP/KK', value: 30 },
        { name: 'Surat Pengantar nikah', value: 20 },
        { name: 'Surat Domisili Tempat Tinggal', value: 15 },
        { name: 'Surat Domisili Usaha', value: 10 },
        { name: 'Pengantar Akta Kelahiran', value: 25 },
    ];
    
    const COLORS = ['#2979FF', '#00D1FF', '#00E5FF', '#00FFA3', '#EEEEEE'];
    
    // Legend data for pie chart
    const legendData = [
        { name: 'Pengantar KTP/KK', color: '#2979FF' },
        { name: 'Surat Pengantar nikah', color: '#00D1FF' },
        { name: 'Surat Domisili Tempat Tinggal', color: '#00E5FF' },
        { name: 'Surat Domisili Usaha', color: '#00FFA3' },
        { name: 'Pengantar Akta Kelahiran', color: '#EEEEEE' },
        { name: 'Surat Keterangan Kematian', color: '#FFC107' },
        { name: 'Surat Keterangan Tidak Mampu', color: '#EEEEEE' },
        { name: 'Surat SKCK', color: '#673AB7' },
        { name: 'Surat Keterangan Pindah', color: '#212121' },
        { name: 'Surat Ketenagakerjaan', color: '#E91E63' },
        { name: 'Lainnya', color: '#212121' },
    ];

    return (
        <div className="flex flex-col w-full mb-10">
            {/* <div className="flex w-full h-full">
                <div className="container mx-auto p-6">
                    <DataCard 
                        wargaStats={wargaStats} 
                        RtRwStats={RtRwStats}
                    />
                </div>
            </div> */}

            {/* Charts Section */}
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Bar Chart */}
                    <Card className="shadow-sm">
                        <CardContent className="p-6">
                            <h3 className="text-xl font-bold mb-4">Banyaknya aduan tahun 2025</h3>
                            <div className="flex space-x-2 mb-4">
                                {["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"].map((month) => (
                                    <Button
                                        key={month}
                                        variant={activeMonth === month ? "default" : "outline"}
                                        className="px-3 py-1 h-auto text-sm rounded-md"
                                        onClick={() => setActiveMonth(month)}
                                    >
                                        {month}
                                    </Button>
                                ))}
                            </div>
                            <div className="h-64 bg-gray-100 rounded-md">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={barChartData}
                                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" />
                                        <YAxis hide />
                                        <RechartsBar 
                                            dataKey="diterima" 
                                            fill="#4AFA4A" 
                                            barSize={20}
                                            radius={[4, 4, 0, 0]}
                                        />
                                        <RechartsBar 
                                            dataKey="ditolak" 
                                            fill="#FF3B30" 
                                            barSize={20}
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex items-center mt-4 text-sm">
                                <div className="flex items-center mr-4">
                                    <div className="w-3 h-3 bg-[#4AFA4A] mr-2"></div>
                                    <span>Diterima</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-[#FF3B30] mr-2"></div>
                                    <span>Ditolak</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    {/* Pie Chart */}
                    <Card className="shadow-sm">
                        <CardContent className="p-6">
                            <div className="text-sm text-gray-500">Januari, 2025</div>
                            <h3 className="text-xl font-bold mb-4">Presentase aduan warga desa sarimi</h3>
                            <div className="h-64 flex justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <RechartsPie
                                            data={pieChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={0}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={false}
                                        >
                                            {pieChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </RechartsPie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            
                            <div className="mt-4">
                                <h3 className="font-bold text-lg mb-2">List aduan</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    {legendData.map((item, index) => (
                                        <div key={index} className="flex items-center">
                                            <div className="w-4 h-4 mr-2" style={{ backgroundColor: item.color }}></div>
                                            <span>{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="container mx-auto p-6 md:mb-0 mb-8">
                <div className="p-4 bg-white">
                    <h2 className="text-2xl font-bold mb-4">
                        Approval akun warga
                    </h2>
                    <div className="space-y-4">
                        {isLoading ? (
                            <>
                                {[...Array(2)].map((_, index) => (
                                    <Card key={index}>
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                                    {[...Array(5)].map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className="flex flex-col h-full justify-between"
                                                        >
                                                            <Skeleton className="h-4 w-24 mb-2" />
                                                            <Skeleton className="h-4 w-32" />
                                                        </div>
                                                    ))}
                                                </div>
                                                <Skeleton className="h-10 w-52 rounded-full" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </>
                        ) : !dataWarga.length > 0 ? (
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                            <ShieldCheck className="h-6 w-6 text-blue" />
                                        </div>               
                                        <div className='flex flex-col h-full justify-between'>
                                            <p className="font-medium flex items-center h-1/2">Tidak ada warga yang mendaftar</p>
                                            <p className="text-sm flex h-1/2 text-blue">Semua approval role warga telah diproses</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            dataWarga.map((warga, index) => (
                                <Card key={index} className="shadow-sm">
                                    <CardContent className="p-4">
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                            <div className="flex justify-center md:justify-start w-full md:w-auto md:mr-6">
                                                <div className="w-12 h-12 bg-green-3 rounded-[12px] flex items-center justify-center text-2xl">
                                                    <UserFilled size={6} />
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 w-full md:flex-1 gap-4">
                                                <div>
                                                    <div className="text-sm text-gray-500">Nama</div>
                                                    <div>{warga.nama}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500">NIK</div>
                                                    <div className="text-ellipsis">{warga.nik}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500">RT</div>
                                                    <div>{warga.no_rt}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500">RW</div>
                                                    <div>{warga.no_rw}</div>
                                                </div>
                                                <div className="flex-row items-center justify-center">
                                                    <div className="text-sm text-center text-gray-500">Status</div>
                                                    <div className="bg-[#FFC107] text-white px-3 py-1 rounded-full text-sm text-center">
                                                        {warga.user.status_akun === 0
                                                            ? "Pending" 
                                                            : warga.user.status_akun === 1 
                                                                ? "Approved"
                                                                : "Not Approved"}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                                                <Button variant="destructive" className="bg-[#FF3B30] hover:bg-[#FF3B30]/90 w-full sm:w-auto">
                                                    Tolak
                                                </Button>
                                                <Button className="bg-[#4CAF50] hover:bg-[#4CAF50]/90 w-full sm:w-auto">
                                                    Setujui
                                                </Button>
                                                <Link
                                                    href={`/admin/approval-role`}
                                                    className="w-full sm:w-auto flex justify-center"
                                                >
                                                    <Button variant="ghost" className="rounded-full p-2 w-full sm:w-auto">
                                                        <ChevronRight className="h-5 w-5" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;