'use client'

import Link from 'next/link';

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
                `flex items-center gap-3 px-3 py-4 transition-all hover:text-${color} ` +
                (active
                    ? `border-l-4 border-${color} bg-muted text-${color}`
                    : 'text-muted-foreground') +
                className
            }
        >
            {children}
        </Link>
    );
}
