import { useRtRw } from '@/hooks/rtrw'
import InputError from '@/components/Atoms/InputError'
import InputLabel from '@/components/Atoms/InputLabel'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useState, useEffect } from 'react'

const RtRwSelects = ({ data, setData, errors }) => {
    const { rwList, getRtList, isRwLoading, isRtLoading } = useRtRw()
    const [rtOptions, setRtOptions] = useState([])
    const [selectedRwName, setSelectedRwName] = useState('')
    const [selectedRtName, setSelectedRtName] = useState('')

    useEffect(() => {
        if (data.id_rw && rwList.length > 0) {
            const selectedRw = rwList.find(rw => rw.id === data.id_rw)
            if (selectedRw) {
                setSelectedRwName(selectedRw.nama_rw)
            }
        }
    }, [rwList, data.id_rw])

    useEffect(() => {
        if (data.id_rw) {
            updateRtOptions(data.id_rw)
        }
    }, [data.id_rw])

    useEffect(() => {
        if (data.id_rt && rtOptions.length > 0) {
            const selectedRt = rtOptions.find(rt => rt.id === data.id_rt)
            if (selectedRt) {
                setSelectedRtName(selectedRt.nama_rt)
            }
        }
    }, [rtOptions, data.id_rt])

    const updateRtOptions = async selectedRw => {
        try {
            const rtData = await getRtList(selectedRw)
            setRtOptions(rtData.sort((a, b) => a - b))
        } catch (error) {
            setRtOptions([])
        }
    }

    const handleRwChange = value => {
        const selectedRw = rwList.find(rw => rw.id === value)
        setSelectedRwName(selectedRw?.nama_rw || '')
        setSelectedRtName('')
        setData('id_rw', value)
        setData('id_rt', '')

        if (value) {
            updateRtOptions(value)
        } else {
            setRtOptions([])
        }
    }

    const handleRtChange = value => {
        const selectedRt = rtOptions.find(rt => rt.id === value)
        setSelectedRtName(selectedRt?.nama_rt || '')
        setData('id_rt', value)
    }

    return (
        <>
            <div>
                <InputLabel htmlFor="id_rw" value="RW" />
                <Select onValueChange={handleRwChange} value={data.id_rw}>
                    <SelectTrigger
                        color="yellow"
                        id="id_rw"
                        name="id_rw"
                        disabled={isRwLoading}
                        required>
                        <SelectValue placeholder={isRwLoading ? 'Loading...' : 'Pilih RW'}>
                            {isRwLoading ? 'Loading...' : (selectedRwName || 'Pilih RW')}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {isRwLoading ? (
                            <p className="text-gray-500 text-sm text-center">Loading...</p>
                        ) : rwList.length > 0 ? (
                            rwList.map(rw => (
                                <SelectItem key={rw.id} value={rw.id}>
                                    {rw.nama_rw}
                                </SelectItem>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm text-center">
                                Tidak ada data RT
                            </p>
                        )}
                    </SelectContent>
                </Select>
                <InputError message={errors.id_rw} className="mt-1" />
            </div>
            <div>
                <InputLabel htmlFor="id_rt" value="RT" />
                <Select onValueChange={handleRtChange} value={data.id_rt}>
                    <SelectTrigger
                        color="yellow"
                        id="id_rt"
                        name="id_rt"
                        required
                        disabled={!data.id_rw || isRtLoading}>
                        <SelectValue placeholder={!data.id_rw ? 'Pilih RW' : (isRtLoading ? 'Loading...' : 'Pilih RT')}>
                            {isRtLoading ? 'Loading...' : (selectedRtName || 'Pilih RT')}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {isRtLoading ? (
                            <p className="text-gray-500 text-sm text-center">Loading...</p>
                        ) : rtOptions.length > 0 ? (
                            rtOptions.map(rt => (
                                <SelectItem key={rt.id} value={rt.id}>
                                    {rt.nama_rt}
                                </SelectItem>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm text-center">
                                Tidak ada data RT
                            </p>
                        )}
                    </SelectContent>
                </Select>
                <InputError message={errors.id_rt} className="mt-1" />
            </div>
        </>
    )
}

export default RtRwSelects
