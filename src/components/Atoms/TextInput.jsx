import { forwardRef, useEffect, useRef, useState } from 'react'
import { Eye, EyeOff, Plus, Minus } from 'lucide-react' 

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, color="blue", controlNumber = false, pejabatNumber = false, ...props },
    ref,
) {
    const localRef = useRef(null)
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const isRadio = type === 'radio'
    const isNumber = type === 'number' && controlNumber === true
    const isPejabatNumber = pejabatNumber === true
    
    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus()
        }
    }, [isFocused])

    const inputRef = (element) => {
        localRef.current = element
        if (typeof ref === 'function') {
            ref(element)
        } else if (ref) {
            ref.current = element
        }
    }
    
    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev)
    }

    const triggerChange = (newValue) => {
        if (props.onChange) {
            const event = {
                target: {
                    name: props.name,
                    value: newValue,
                },
            }
            props.onChange(event)
        }
    }

    const incrementNumber = () => {
        const currentValue = parseInt(props.value)
        let newValueStr
        if (isNaN(currentValue)) {
            newValueStr = isPejabatNumber ? "001" : "1"
        } else {
            const newValue = currentValue + 1
            if (isPejabatNumber) {
                newValueStr = newValue.toString().padStart(3, '0')
            } else {
                newValueStr = newValue.toString()
            }
        }
        triggerChange(newValueStr)
    }
    
    const decrementNumber = () => {
        const currentValue = parseInt(props.value)
        let newValueStr
        if (!isNaN(currentValue) && currentValue > 0) {
            const newValue = currentValue - 1
            if (isPejabatNumber) {
                newValueStr = newValue.toString().padStart(3, '0')
            } else {
                newValueStr = newValue.toString()
            }
        } else {
            if (isPejabatNumber) {
                newValueStr = "000"
            } else {
                newValueStr = "0"
            }
        }
        triggerChange(newValueStr)
    }
    
    return (
        <div className={`relative ${isRadio ? 'w-fit' : 'w-full'}`}>
            <input
                {...props}
                type={isPassword && showPassword ? 'text' : type}
                className={
                    `rounded-md border-gray-300 shadow-sm focus:ring-${color} focus:border-${color} ${isPassword ? 'pr-10' : ''} ` +
                    className
                }
                ref={inputRef}
            />
            {isNumber && (
                <div className="absolute inset-y-0 right-0 flex items-center">
                <button
                    type="button"
                    className="flex items-center pr-3"
                    onClick={decrementNumber}
                    tabIndex="-1" 
                >
                    <Minus className="h-5 w-5 text-gray-400" />
                </button>
                <button
                    type="button"
                    className="flex items-center pr-3"
                    onClick={incrementNumber}
                    tabIndex="-1" 
                >
                    <Plus className="h-5 w-5 text-gray-400" />
                </button>
                </div>
            )}
            {isPassword && (
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={togglePasswordVisibility}
                    tabIndex="-1" 
                >
                    {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                    )}
                </button>
            )}
        </div>
    )
})