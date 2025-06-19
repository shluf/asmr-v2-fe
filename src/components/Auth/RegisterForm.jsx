'use client'

import TextInput from '@/components/Atoms/TextInput'
import InputError from '@/components/Atoms/InputError'
import { useAuth } from '@/hooks/auth'
import { useState, useEffect } from 'react'
import { AlertWrapper, showAlert } from '@/components/partials/Alert'
import { useRouter, useSearchParams } from 'next/navigation'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import PrimaryButton from '../Atoms/PrimaryButton'
import RtRwSelects from './Partials/RtRwSelects'
import InputLabel from '../Atoms/InputLabel'

const RegisterForm = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirect = searchParams.get('redirect')
    
    const { register } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: redirect || '/dashboard',
    })

    const [focusedField, setFocusedField] = useState('nama')
    const [data, setData] = useState({
        nik: '',
        email: '',
        password: '',
        password_confirmation: '',
        id_rt: '',
        id_rw: '',
        nama: '',
        nomer_kk: '',
        jenis_kelamin: '',
        phone: '',
        tempat_lahir: '',       
        tanggal_lahir: '',       
        alamat: '',
        kabupaten: '',
        provinsi: '',
        agama: '',
    })
    const [errors, setErrors] = useState({})
    const [provinces, setProvinces] = useState([])
    const [regencies, setRegencies] = useState([])

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_REGION_API}/api/provinces.json`)
            .then(response => response.json())
            .then(provinces => setProvinces(provinces))
    }, [])

    const fetchRegencies = provinceId => {
        fetch(
            `${process.env.NEXT_PUBLIC_REGION_API}/api/regencies/${provinceId}.json`,
        )
            .then(response => response.json())
            .then(regencies => setRegencies(regencies))
    }

    const handleProvinceChange = value => {
        handleSetData('provinsi', value)
        handleSetData('kabupaten', '')
        const province = provinces.find(p => p.name === value)
        if (province) {
            fetchRegencies(province.id)
        }
    }

    const InputField = ({
        label,
        id,
        type = 'text',
        value,
        onChange,
        error,
        ...props
    }) => (
        <div>
            <InputLabel htmlFor={id}>{label}</InputLabel>
            <TextInput
                id={id}
                name={id}
                type={type}
                value={value}
                className="mt-1 block w-full"
                isFocused={focusedField === id ? true : false}
                onFocus={() => setFocusedField(id)}
                onChange={e => onChange(id, e.target.value)}
                color="yellow"
                {...props}
            />
            <InputError message={error} className="mt-1" />
        </div>
    )

    const handleSetData = (field, value) => {
        // console.log(field, value)
        setData(prev => ({
            ...prev,
            [field]: value,
        }))
    }

    const submitForm = async event => {
        event.preventDefault()

        const newErrors = {}

        if (data.nik && data.nik.length !== 16) {
            newErrors.nik = ['NIK harus terdiri dari 16 digit']
        }

        if (data.nomer_kk && data.nomer_kk.length !== 16) {
            newErrors.nomer_kk = ['Nomor KK harus terdiri dari 16 digit']
        }

        if (data.password && data.password.length < 8) {
            newErrors.password = ['Password minimal 8 karakter']
        }

        if (data.password !== data.password_confirmation) {
            newErrors.password_confirmation = ['Password konfirmasi tidak cocok']
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            showAlert({
                title: 'Gagal',
                desc: 'Registrasi gagal',
                message: 'Silahkan cek kembali data yang anda masukkan',
                success: false,
                color: 'red',
            })
            return
        }
        
        setErrors({})

        const status = await register({
            ...data,
            setErrors,
        })

        setData(prev => ({
            ...prev,
            password: '',
            password_confirmation: ''
        }))

        if (status === 200) {
            showAlert({
                title: "Berhasil",
                desc: "Registrasi berhasil",
                message: "Silahkan login menggunakan akun yang telah didaftarkan",
                success: true,
                color: "green",
                onConfirm: () => {
                    router.push('/login')
                }
            })
            
        } else {
            const errorMessage = errors.general ? errors.general[0] : "Silahkan cek kembali data yang anda masukkan"
            
            showAlert({
                title: "Gagal",
                desc: "Registrasi gagal",
                message: errorMessage,
                success: false,
                color: "red",
            })
        }
    }

    return (
        <>
            <AlertWrapper />
            <form
                onSubmit={submitForm}
                className="space-y-6 flex flex-col justify-center items-center">
                <div className="flex flex-col gap-6 justify-around items-center w-full">
                    <div className="grid grid-cols-1 gap-6 w-full max-w-2xl md:grid-cols-4">
                        <div className="md:col-span-2">
                            <InputField
                                label="Nama"
                                id="nama"
                                value={data.nama}
                                onChange={handleSetData}
                                error={errors.nama}
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <InputField
                                label="NIK"
                                id="nik"
                                type="number"
                                value={data.nik}
                                onChange={handleSetData}
                                error={errors.nik}
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <InputField
                                label="Nomor KK"
                                id="nomer_kk"
                                type="number"
                                value={data.nomer_kk}
                                onChange={handleSetData}
                                error={errors.nomer_kk}
                                required
                            />
                        </div>
                        <div className="md:col-span-2 grid md:grid-cols-9 gap-6">
                            <div className="md:col-span-4">
                                <InputField
                                    label="Tempat Lahir"
                                    id="tempat_lahir"
                                    type="text"
                                    value={data.tempat_lahir}
                                    onChange={handleSetData}
                                    error={errors.tempat_lahir}
                                    required
                                />
                            </div>
                            <div className='md:col-span-5'>
                                <InputLabel htmlFor="tanggal_lahir">Tanggal Lahir</InputLabel>
                                <TextInput
                                    id="tanggal_lahir"
                                    name="tanggal_lahir"
                                    type="date"
                                    value={data.tanggal_lahir}
                                    className="mt-1 block w-full"
                                    onChange={e => handleSetData('tanggal_lahir', e.target.value)}
                                    required
                                />
                                <InputError messages={errors.tanggal_lahir} className="mt-1" />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <InputLabel htmlFor="jenis_kelamin">
                                Jenis Kelamin
                            </InputLabel>
                            <Select
                                value={data.jenis_kelamin || ''}
                                onValueChange={value =>
                                    handleSetData('jenis_kelamin', value)
                                }>
                                <SelectTrigger
                                    id="jenis_kelamin"
                                    name="jenis_kelamin"
                                    required>
                                    <SelectValue>
                                        {data.jenis_kelamin
                                            ? data.jenis_kelamin
                                            : 'Jenis Kelamin'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Laki-Laki">Laki-laki</SelectItem>
                                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError
                                messages={errors.jenis_kelamin}
                                className="mt-1"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <InputLabel htmlFor="agama">Agama</InputLabel>
                            <Select
                                value={data.agama || ''}
                                onValueChange={value =>
                                    handleSetData('agama', value)
                                }>
                                <SelectTrigger id="agama" name="agama" required>
                                    <SelectValue>
                                        {data.agama || 'Agama'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Islam">Islam</SelectItem>
                                    <SelectItem value="Kristen">Kristen</SelectItem>
                                    <SelectItem value="Katolik">Katolik</SelectItem>
                                    <SelectItem value="Hindu">Hindu</SelectItem>
                                    <SelectItem value="Buddha">Buddha</SelectItem>
                                    <SelectItem value="Khonghucu">
                                        Khonghucu
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError messages={errors.agama} className="mt-1" />
                        </div>
                        <div className="md:col-span-2">
                            <InputLabel htmlFor="provinsi">Provinsi</InputLabel>
                            <Select
                                value={data.provinsi || ''}
                                onValueChange={handleProvinceChange}>
                                <SelectTrigger
                                    id="provinsi"
                                    name="provinsi"
                                    required>
                                    <SelectValue>
                                        {data.provinsi || 'Pilih Provinsi'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {provinces.map(province => (
                                        <SelectItem
                                            key={province.id}
                                            value={province.name}>
                                            {province.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError
                                messages={errors.provinsi}
                                className="mt-1"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <InputLabel htmlFor="kabupaten">Kabupaten</InputLabel>
                            <Select
                                value={data.kabupaten || ''}
                                onValueChange={value =>
                                    handleSetData('kabupaten', value)
                                }
                                disabled={!data.provinsi}>
                                <SelectTrigger
                                    id="kabupaten"
                                    name="kabupaten"
                                    required>
                                    <SelectValue>
                                        {data.kabupaten || 'Pilih Kabupaten'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {regencies.map(regency => (
                                        <SelectItem
                                            key={regency.id}
                                            value={regency.name}>
                                            {regency.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError
                                messages={errors.kabupaten}
                                className="mt-1"
                            />
                        </div>
                        <div className="md:col-span-2 md:grid-cols-2 gap-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <RtRwSelects
                                    data={data}
                                    setData={handleSetData}
                                    errors={errors}
                                    rtRwData={{}}
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <InputField
                                label="Nomor Telp"
                                id="phone"
                                type="tel"
                                pattern="08[0-9]*"
                                value={data.phone}
                                onChange={handleSetData}
                                error={errors.phone}
                                placeholder="08XXXXXXXXX"
                                required
                            />
                        </div>
                        <div className="md:col-span-4">
                            <InputField
                                label="Alamat"
                                id="alamat"
                                value={data.alamat}
                                onChange={handleSetData}
                                error={errors.alamat}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 w-full gap-6 max-w-2xl">
                        <InputField
                            label="Email"
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={handleSetData}
                            error={errors.email}
                            required
                        />
                        <InputField
                            label="Password"
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={handleSetData}
                            error={errors.password}
                            required
                        />
                        <InputField
                            label="Konfirmasi Password"
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={handleSetData}
                            error={errors.password_confirmation}
                            required
                        />
                    </div>

                    <div className="flex items-center justify-center mt-6">
                        <PrimaryButton
                            className="w-full md:w-auto px-6 py-3"
                            color={'yellow'}
                            type="submit">
                            Registrasi
                        </PrimaryButton>
                    </div>
                </div>
            </form>
        </>
    )
}

export default RegisterForm
