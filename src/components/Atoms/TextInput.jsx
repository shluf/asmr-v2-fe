import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react' 

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, color="blue", ...props },
    ref,
) {
    const localRef = useRef(null)
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    
    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }))
    
    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus()
        }
    }, [isFocused])
    
    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev)
    }
    
    return (
        <div className="relative w-full">
            <input
                {...props}
                type={isPassword && showPassword ? 'text' : type}
                className={
                    `rounded-md border-gray-300 shadow-sm focus:ring-${color} focus:border-${color} ${isPassword ? 'pr-10' : ''} ` +
                    className
                }
                ref={localRef}
            />
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