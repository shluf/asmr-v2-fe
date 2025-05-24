import TextInput from "@/Components/Atoms/TextInput";
import { Textarea } from "@/Components/ui/textarea";

export const DataField = ({
    label,
    name,
    value,
    textarea = false,
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
                ></Textarea>
            ) : (
                <TextInput
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full"
                />
            )}
        </div>
    </div>
);
