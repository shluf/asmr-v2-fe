'use client';

import InputError from '@/components/Atoms/InputError';
import InputLabel from '@/components/Atoms/InputLabel';
import PrimaryButton from '@/components/Atoms/PrimaryButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import FileUpload from '@/components/ui/file-upload';
import axios from 'axios';
import InputField from '@/components/partials/InputFields';
import { AlertWrapper, showAlert } from '@/components/partials/Alert';

const TambahRTRW = () => {
  const [rwOptions, setRwOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    username: "",
    jabatan: "",
    nomor: "",
    password: "",
    nik: "",
    periode: "",
    id_rw: "",
    alamat: "",
    ttd: null,
  });
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: formData
  });

  useEffect(() => {
    fetchRWList();
  }, []);

  const fetchRWList = async () => {
    try {
      setRwOptions([
        { id: 1, nomor: "01" },
        { id: 2, nomor: "02" },
        { id: 3, nomor: "03" }
      ]);
    } catch (error) {
      console.error('Error fetching RW list:', error);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    const formPayload = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== '') {
        formPayload.append(key, data[key]);
      }
    });

    try {
      // Simulasi respons API
      // const response = await axios.post('/rt-rw/store', formPayload);
      
      // Simulasi sukses
      setTimeout(() => {
        reset();
  
        if (data.jabatan === 'RW') {
          fetchRWList();
        }
  
        showAlert({
          title: "Akun berhasil ditambahkan",
          desc: `Nama ${data.nama} dengan jabatan ${data.jabatan} ${data.nomor} telah ditambahkan`,
          message: "Silahkan cek kembali di laman Biodata User",
          color: "green",
        });

        setIsLoading(false);
        setFormData({
          nama: "",
          username: "",
          jabatan: "",
          nomor: "",
          password: "",
          nik: "",
          periode: "",
          id_rw: "",
          alamat: "",
          ttd: null,
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      showAlert({
        title: "Akun gagal ditambahkan",
        desc: error.response?.data?.error || "Terjadi kesalahan",
        message: `Silahkan masukan kembali data ${data.jabatan} dengan benar`,
        succes: false,
        color: "red",
      });
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        showAlert({
          title: "Gagal Mengupload Gambar",
          desc: "File terlalu besar",
          message: "Maksimal ukuran file adalah 2MB",
          succes: false,
          color: "red",
        });
        e.target.value = '';
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        showAlert({
          title: "Gagal Mengupload Gambar",
          desc: "Format file tidak didukung",
          message: "Gunakan format JPG atau PNG",
          succes: false,
          color: "red",
        });
        e.target.value = '';
        return;
      }
      setValue('ttd', file);
    }
  };

  const handleRwChange = (selectedRw) => {
    setValue('id_rw', selectedRw);
    setFormData(prev => ({
      ...prev,
      id_rw: selectedRw
    }));
  };

  const handleInputChange = (id, value) => {
    setValue(id, value);
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  return (
    <div className="w-full p-10 mb-8">
      <div>
        <AlertWrapper />
      </div>
      <Tabs defaultValue="rtTab" className="max-w-2xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rtTab">RT</TabsTrigger>
          <TabsTrigger value="rwTab">RW</TabsTrigger>
        </TabsList>

        <TabsContent value="rtTab">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="col-span-2">
                <InputField
                  label="Nama Lengkap"
                  id="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  error={errors.nama?.message}
                  required
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <InputField
                  label="NIK"
                  id="nik"
                  value={formData.nik}
                  onChange={handleInputChange}
                  error={errors.nik?.message}
                  required
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <InputField
                  label="Periode"
                  id="periode"
                  placeholder="contoh: 2024-2029"
                  value={formData.periode}
                  onChange={handleInputChange}
                  error={errors.periode?.message}
                  required
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <InputLabel htmlFor="jabatan" value="Jabatan" />
                <Select 
                  onValueChange={(value) => handleInputChange('jabatan', value)}
                  value={formData.jabatan}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Jabatan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RT">RT</SelectItem>
                  </SelectContent>
                </Select>
                <InputError message={errors.jabatan?.message} className="mt-1" />
              </div>

              <div className="col-span-2 md:col-span-1">
                <InputField
                  label="Nomor RT"
                  id="nomor"
                  value={formData.nomor}
                  onChange={handleInputChange}
                  error={errors.nomor?.message}
                  placeholder="01"
                  required
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <InputLabel htmlFor="id_rw" value="RW" />
                <Select onValueChange={handleRwChange} value={formData.id_rw}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih RW" />
                  </SelectTrigger>
                  <SelectContent>
                    {rwOptions.map((rw) => (
                      <SelectItem key={rw.id} value={rw.id.toString()}>
                         {rw.nomor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.id_rw?.message} className="mt-1" />
              </div>

              <div className="col-span-2">
                <InputField
                  label="Alamat"
                  id="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  error={errors.alamat?.message}
                  required
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <InputField
                  label="Username"
                  id="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  error={errors.username?.message}
                  required
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <InputField
                  label="Password"
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password?.message}
                  required
                />
              </div>

              <div className="col-span-2">
                <FileUpload
                  id="ttd"
                  accept="image/jpeg,image/png"
                  setData={setValue}
                  className="mt-1"
                  errors={errors.ttd?.message}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <PrimaryButton
                type="submit"
                color={"blue"}
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : "Tambah RT"}
              </PrimaryButton>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="rwTab">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="col-span-2">
                <InputField
                  label="Nama Lengkap"
                  id="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  error={errors.nama?.message}
                  required
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <InputField
                  label="NIK"
                  id="nik"
                  value={formData.nik}
                  onChange={handleInputChange}
                  error={errors.nik?.message}
                  required
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <InputField
                  label="Periode"
                  id="periode"
                  placeholder="contoh: 2024-2029"
                  value={formData.periode}
                  onChange={handleInputChange}
                  error={errors.periode?.message}
                  required
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <InputLabel htmlFor="jabatan" value="Jabatan" />
                <Select 
                  onValueChange={(value) => handleInputChange('jabatan', value)}
                  value={formData.jabatan}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Jabatan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RW">RW</SelectItem>
                  </SelectContent>
                </Select>
                <InputError message={errors.jabatan?.message} className="mt-1" />
              </div>

              <div className="col-span-2 md:col-span-1">
                <InputField
                  label="Nomor RW"
                  id="nomor"
                  value={formData.nomor}
                  onChange={handleInputChange}
                  error={errors.nomor?.message}
                  placeholder='01'
                  required
                />
              </div>

              <div className="col-span-2">
                <InputField
                  label="Alamat"
                  id="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  error={errors.alamat?.message}
                  required
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <InputField
                  label="Username"
                  id="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  error={errors.username?.message}
                  required
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <InputField
                  label="Password"
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password?.message}
                  required
                />
              </div>

              <div className="col-span-2">
                <FileUpload
                  id="ttd"
                  setData={setValue}
                  accept="image/jpeg,image/png"
                  onChange={handleFileChange}
                  className="mt-1"
                  errors={errors.ttd?.message}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <PrimaryButton
                type="submit"
                color={"blue"}
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : "Tambah RW"}
              </PrimaryButton>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TambahRTRW;