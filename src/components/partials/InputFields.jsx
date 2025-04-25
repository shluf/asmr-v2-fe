import React, { useState } from 'react';
import TextInput from '../TextInput';
import InputLabel from '../InputLabel';
import InputError from '../InputError';

const InputField = ({
    label,
    id,
    type = "text",
    value,
    onChange,
    error,
    ...props
}) => {
    const [focusedField, setFocusedField] = useState("nama");
    
    return (
        <div>
            <InputLabel htmlFor={id} value={label} />
            <TextInput
                id={id}
                name={id}
                type={type}
                value={value}
                className="mt-1 block w-full"
                isFocused={focusedField === id}
                onFocus={() => setFocusedField(id)}
                onChange={(e) => onChange(id, e.target.value)}
                {...props}
            />
            <InputError message={error} className="mt-1" />
        </div>
    );
};

export default InputField