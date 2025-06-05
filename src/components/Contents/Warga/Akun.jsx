'use client'

import InputLabel from '@/components/Atoms/InputLabel'
import PrimaryButton from '@/components/Atoms/PrimaryButton'
import { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import { PenSquare, User2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { fetchAkunData } from '@/hooks/warga'
import { showAlert } from '@/components/partials/Alert'

const Akun = ({ nikWarga }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [ttLahir, setTtLahir] = useState(null);
  const [profileWarga, setProfileWarga] = useState({
    user: {},
    warga: {
      rt: {
        rw: {}
      },
    }
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
    const ttl = await fetchAkunData(setProfileWarga, setData, nikWarga);
    setTtLahir(ttl);
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
        const response = await axios.put(`/api/profile/`, data);
        if (response.data.user) {
            console.log(response.data.warga);
            setProfileWarga((prevState) => ({
                ...prevState,
                user: {
                    ...prevState.user,
                    phone: response.data.warga.phone,
                    alamat: response.data.warga.alamat,
                    kabupaten: response.data.warga.kabupaten,
                    provinsi: response.data.warga.provinsi,
                    agama: response.data.warga.agama,
                },
            }));

            showAlert({
                title: "Berhasil!",
                desc: "Profil warga berhasil diperbarui.",
                message: "Data profil telah diperbarui dengan sukses.",
                success: true,
                color: "green",
            });

            setIsEditMode(false);
        }
    } catch (error) {
        showAlert({
            title: "Terjadi Kesalahan",
            desc: error.message,
            message: "Gagal memperbarui profil warga.",
            success: false,
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
                                      defaultValue={profileWarga.warga.nama}
                                      readOnly={!isEditMode}
                                  />
                              </div>
                              <div className="space-y-2">
                                  <InputLabel htmlFor="nik">NIK</InputLabel>
                                  <Input
                                      className="focus:ring-green focus:border-green active:ring-green focus:ring-2"
                                      id="nik"
                                      defaultValue={profileWarga.warga.nik}
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
                                          ttLahir
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
                                      defaultValue={profileWarga.warga.jenis_kelamin}
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
                                          defaultValue={profileWarga.warga.rt.nama_rt}
                                          disabled={isEditMode}
                                          readOnly={true}
                                      />
                                  </div>
                                  <div className="space-y-2">
                                      <InputLabel htmlFor="rw">RW</InputLabel>
                                      <Input
                                          className="focus:ring-green focus:border-green active:ring-green focus:ring-2"
                                          id="rw"
                                          defaultValue={profileWarga.warga.rt.rw.nama_rw}
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
                                      defaultValue={profileWarga.warga.nomor_kk}
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
                                      defaultValue={profileWarga.warga.agama}
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