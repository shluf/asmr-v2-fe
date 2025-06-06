'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import PrimaryButton from '@/components/Atoms/PrimaryButton'
import InputLabel from '@/components/Atoms/InputLabel'
import InputError from '@/components/Atoms/InputError'
import InputField from '@/components/partials/InputFields'
import FileUpload from '@/components/ui/file-upload'
import {
  fetchAllRW,
  fetchAllRT,
  fetchRTDetails,
  fetchRWDetails,
  fetchWargaByRT,
  fetchWargaByRW,
  createRTEntity,
  createRWEntity,
  registerPejabat,
  updatePejabatRT,
  updatePejabatRW,
  unassignPejabatRT,
  unassignPejabatRW,
} from '@/hooks/admin'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { ChevronDown, ChevronRight, Sparkles } from 'lucide-react'
import LoadingSpinner from '@/components/partials/LoadingSpinner'

const TambahRTRW = () => {
  const [rwList, setRwList] = useState([])
  const [rtList, setRtList] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [itemDetails, setItemDetails] = useState(null)
  const [wargaUntukJabatan, setWargaUntukJabatan] = useState([])
  
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [isLoadingWarga, setIsLoadingWarga] = useState(false)

  const [isAddWilayahModalOpen, setIsAddWilayahModalOpen] = useState(false)
  const [expandedRwIds, setExpandedRwIds] = useState({})

  const defaultPejabatFormValues = {
    id_warga: '',
    nama_jabatan: '',
    periode_mulai: '',
    periode_selesai: '',
    ttd: null,
  }

  const {
    control, 
    handleSubmit,
    reset: resetPejabatForm,
    setValue: setPejabatFormValue,
    watch: watchPejabatForm,
    formState: { errors: pejabatFormErrors }
  } = useForm({
    defaultValues: defaultPejabatFormValues
  })

  const loadInitialData = useCallback(async () => {
    setIsLoading(true)
    await fetchAllRW(setRwList, setIsLoading)
    await fetchAllRT(setRtList, setIsLoading)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadInitialData()
  }, [loadInitialData])

  const handleSelectItem = async (type, id) => {
    setIsLoadingDetails(true)
    setSelectedItem({ type, id })
    resetPejabatForm(defaultPejabatFormValues)
    setWargaUntukJabatan([])
    setItemDetails(null)

    let details = null
    if (type === 'RT') {
      await fetchRTDetails(id, (data) => details = data, setIsLoadingDetails)
      if (details) {
        await fetchWargaByRT(id, setWargaUntukJabatan, setIsLoadingWarga)
      }
    } else if (type === 'RW') {
      await fetchRWDetails(id, (data) => details = data, setIsLoadingDetails)
      if (details) {
        await fetchWargaByRW(id, setWargaUntukJabatan, setIsLoadingWarga)
      }
    }
    setItemDetails(details)
    if (details && details.pejabat) {
      setPejabatFormValue('id_warga', details.pejabat.id_warga || '')
      setPejabatFormValue('nama_jabatan', details.pejabat.nama_jabatan || (type === 'RT' ? 'Ketua RT' : 'Ketua RW'))
      setPejabatFormValue('periode_mulai', details.pejabat.periode_mulai || '')
      setPejabatFormValue('periode_selesai', details.pejabat.periode_selesai || '')
    } else {
       setPejabatFormValue('nama_jabatan', type === 'RT' ? 'Ketua RT' : 'Ketua RW')
    }
    setIsLoadingDetails(false)
  }

  const handleRwItemClick = (rwId) => {
    setExpandedRwIds(prev => ({
      ...prev,
      [rwId]: !prev[rwId]
    }))
    if (!expandedRwIds[rwId]) {
        handleSelectItem('RW', rwId)
    } else if (selectedItem?.type === 'RW' && selectedItem?.id === rwId && expandedRwIds[rwId]) {
        setSelectedItem(null)
        setItemDetails(null)
    }
  }

  const handleRtItemClick = (rtId) => {
    handleSelectItem('RT', rtId)
  }

  const onPejabatFormSubmit = async (data) => {
    if (!selectedItem) return

    const formData = new FormData()
    formData.append('id_rt', selectedItem.type === 'RT' ? selectedItem.id : (itemDetails?.pejabat?.id_rt_asal || itemDetails?.rt_terkait_id || ''))
    formData.append('id_rw', selectedItem.type === 'RW' ? selectedItem.id : (itemDetails?.id_rw || itemDetails?.rw?.id_rw || ''))
    formData.append('role', selectedItem.type === 'RT' ? 'PejabatRT' : 'PejabatRW')
    formData.append('periode_mulai', data.periode_mulai)
    formData.append('periode_selesai', data.periode_selesai)
    if (data.ttd && data.ttd[0]) {
      formData.append('ttd', data.ttd[0])
    }

    formData.append('id_warga', data.id_warga)

    let success = false
    if (itemDetails?.pejabat) {
      if (selectedItem.type === 'RT') {
        await updatePejabatRT(selectedItem.id, formData, setIsLoading, () => {
        success = true
        handleSelectItem(selectedItem.type, selectedItem.id)
        loadInitialData()
      })
      } else if (selectedItem.type === 'RW') {
        await updatePejabatRW(selectedItem.id, formData, setIsLoading, () => {
          success = true
          handleSelectItem(selectedItem.type, selectedItem.id)
          loadInitialData()
        })
      }
    } else {
      await registerPejabat(formData, setIsLoading, () => {
          success = true
          handleSelectItem(selectedItem.type, selectedItem.id)
          loadInitialData()
      })
    }
    if (success) {
      resetPejabatForm(defaultPejabatFormValues)
    }
  }

  const handleUnassignPejabat = async () => {
    if (!selectedItem || !itemDetails || !itemDetails.pejabat) return

    let unassignSuccess = false
    if (selectedItem.type === 'RT') {
      await unassignPejabatRT(selectedItem.id, setIsLoading, () => {
        unassignSuccess = true
      })
    } else if (selectedItem.type === 'RW') {
      await unassignPejabatRW(selectedItem.id, setIsLoading, () => {
        unassignSuccess = true
      })
    }

    if (unassignSuccess) {
      handleSelectItem(selectedItem.type, selectedItem.id)
      loadInitialData()
    }
  }

  const { control: rtControl, handleSubmit: handleRtSubmit, reset: resetRtForm, formState: { errors: rtErrors } } = useForm({
    defaultValues: { nama_rt: '', id_rw_parent: '' }
  })
  const onAddRTSubmit = async (data) => {
    await createRTEntity({ nama_rt: data.nama_rt, id_rw: data.id_rw_parent }, setIsLoading, () => {
      loadInitialData()
      resetRtForm()
    })
  }

  const { control: rwControl, handleSubmit: handleRwSubmit, reset: resetRwForm, formState: { errors: rwErrors } } = useForm({
    defaultValues: { nama_rw: '' }
  })
  const onAddRWSubmit = async (data) => {
    await createRWEntity({ nama_rw: data.nama_rw }, setIsLoading, () => {
      loadInitialData()
      resetRwForm()
    })
  }

  return (
    <div className="w-full p-4 flex flex-col md:flex-row gap-6">
      <Card className="w-full md:w-1/3">
        <CardHeader className="flex flex-col gap-2">
          <CardTitle>Daftar RT/RW</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <LoadingSpinner />}
          <ScrollArea className="h-[200px] md:h-[480px]">
            {rwList.length > 0 ? rwList.map(rw => {
              const rtsInRw = rtList.filter(rt => (rt.id_rw === (rw.id_rw || rw.id)) || (rt.rw?.id === (rw.id_rw || rw.id)) || (rt.rw?.id_rw === (rw.id_rw || rw.id)))
              const rwId = rw.id_rw || rw.id
              const isExpanded = !!expandedRwIds[rwId]

              return (
                <div key={rwId} className="my-1">
                  <div 
                    className={`p-2 border rounded cursor-pointer hover:bg-slate-100 flex justify-between items-center ${selectedItem?.type === 'RW' && selectedItem?.id === rwId ? 'bg-slate-200' : ''}`}
                    onClick={() => handleRwItemClick(rwId)}
                  >
                    <div className="flex-grow">
                        <span className="font-semibold">{rw.nama_rw}</span>
                        {rw.pejabat && <p className="text-xs text-gray-600">Ketua: {rw.pejabat.nama_warga}</p>}
                    </div>
                    {rtsInRw.length > 0 && (
                        isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />
                    )}
                  </div>
                  {isExpanded && rtsInRw.length > 0 && (
                    <div className="ml-4 mt-1 pl-2 border-l-2 border-slate-200">
                      {rtsInRw.map(rt => {
                        const rtId = rt.id_rt || rt.id
                        return (
                          <div 
                            key={rtId} 
                            className={`p-2 my-1 border-b border-slate-100 rounded-r cursor-pointer hover:bg-slate-50 ${selectedItem?.type === 'RT' && selectedItem?.id === rtId ? 'bg-slate-100 font-medium' : ''}`}
                            onClick={(e) => { e.stopPropagation(); handleRtItemClick(rtId) }}
                          >
                            {rt.nama_rt}
                            {rt.pejabat && <p className="text-xs text-gray-500">Ketua: {rt.pejabat.nama_warga}</p>}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }) : (!isLoading && <p className="text-sm text-gray-500">Tidak ada data RW.</p>)}
          </ScrollArea>
          <div className="flex justify-around gap-2 w-full my-2">
            <Dialog open={isAddWilayahModalOpen} onOpenChange={setIsAddWilayahModalOpen}>
              <DialogTrigger asChild>
                <PrimaryButton size="sm" color='blue' disabled={isLoading} className="w-full"> Tambah Wilayah </PrimaryButton>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Tambah Wilayah Baru</DialogTitle>
                  <DialogDescription>
                    Pilih tab untuk menambahkan RT atau RW baru.
                  </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="tambah_rt" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="tambah_rt">Tambah RT</TabsTrigger>
                    <TabsTrigger value="tambah_rw">Tambah RW</TabsTrigger>
                  </TabsList>
                  <TabsContent value="tambah_rt">
                    <form onSubmit={handleRtSubmit(onAddRTSubmit)} className="space-y-4 py-4">
                      <Controller
                        name="nama_rt"
                        control={rtControl}
                        rules={{ required: 'Nomor RT tidak boleh kosong' }}
                        render={({ field }) => (
                          <InputField label="Nomor RT" id="nama_rt_modal" {...field} error={rtErrors.nama_rt?.message} placeholder="Contoh: 001" />
                        )}
                      />
                      <div>
                        <InputLabel htmlFor="id_rw_parent_modal" value="Pilih RW Induk" />
                        <Controller
                          name="id_rw_parent"
                          control={rtControl}
                          rules={{ required: 'RW Induk harus dipilih' }}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger><SelectValue placeholder="Pilih RW" /></SelectTrigger>
                              <SelectContent>
                                {rwList.map(rw => <SelectItem key={rw.id_rw || rw.id} value={(rw.id_rw || rw.id).toString()}>{rw.nama_rw}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <InputError message={rtErrors.id_rw_parent?.message} />
                      </div>
                      <DialogFooter className="pt-4">
                        <DialogClose asChild><Button variant="ghost">Batal</Button></DialogClose>
                        <PrimaryButton type="submit" disabled={isLoading} color="blue">Simpan RT</PrimaryButton>
                      </DialogFooter>
                    </form>
                  </TabsContent>
                  <TabsContent value="tambah_rw">
                    <form onSubmit={handleRwSubmit(onAddRWSubmit)} className="space-y-4 py-4">
                      <Controller
                        name="nama_rw"
                        control={rwControl}
                        rules={{ required: 'Nomor RW tidak boleh kosong' }}
                        render={({ field }) => (
                          <InputField label="Nomor RW" id="nama_rw_modal" {...field} error={rwErrors.nama_rw?.message} placeholder="Contoh: 01" />
                        )}
                      />
                      <DialogFooter className="pt-4">
                        <DialogClose asChild><Button variant="ghost">Batal</Button></DialogClose>
                        <PrimaryButton type="submit" disabled={isLoading} color="blue">Simpan RW</PrimaryButton>
                      </DialogFooter>
                    </form>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full md:w-2/3">
        <CardHeader>
          <CardTitle>
            {selectedItem ? `Detail & Kelola Jabatan ${itemDetails?.nama_rt || itemDetails?.nama_rw || '...'}` : 'Pilih RT/RW dari daftar'}
          </CardTitle>
          {itemDetails?.pejabat && (
              <CardDescription>Pejabat Aktif: {itemDetails.pejabat.nama_warga} ({itemDetails.pejabat.periode_mulai} - {itemDetails.pejabat.periode_selesai})</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {(isLoadingDetails || isLoadingWarga) && <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>}
          {!selectedItem && !isLoadingDetails && (
            <div className="flex items-center justify-center p-6 border border-dashed rounded-md">
              <div className="text-center flex flex-col items-center">
                <Sparkles className="w-10 h-10 text-blue-500 mb-2" />
                <p className="text-gray-700 mb-2">Silakan pilih RT atau RW dari daftar untuk melihat detail dan mengelola jabatan.</p>
                <p className="text-sm text-gray-500">Klik pada salah satu item untuk memulai</p>
              </div>
            </div>
          )}
          
          {selectedItem && !isLoadingDetails && itemDetails && (
            <form onSubmit={handleSubmit(onPejabatFormSubmit)} className="space-y-4">
              <h4 className="font-semibold text-lg mb-3">Formulir Jabatan</h4>
              
              <div>
                  <InputLabel htmlFor="id_warga" value="Pilih Warga" />
                  <Controller
                    name="id_warga"
                    control={control}
                    rules={{ required: 'Warga harus dipilih' }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingWarga}>
                        <SelectTrigger><SelectValue placeholder={isLoadingWarga ? "Memuat warga..." : "Pilih Warga"} /></SelectTrigger>
                        <SelectContent>
                          {wargaUntukJabatan.length > 0 
                            ? wargaUntukJabatan.map(w => <SelectItem key={w.id_warga || w.id} value={(w.id_warga || w.id).toString()}>{w.nama_lengkap} (NIK: {w.nik})</SelectItem>)
                            : <SelectItem value="-" disabled>Tidak ada warga yang tersedia/memenuhi syarat. Cari warga terlebih dahulu.</SelectItem>}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <InputError message={pejabatFormErrors.id_warga?.message} />
                </div>
                
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller 
                  name="periode_mulai"
                  control={control}
                  rules={{ 
                    required: 'Periode Mulai tidak boleh kosong',
                    pattern: { value: /^\d{4}$/, message: 'Masukkan tahun (4 digit angka)' }
                  }}
                  render={({ field }) => (
                    <InputField 
                      label="Periode Mulai (Tahun)" 
                      id="periode_mulai" 
                      type="number" 
                      placeholder="Contoh: 2024" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : '')}
                      error={pejabatFormErrors.periode_mulai?.message} 
                      required 
                    />
                  )}
                />
                <Controller 
                  name="periode_selesai"
                  control={control}
                  rules={{ 
                    required: 'Periode Selesai tidak boleh kosong',
                    pattern: { value: /^\d{4}$/, message: 'Masukkan tahun (4 digit angka)' },
                    validate: value => parseInt(watchPejabatForm('periode_mulai')) ? (parseInt(value) >= parseInt(watchPejabatForm('periode_mulai')) || 'Periode Selesai harus setelah atau sama dengan Periode Mulai') : true
                  }}
                  render={({ field }) => (
                    <InputField 
                      label="Periode Selesai (Tahun)" 
                      id="periode_selesai" 
                      type="number" 
                      placeholder="Contoh: 2029" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : '')}
                      error={pejabatFormErrors.periode_selesai?.message} 
                      required 
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  name="ttd"
                  control={control}
                  rules={{
                    validate: {
                      size: (files) => {
                        if (!files || !files[0]) return true
                        return files[0].size <= 3 * 1024 * 1024 || "Ukuran file TTD maksimal 3MB"
                      },
                      type: (files) => {
                        if (!files || !files[0]) return true
                        return ['image/jpeg', 'image/png', 'image/jpg'].includes(files[0].type) || "Format TTD harus JPG/PNG"
                      }
                    }
                  }}
                  render={({ field }) => (
                     <FileUpload 
                        {...field}
                        id="ttd_pejabat" 
                        accept="image/jpeg,image/png,image/jpg"
                        errors={pejabatFormErrors.ttd?.message}
                        infoText={itemDetails?.pejabat?.ttd_url ? `TTD saat ini: ${itemDetails.pejabat.ttd_url.split('/').pop()}` : "Belum ada TTD."}
                     />
                  )}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                {itemDetails?.pejabat && (
                    <Button type="button" variant="destructive" onClick={handleUnassignPejabat} disabled={isLoading}>
                        Hapus Jabatan Ini
                    </Button>
                )}
                <PrimaryButton type="submit" color="blue" disabled={isLoading}>
                  {isLoading ? "Memproses..." : (itemDetails?.pejabat ? "Update Jabatan" : "Simpan Jabatan")}
                </PrimaryButton>
              </div>
            </form>
          )}
          
          {selectedItem && !isLoadingDetails && !itemDetails && !isLoadingWarga &&
            <p className="text-red-500">Gagal memuat detail untuk {selectedItem.type} {selectedItem.id}. Silakan coba lagi.</p>
          }
        </CardContent>
      </Card>
    </div>
  )
}

export default TambahRTRW