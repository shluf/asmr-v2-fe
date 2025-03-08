'use client'

import TextInput from '@/components/Atom/TextInput'
import InputError from '@/components/Atom/InputError'
import { useAuth } from '@/hooks/auth'
import { useState, useEffect } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import PrimaryButton from '../Atom/PrimaryButton'
import RtRwSelects from './Partials/RtRwSelects'
import InputLabel from '../Atom/InputLabel'

const RegisterForm = () => {
    const { register } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [focusedField, setFocusedField] = useState('nama')
    const [data, setData] = useState({
        nik_warga: '',
        email: '',
        password: '',
        password_confirmation: '',
        id_rt: '',
        id_rw: '',
        nama: '',
        nomer_kk: '',
        jenis_kelamin: '',
        phone: '',
        tempat_dan_tanggal_lahir: '',
        alamat: '',
        kabupaten: '',
        provinsi: '',
        agama: '',
    })
    const [errors, setErrors] = useState([])
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
            <InputError messages={error} className="mt-1" />
        </div>
    )

    const handleSetData = (field, value) => {
        setData(prev => ({
            ...prev,
            [field]: value,
        }))
    }

    const submitForm = event => {
        event.preventDefault()

        register({
            ...data,
            setErrors,
        })
    }

    return (
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
                            id="nik_warga"
                            type="number"
                            value={data.nik_warga}
                            onChange={handleSetData}
                            error={errors.nik_warga}
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
                    <div className="md:col-span-2">
                        <InputField
                            label="Tempat, tgl lahir"
                            id="tempat_dan_tanggal_lahir"
                            value={data.tempat_dan_tanggal_lahir}
                            onChange={handleSetData}
                            error={errors.tempat_dan_tanggal_lahir}
                            required
                        />
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
                                        ? data.jenis_kelamin === 'L'
                                            ? 'Laki-laki'
                                            : 'Perempuan'
                                        : 'Jenis Kelamin'}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="L">Laki-laki</SelectItem>
                                <SelectItem value="P">Perempuan</SelectItem>
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
    )
}

export default RegisterForm
