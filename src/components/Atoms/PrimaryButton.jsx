export default function PrimaryButton({
    className,
    disabled,
    color = 'red',
    rounded = 'md',
    variant = "default",
    children,
    ...props
}) {
    const getColorClasses = () => {
        const colorStyles = {
            green: {
                default: 'bg-green hover:bg-green-2 focus:bg-green-2 active:bg-green-800 focus:ring-green-500',
                outlined: 'border-green text-green hover:bg-green-50 focus:ring-green-500'
            },
            yellow: {
                default: 'bg-yellow-500 hover:bg-yellow focus:bg-yellow active:bg-yellow-2 focus:ring-yellow-500',
                outlined: 'border-yellow-500 text-yellow-500 hover:bg-yellow-50 focus:ring-yellow-500'
            },
            blue: {
                default: 'bg-blue hover:bg-blue-2 focus:bg-blue-2 active:bg-blue-800 focus:ring-blue-500',
                outlined: 'border-blue text-blue hover:bg-blue-50 focus:ring-blue-500'
            },
            red: {
                default: 'bg-red-600 hover:bg-red-700 focus:bg-red-700 active:bg-red-800 focus:ring-red-500',
                outlined: 'border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500'
            }
        }

        return colorStyles[color][variant]
    }

    return (
        <button
            {...props}
            className={`
                inline-flex items-center 
                rounded-${rounded} 
                px-4 py-2 
                text-xs 
                font-semibold 
                uppercase 
                tracking-widest 
                transition 
                duration-150 
                ease-in-out 
                focus:outline-none 
                focus:ring-2 
                focus:ring-offset-2
                justify-center
                md:w-fit w-full
                ${variant === 'default' ? 'border border-transparent text-white' : 'bg-transparent border-2'}
                ${getColorClasses()}
                ${disabled && 'opacity-25'} 
                ${className}
            `}
            disabled={disabled}
        >
            {children}
        </button>
    )
}