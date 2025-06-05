import TextInput from "@/Components/Atoms/TextInput"
import { Textarea } from "@/Components/ui/textarea"

export const DataField = ({
    label,
    name,
    value,
    type = "text",
    textarea = false,
    period = false,
    file = false,
    accept = "",
    onChange,
}) => (
    <div className="grid grid-cols-4 items-center gap-4">
        <span className="font-semibold">{label}</span>
        <div className="col-span-3 flex items-center gap-2">
            <div>:</div>
            {textarea ? (
                <Textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    color="blue"
                    className="w-full"
                 />
            ) : period ? (
                <div className="flex items-center gap-2">
                    <TextInput type="number" name={name.mulai} value={value.mulai} onChange={onChange.mulai} className="w-full" />
                    <span className="text-sm text-gray-500">-</span>
                    <TextInput type="number" name={name.selesai} value={value.selesai} onChange={onChange.selesai} className="w-full" />
                </div>
            ) : file ? (
                <input 
                    type="file" 
                    name={name} 
                    onChange={onChange}
                    className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-gray-50 file:text-gray-700
                    hover:file:bg-gray-100
                    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                    accept={accept}
                />
            ) : (
                <TextInput
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full"
                    type={type}
                />
            )}
        </div>
    </div>
)
