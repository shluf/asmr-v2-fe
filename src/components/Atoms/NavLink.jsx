'use client'

import Link from 'next/link'

export default function NavLink({
    active = false,
    className = '',
    color,
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                `flex items-center gap-3 px-3 py-4 transition-all font-bold` +
                (active
                    ? `border-l-4 border-${color} bg-${color} text-white hover:text-white hover:border-l-8`
                    : `text-black hover:text-${color} hover:border-l-4 hover:border-${color}`) +
                className
            }
        >
            {children}
        </Link>
    )
}
