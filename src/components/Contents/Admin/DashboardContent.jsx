"use client"

import { useState, useEffect } from "react"
import { UserFilled } from "@/utility/svg-icons"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShieldCheck, ChevronRight, ChevronLeft, TrendingUp, Lightbulb, TrendingDown } from "lucide-react"
import { fetchCountPengajuanJenis, fetchPengajuanBulanan, fetchWargaPendingData } from "@/hooks/admin"
import Link from "next/link"
import { Bar, BarChart, CartesianGrid, XAxis, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const DashboardContent = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [dataWarga, setDataWarga] = useState([])
  const [selectedRW, setSelectedRW] = useState("all")
  const [currentPeriod, setCurrentPeriod] = useState("first")
  const [currentYear] = useState(new Date().getFullYear())
  const [currentMonth] = useState(new Date().getMonth())
  const [pengajuanJenis, setPengajuanJenis] = useState([{ jenis_surat: "Lainnya", total: 0 }])

  const bulanIndonesia = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ]
  

  const [rawPengajuanData, setRawPengajuanData] = useState(
    [
      { bulan: "Jan", pengajuan: [] },
      { bulan: "Feb", pengajuan: [] },
      { bulan: "Mar", pengajuan: [] },
      { bulan: "Apr", pengajuan: [] },
      { bulan: "May", pengajuan: [] },
      { bulan: "Jun", pengajuan: [] },
      { bulan: "Jul", pengajuan: [] },
      { bulan: "Aug", pengajuan: [] },
      { bulan: "Sep", pengajuan: [] },
      { bulan: "Oct", pengajuan: [] },
      { bulan: "Nov", pengajuan: [] },
      { bulan: "Dec", pengajuan: [] },
    ]
  )

  const chartConfig = {
    disetujui: {
      label: "Disetujui",
      color: "#4AFA4A",
    },
    ditolak: {
      label: "Ditolak",
      color: "#FF3B30",
    },
  }

  const pieChartConfig = {
    value: {
      label: "Jumlah",
    },
    pengantar_ktp: {
      label: "Pengantar KTP",
      color: "#2979FF",
    },
    pengantar_kk: {
      label: "Pengantar KK",
      color: "#00D1FF",
    },
    pengantar_akta: {
      label: "Pengantar Akta Kelahiran",
      color: "#4CAF50",
    },
    keterangan_kematian: {
      label: "Surat Keterangan Kematian",
      color: "#FFC107",
    },
    domisili_tempat_tinggal: {
      label: "Surat Domisili Tempat tinggal",
      color: "#FFC107",
    },
    domisili_usaha: {
      label: "Surat Domisili Usaha",
      color: "#FFC107",
    },
    keterangan_tidak_mampu: {
      label: "Surat Keterangan Tidak Mampu",
      color: "#FF3B30",
    },
    skck: {
      label: "Surat SKCK",
      color: "#673AB7",
    },
    ketenagakerjaan: {
      label: "Surat Ketenagakerjaan",
      color: "#E91E63",
    },
    pengantar_nikah: {
      label: "Surat Pengantar Nikah",
      color: "#212121",
    },
    pengantar_keterangan_pindah: {
      label: "Surat Keterangan Pindah",
      color: "#E91E63",
    },
    other: {
      label: "Lainnya",
      color: "#9E9E9E",
    },
  }

  const processChartData = () => {
    if (!rawPengajuanData.length) return []

    const monthsFirst = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    const monthsSecond = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const selectedMonths = currentPeriod === "first" ? monthsFirst : monthsSecond

    return selectedMonths.map((month) => {
      const monthData = rawPengajuanData.find((item) => item.bulan === month)
      if (!monthData || !monthData.pengajuan) {
        return { month, disetujui: 0, ditolak: 0 }
      }

      let filteredPengajuan = monthData.pengajuan
      if (selectedRW !== "all") {
        filteredPengajuan = monthData.pengajuan.filter((item) => item.id_rw === Number.parseInt(selectedRW))
      }

      const disetujui = filteredPengajuan.filter((item) => item.status === "Disetujui").length
      const ditolak = filteredPengajuan.filter((item) => item.status === "Ditolak").length

      return { month, disetujui, ditolak }
    })
  }

  const getRWOptions = () => {
    const rwSet = new Set()
    rawPengajuanData.forEach((monthData) => {
      if (monthData.pengajuan) {
        monthData.pengajuan.forEach((item) => {
          if (item.nama_rw) {
            rwSet.add(`${item.id_rw}:${item.nama_rw}`)
          }
        })
      }
    })
    return Array.from(rwSet).map((rw) => {
      const [id, name] = rw.split(":")
      return { id, name }
    })
  }

  const chartData = processChartData()
  const rwOptions = getRWOptions()
  const totalSubmissions = chartData.reduce((sum, item) => sum + item.disetujui + item.ditolak, 0)
  const approvalRate =
    totalSubmissions > 0
      ? ((chartData.reduce((sum, item) => sum + item.disetujui, 0) / totalSubmissions) * 100).toFixed(1)
      : 0

  useEffect(() => {
    fetchWargaPendingData(setDataWarga, setIsLoading)
    fetchCountPengajuanJenis(setPengajuanJenis)
    fetchPengajuanBulanan(setRawPengajuanData, currentYear)
  }, [])

  const legendData = [
    { name: "Pengantar KTP", color: "#2979FF" },
    { name: "Pengantar KK", color: "#00D1FF" },
    { name: "Pengantar Akta Kelahiran", color: "#4CAF50" },
    { name: "Surat Keterangan Kematian", color: "#FFC107" },
    { name: "Surat Domisili Tempat tinggal", color: "#FFC107" },
    { name: "Surat Domisili Usaha", color: "#FFC107" },
    { name: "Surat Keterangan Tidak Mampu", color: "#FF3B30" },
    { name: "Surat SKCK", color: "#673AB7" },
    { name: "Surat Ketenagakerjaan", color: "#E91E63" },
    { name: "Surat Pengantar Nikah", color: "#212121" },
    { name: "Surat Keterangan Pindah", color: "#E91E63" },
    { name: "Lainnya", color: "#9E9E9E" },
  ]

  const pieChartData = pengajuanJenis.map((item) => {
    const legendItem = legendData.find((legend) => legend.name === item.jenis_surat)
    return {
      name: item.jenis_surat,
      value: item.total,
      color: legendItem ? legendItem.color : "#9E9E9E",
    }
  })

  return (
    <div className="flex flex-col w-full">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Statistik Pengajuan Surat</CardTitle>
                  <CardDescription>
                    {currentPeriod === "first" ? "Januari - Juni" : "Juli - Desember"} {currentYear}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPeriod(currentPeriod === "first" ? "second" : "first")}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPeriod(currentPeriod === "first" ? "second" : "first")}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select value={selectedRW} onValueChange={setSelectedRW}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Pilih RW" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua RW</SelectItem>
                    {rwOptions.map((rw) => (
                      <SelectItem key={rw.id} value={rw.id}>
                        {rw.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                  <Bar dataKey="disetujui" fill="#4AFA4A" radius={4} />
                  <Bar dataKey="ditolak" fill="#FF3B30" radius={4} />
                </BarChart>
              </ChartContainer>

              <div className="flex items-center justify-start gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-3 rounded-full bg-[#4AFA4A]" />
                  <span className="text-sm font-medium">Disetujui</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-3 rounded-full bg-[#FF3B30]" />
                  <span className="text-sm font-medium">Ditolak</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 bg-blue-100 p-2 rounded-lg items-center">
                <div className="flex items-center p-4">
                  <Lightbulb className="h-6 w-6 text-blue" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 leading-none font-medium">
                    Tingkat persetujuan {approvalRate}%  {approvalRate > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  </div>
                  <div className="text-muted-foreground leading-none">
                    Menampilkan total pengajuan untuk {currentPeriod === "first" ? "6 bulan pertama" : "6 bulan terakhir"}
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>

          {/* Pie Chart */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardDescription>{bulanIndonesia[currentMonth]}, {currentYear}</CardDescription>
              <CardTitle>Persentase Aduan Warga Desa Sarimi</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={pieChartConfig} className="h-[300px] w-full">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#9E9E9E"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>

              {/* Legend */}
              <div className="mt-4">
                <h4 className="font-semibold text-sm mb-3">Jenis Aduan</h4>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  {legendData.map((item, index) => {
                    const dataItem = pieChartData.find((d) => d.name === item.name)
                    const count = dataItem ? dataItem.value : 0
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="container mx-auto p-6 md:mb-0 mb-8">
        <div className="p-4 bg-white">
          <h2 className="text-2xl font-bold mb-4">Approval akun warga</h2>
          <div className="space-y-4">
            {isLoading ? (
              <>
                {[...Array(2)].map((_, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex flex-col h-full justify-between">
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
                    <div className="flex flex-col h-full justify-between">
                      <p className="font-medium flex items-center h-1/2">Tidak ada warga yang mendaftar</p>
                      <p className="text-sm flex h-1/2 text-blue">Semua approval role warga telah diproses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              dataWarga.sort((a, b) => {
                if (a.user.status_akun !== b.user.status_akun) {
                  return a.user.status_akun - b.user.status_akun;
                }
                return new Date(b.created_at) - new Date(a.created_at);
              }).slice(0, 2).map((warga, index) => (
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
                        <Button className="bg-[#4CAF50] hover:bg-[#4CAF50]/90 w-full sm:w-auto">Setujui</Button>
                        <Link href={`/admin/approval-role`} className="w-full sm:w-auto flex justify-center">
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
  )
}

export default DashboardContent
