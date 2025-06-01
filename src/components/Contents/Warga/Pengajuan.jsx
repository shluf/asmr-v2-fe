'use client'

import { useEffect, useState } from "react";
import { submitPengajuan, fetchPengajuanAkunData } from "@/hooks/warga";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TextInput from "@/components/Atoms/TextInput";
import { Textarea } from "@/components/ui/textarea";
import { showAlert } from "@/components/partials/Alert";
import { useAuthTokenClient } from "@/lib/jwt";

const Pengajuan = () => {
    const [dataWarga, setDataWarga] = useState({});
    const [selectedJenisSurat, setSelectedJenisSurat] = useState("");
    const [description, setDescription] = useState("");
    const [isLainnya, setIsLainnya] = useState(false)
    const { payload } = useAuthTokenClient();
    const [isLoading, setIsLoading] = useState(false);
    const initialPengajuanState = {
        nama_pemohon: "",
        nik_pemohon: "",
        nomor_kk_pemohon: "",
        jenis_kelamin_pemohon: "",
        tempat_tanggal_lahir_pemohon: "",
        alamat_pemohon: "",
        agama_pemohon: "",
        phone_pemohon: "",
    };

    const [pengajuan, setPengajuan] = useState(initialPengajuanState);

    useEffect(() => {
        if (payload && payload.no_kk) {
            setPengajuan(prev => ({ ...prev, nomor_kk_pemohon: payload.no_kk }));
        }

        const loadInitialData = async () => {
            const result = await fetchPengajuanAkunData(setDataWarga, (akunData) => {
                setPengajuan(prev => ({
                    ...prev,
                    nomor_kk_pemohon: akunData.no_kk || prev.nomor_kk_pemohon,
                    alamat_pemohon: akunData.alamat || prev.alamat_pemohon,
                }));
            });
        };

        loadInitialData();
    }, []);

    const handleJenisSuratChange = (event) => {
        setSelectedJenisSurat(event.target.value);
        if (event.target.value==="lainnya:") {
            setIsLainnya(true)
        } else {
            setIsLainnya(false)
        }
    };
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPengajuan((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const { nomor_kk_pemohon, ...restOfPengajuanState } = pengajuan;
            const formDataToSubmit = {
                ...restOfPengajuanState,
                no_kk_pemohon: nomor_kk_pemohon,
                jenis_surat: selectedJenisSurat,
                deskripsi: description,
            };
            
            const result = await submitPengajuan(formDataToSubmit);
            
            if (result.success) {
                showAlert({
                    title: "Berhasil",
                    desc: result.message || "Surat berhasil diajukan",
                    success: true,
                    color: "green",
                });
                
                setSelectedJenisSurat("");
                setDescription("");
                setPengajuan(initialPengajuanState);
                if (payload && payload.no_kk) {
                    setPengajuan(prev => ({ ...initialPengajuanState, nomor_kk_pemohon: payload.no_kk }));
                }
            } else {
                showAlert({
                    title: "Gagal",
                    desc: result.message || "Pengajuan gagal.",
                    success: false,
                    message: "Pengajuan gagal, mohon periksa kembali data yang Anda masukkan",
                    color: "red",
                    errors: result.errors
                });
            }
        } catch (error) {
            console.error("Error submitting pengajuan in component:", error);
            showAlert({
                title: "Gagal Submit",
                desc: "Terjadi kesalahan teknis saat mengirim pengajuan.",
                message: "Terjadi kesalahan teknis saat mengirim pengajuan, mohon coba lagi nanti",
                success: false,
                color: "red",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full  flex justify-center items-start p-3 mb-4">
            <form className="bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 border rounded-lg w-full h-full  p-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-6">
                    Form Pengajuan
                </h2>
                <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                <div className="text-blue-2  md:text-sm text-xs  mt-4">
                    Mohon Isi Formulir dengan Benar untuk Mempercepat Proses
                    Layanan Anda
                </div>
                <div className="text-gray-600 mt-2 md:text-base text-sm">
                    Yang bertanda tangan di bawah ini Ketua {dataWarga?.rt?.nama_rt || '[RT]'} {dataWarga?.rt?.rw?.nama_rw || '[RW]'} {(dataWarga.alamat && dataWarga.alamat.alamat) || '[Alamat Warga]'}, {dataWarga?.alamat?.kabupaten || '[Kota Warga]'}, {dataWarga?.alamat?.provinsi || '[Provinsi Warga]'},
                    memberikan keterangan kepada :
                </div>
                <div className="text-gray-800 mx-2 md:mx-8 mt-4 md:text-base text-sm space-y-1">
                    <div className="flex md:flex-row flex-col md:items-center items-start">
                        <label className="font-semibold w-60">Nama <span className="w-5 md:hidden">:</span></label>
                        <span className="w-5 md:block hidden">:</span>
                        <TextInput
                            color="green"
                            type="text"
                            name="nama_pemohon"
                            value={pengajuan.nama_pemohon}
                            onChange={handleInputChange}
                            className="flex-1 p-2 w-full sm:min-w-80 border rounded"
                            required
                        />
                    </div>
                    <div className="flex md:flex-row flex-col md:items-center items-start">
                        <label className="font-semibold w-60">NIK <span className="w-5 md:hidden">:</span></label>
                        <span className="w-5 md:block hidden">:</span>
                        <TextInput
                            color="green"
                            type="number"
                            name="nik_pemohon"
                            value={pengajuan.nik_pemohon}
                            onChange={handleInputChange}
                            className="flex-1 p-2 min-w-60 sm:min-w-80 border rounded w-full "
                            required
                        />
                    </div>
                    <div className="flex md:flex-row flex-col md:items-center items-start">
                        <label className="font-semibold w-60">NO.KK <span className="w-5 md:hidden">:</span></label>
                        <span className="w-5 md:block hidden">:</span>
                        <TextInput
                            color="green"
                            type="text"
                            name="nomor_kk_pemohon"
                            value={pengajuan.nomor_kk_pemohon}
                            disabled
                            className="flex-1 min-w-60 sm:min-w-80 p-2 text-zinc-500 border rounded w-full "
                        />
                    </div>
                    <div className="flex md:flex-row flex-col md:items-center items-start">
                        <label className="font-semibold w-60">Jenis Kelamin <span className="w-5 md:hidden">:</span></label>
                            <span className="w-5 md:block hidden">:</span>
                        <div className="flex-1 min-w-60 sm:max-w-80 sm:min-w-80 w-full">
                        <Select 
                            onValueChange={(value) => 
                                setPengajuan((prev) => ({ ...prev, jenis_kelamin_pemohon: value }))}
                            value={pengajuan.jenis_kelamin_pemohon}
                        >

                        <SelectTrigger  
                            color="green"      
                            id="jenis_kelamin_pemohon"
                            name="jenis_kelamin_pemohon"
                            required>
                            <SelectValue placeholder="Jenis Kelamin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="L">Laki-laki</SelectItem>
                            <SelectItem value="P">Perempuan</SelectItem>
                        </SelectContent>
                        </Select>
                        </div>

                    </div>
                    <div className="flex md:flex-row flex-col md:items-center items-start">
                        <label className="font-semibold w-60">Agama <span className="w-5 md:hidden">:</span></label>
                        <span className="w-5 md:block hidden">:</span>
                        <div className="flex-1 min-w-60 sm:max-w-80 sm:min-w-80 w-full">
                        <Select 
                            onValueChange={(value) => 
                                setPengajuan((prev) => ({ ...prev, agama_pemohon: value }))}
                            value={pengajuan.agama_pemohon}
                        >
                        <SelectTrigger  
                            color="green"      
                            id="agama_pemohon"
                            name="agama_pemohon"
                            required>
                            <SelectValue placeholder="Agama" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Islam">Islam</SelectItem>
                            <SelectItem value="Kristen">Kristen</SelectItem>
                            <SelectItem value="Katolik">Katolik</SelectItem>
                            <SelectItem value="Hindu">Hindu</SelectItem>
                            <SelectItem value="Buddha">Buddha</SelectItem>
                            <SelectItem value="Khonghucu">Khonghucu</SelectItem>
                        </SelectContent>
                        </Select>
                        </div>

                    </div>
                    <div className="flex md:flex-row flex-col md:items-center items-start">
                        <label className="font-semibold w-60">
                            Tempat, tanggal lahir <span className="w-5 md:hidden">:</span>
                        </label>
                        <span className="w-5 md:block hidden">:</span>
                        <TextInput
                            color="green"
                            type="text"
                            name="tempat_tanggal_lahir_pemohon"
                            value={pengajuan.tempat_tanggal_lahir_pemohon}
                            onChange={handleInputChange}
                            placeholder="Contoh: Jakarta, 01/01/2000"
                            className="flex-1 min-w-60 sm:min-w-80 p-2 border rounded w-full "
                            required
                        />
                    </div>
                    <div className="flex md:flex-row flex-col md:items-center items-start">
                        <label className="font-semibold w-60">
                            Nomor Telepon <span className="w-5 md:hidden">:</span>
                        </label>
                        <span className="w-5 md:block hidden">:</span>
                        <TextInput
                            color="green"
                            type="tel"
                            name="phone_pemohon"
                            value={pengajuan.phone_pemohon}
                            onChange={handleInputChange}
                            className="flex-1 p-2 min-w-60 sm:min-w-80 border rounded w-full "
                            placeholder="Contoh: 081234567890"
                            required
                        />
                    </div>
                    <div className="flex md:flex-row flex-col md:items-center items-start">
                        <label className="font-semibold w-60">
                            Alamat/Tempat tinggal <span className="w-5 md:hidden">:</span>
                        </label>
                        <span className="w-5 md:block hidden">:</span>
                        <TextInput
                            color="green"
                            type="text"
                            name="alamat_pemohon"
                            value={pengajuan.alamat_pemohon}
                            onChange={handleInputChange}
                            className="flex-1 p-2 min-w-60 sm:min-w-80 border rounded w-full "
                            required
                        />
                    </div>
                    </div>

                <div className="mb-6 mt-4 md:text-base text-sm">
                    <div className="text-gray-700">
                        Benar bahwa yang bersangkutan adalah warga {dataWarga?.rt?.nama_rt || '[RT]'} {dataWarga?.rt?.rw?.nama_rw || '[RW]'} yang beralamat di{" "}
                        {(dataWarga.alamat && dataWarga.alamat.alamat) || '[Alamat Warga]'}, {dataWarga?.alamat?.kabupaten || '[Kota Warga]'}, {dataWarga?.alamat?.provinsi || '[Provinsi Warga]'}, dan bermaksud untuk mengurus surat:
                    </div>
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
                                    color="green"
                                    type="radio"
                                    name="jenis_surat"
                                    value={jenis}
                                    className="form-radio text-green"
                                    checked={selectedJenisSurat === jenis} 
                                    onChange={handleJenisSuratChange}
                                />
                                <span className="ml-2">{jenis}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <Textarea
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
                        rows="4"
                        placeholder="Detail Pengajuan"
                        value={isLainnya ? description : ""}
                        disabled={!isLainnya}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 transition duration-300"
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    Ajukan
                </button>
            </form>
        </div>
    );
};

export default Pengajuan;
