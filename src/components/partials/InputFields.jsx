import React, { forwardRef } from 'react'
import TextInput from '../Atoms/TextInput'
import InputLabel from '../Atoms/InputLabel'
import InputError from '../Atoms/InputError'

const InputField = forwardRef(({
    label,
    id,
    type = "text",
    error,
    pejabatNumber,
    controlNumber,
    ...props
}, ref) => {
    return (
        <div>
            <InputLabel htmlFor={id} value={label} />
            <TextInput
                ref={ref}
                id={id}
                name={id}
                type={type}
                pejabatNumber={pejabatNumber}
                controlNumber={controlNumber}
                className="mt-1 block w-full"
                {...props}
            />
            <InputError message={error} className="mt-1" />
        </div>
    )
})

InputField.displayName = 'InputField'

export default InputField