'use client'

import InputLabel from '@/components/Atoms/InputLabel'
import PrimaryButton from '@/components/Atoms/PrimaryButton'
import { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import { PenSquare, User2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { fetchAkunData } from '@/hooks/warga'
import { AlertWrapper, showAlert } from '@/components/Atoms/Alert'

const Akun = ({ nikWarga }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [jenisKelamin, setJenisKelamin] = useState(null);
  const [profileWarga, setProfileWarga] = useState({
    user: {}
  });
  
  const [data, setData] = useState({
    phone: "",
    alamat: "",
    kabupaten: "",
    provinsi: "",
    agama: "",
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const fetchData = async () => {
    const gender = await fetchAkunData(setProfileWarga, setData, nikWarga);
    setJenisKelamin(gender === "P" ? "Perempuan" : "Laki-Laki");
  };

  useEffect( () => {
    fetchData();
  }, [nikWarga]);

  const handleBack = () => {
    fetchData();
    setIsEditMode(false);
  }

  const submit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
        const response = await axios.put(`/api/profile-warga/${nikWarga}`, data);
        if (response.data.status === 'success') {
            setProfileWarga((prevState) => ({
                ...prevState,
                user: {
                    ...prevState.user,
                    phone: response.data.data.phone,
                    alamat: response.data.data.alamat,
                    kabupaten: response.data.data.kabupaten,
                    provinsi: response.data.data.provinsi,
                    agama: response.data.data.agama,
                },
            }));

            showAlert({
                title: "Berhasil!",
                desc: "Profil warga berhasil diperbarui.",
                message: "Data profil telah diperbarui dengan sukses.",
                succes: true,
                color: "green",
            });

            setIsEditMode(false);
        }
    } catch (error) {
        showAlert({
            title: "Terjadi Kesalahan",
            desc: error.message,
            message: "Gagal memperbarui profil warga.",
            succes: false,
            color: "red",
        });
        console.error('Error updating profile:', error);
        if (error.response?.data?.errors) {
            setErrors(error.response.data.errors);
        }
    } finally {
        setProcessing(false);
    }
};

  return (
      <>
          <AlertWrapper />
          <div className="w-full max-w-5xl mx-auto p-4 mb-4">
              <div className="flex flex-col justify-center items-center md:items-start md:flex-row gap-8">
                  <div className="flex-shrink-0">
                      <div className="relative">
                          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green p-6 text-green">
                              <User2 className="w-full h h-full" />
                          </div>
                          <div className="absolute bottom-0 right-0 bg-green text-white px-3 py-1 rounded-full text-sm font-medium">
                              WARGA
                          </div>
                          <button
                              onClick={() => setIsEditMode(!isEditMode)}
                              className="absolute -right-2 -top-2 bg-white rounded-full p-1.5 shadow-lg border"
                          >
                              <PenSquare className="w-4 h-4 text-green" />
                          </button>
                      </div>
                  </div>

                  <form onSubmit={submit}>
                      <Card className="flex-grow p-6">
                          <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                  <InputLabel htmlFor="nama">Nama</InputLabel>
                                  <Input
                                      className="focus:ring-green focus:border-green active:ring-green focus:ring-2"
                                      id="nama"
                                      defaultValue={profileWarga.nama}
                                      readOnly={!isEditMode}
                                  />
                              </div>
                              <div className="space-y-2">
                                  <InputLabel htmlFor="nik">NIK</InputLabel>
                                  <Input
                                      className="focus:ring-green focus:border-green active:ring-green focus:ring-2"
                                      id="nik"
                                      defaultValue={profileWarga.nomer_kk}
                                      disabled={isEditMode}
                                      readOnly={true}
                                  />
                              </div>
                              <div className="space-y-2">
                                  <InputLabel htmlFor="email">Email</InputLabel>
                                  <Input
                                      className="focus:ring-green focus:border-green active:ring-green focus:ring-2"
                                      id="email"
                                      type="email"
                                      defaultValue={profileWarga.user.email}
                                      disabled={isEditMode}
                                      readOnly={true}
                                  />
                              </div>
                              <div className="space-y-2">
                                  <InputLabel htmlFor="phone">Phone</InputLabel>
                                  <Input
                                      className="focus:ring-green focus:border-green active:ring-green focus:ring-2"
                                      id="phone"
                                      type="tel"
                                      value={data.phone}
                                      onChange={(e) =>
                                          setData("phone", e.target.value)
                                      }
                                      readOnly={!isEditMode}
                                  />
                              </div>
                              <div className="space-y-2">
                                  <InputLabel htmlFor="birthplace">
                                      Tempat, tanggal lahir
                                  </InputLabel>
                                  <Input
                                      className="focus:ring-green focus:border-green active:ring-green focus:ring-2"
                                      id="birthplace"
                                      defaultValue={
                                          profileWarga.tempat_dan_tanggal_lahir
                                      }
                                      disabled={isEditMode}
                                      readOnly={true}
                                  />
                              </div>
                              <div className="space-y-2">
                                  <InputLabel htmlFor="provinsi">
                                      Provinsi
                                  </InputLabel>
                                  <Input
                                      className="focus:ring-green focus:border-green active:ring-green focus:ring-2"
                                      id="provinsi"
                                      value={data.provinsi}
                                      onChange={(e) =>
                                          setData("provinsi", e.target.value)
                                      }
                                      readOnly={!isEditMode}
                                  />
                              </div>
                              <div className="space-y-2">
                                  <InputLabel htmlFor="alamat">
                                      Alamat
                                  </InputLabel>
                                  <Input
                                      className="focus:ring-green focus:border-green active:ring-green focus:ring-2"
                                      id="alamat"
                                      value={data.alamat}
                                      onChange={(e) =>
                                          setData("alamat", e.target.value)
                                      }
                                      readOnly={!isEditMode}
                                  />
                              </div>
                              <div className="space-y-2">
                                  <InputLabel htmlFor="kabupaten">
                                      Kabupaten
                                  </InputLabel>
                                  <Input
                                      className="focus:ring-green focus:border-green active:ring-green focus:ring-2"
                                      id="kabupaten"
                                      value={data.kabupaten}
                                      onChange={(e) =>
                                          setData("kabupaten", e.target.value)
                                      }
                                      readOnly={!isEditMode}
                                  />
                              </div>
                              <div className="space-y-2">
                                  <InputLabel htmlFor="gender">
                                      Jenis kelamin
                                  </InputLabel>
                                  <Input
                                      className="focus:ring-green focus:border-green active:ring-green focus:ring-2"
                                      id="gender"
                                      defaultValue={jenisKelamin}
                                      disabled={isEditMode}
                                      readOnly={true}
                                  />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                      <InputLabel htmlFor="rt">RT</InputLabel>
                                      <Input
                                          className="focus:ring-green focus:border-green active:ring-green focus:ring-2"
                                          id="rt"
                                          defaultValue={profileWarga.nomor_rt}
                                          disabled={isEditMode}
                                          readOnly={true}
                                      />
                                  </div>
                                  <div className="space-y-2">
                                      <InputLabel htmlFor="rw">RW</InputLabel>
                                      <Input
                                          className="focus:ring-green focus:border-green active:ring-green focus:ring-2"
                                          id="rw"
                                          defaultValue={profileWarga.nomor_rw}
                                          disabled={isEditMode}
                                          readOnly={true}
                                      />
                                  </div>
                              </div>
                              <div className="space-y-2">
                                  <InputLabel htmlFor="kk">No. KK</InputLabel>
                                  <Input
                                      className="focus:ring-green focus:border-green active:ring-green focus:ring-2"
                                      id="kk"
                                      defaultValue={profileWarga.nomer_kk}
                                      disabled={isEditMode}
                                      readOnly={true}
                                  />
                              </div>
                              <div className="space-y-2">
                                  <InputLabel htmlFor="agama">Agama</InputLabel>
                                  <Input
                                      className="focus:ring-green focus:border-green active:ring-green focus:ring-2"
                                      id="agama"
                                      onChange={(id, value) =>
                                          setData(id, value)
                                      }
                                      defaultValue={profileWarga.agama}
                                      disabled={isEditMode}
                                      readOnly={true}
                                  />
                              </div>
                          </div>

                          <div className="flex justify-end gap-4 mt-8">
                              {!isEditMode ? (
                                  <PrimaryButton
                                      type="button"
                                      className="px-6 py-3"
                                      color="yellow"
                                      onClick={() => setIsEditMode(true)}
                                  >
                                      Edit
                                  </PrimaryButton>
                              ) : (
                                  <>
                                      <PrimaryButton
                                          type="button"
                                          className="px-6 py-3"
                                          color="yellow"
                                          onClick={() => handleBack()}
                                      >
                                          Batal
                                      </PrimaryButton>
                                      <PrimaryButton
                                          type="submit"
                                          className="px-6 py-3"
                                          disabled={processing}
                                          color="green"
                                      >
                                          Simpan
                                      </PrimaryButton>
                                  </>
                              )}
                          </div>
                      </Card>
                  </form>
              </div>
          </div>
      </>
  );
}

export default Akun;