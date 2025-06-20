'use client'

import ApplicationLogo from "@/components/Atoms/ApplicationLogo"
import SideBar from "@/components/partials/SideBar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { renderHeader } from "@/utility/renderHeader"
import { useAuth } from "@/hooks/auth"
import {
    LucideCircleUserRound,
} from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuthTokenClient } from "@/lib/jwt"
import { AlertWrapper } from "@/components/partials/Alert"
import Loading from "@/components/partials/Loading"

const DashboardLayout = ({
    children,
}) => {
    const { user, logout } = useAuth({ middleware: 'auth' })
    const [header, setHeader] = useState("")
    const [role, setRole] = useState("")
    const [color, setColor] = useState("")
    const pathname = usePathname()
    const authTokenClient = useAuthTokenClient()
    const payload = authTokenClient?.payload
    
    useEffect(() => {
        if (user) {
            setRole(user.role || "")
            setColor(user.role === "Warga" ? "green" : user.role === "PejabatRT" ? "yellow" : user.role === "PejabatRW" ? "orange" : "blue")
        }
    }, [user])

    useEffect(() => {
        renderHeader(setHeader, user)
    }, [pathname])

    if (!user) {
        return <Loading />
    }

    return (
        <>
            <AlertWrapper />
            <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">

                <SideBar color={color} userRole={user.role} />

                <div className="flex flex-col overflow-hidden">
                    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 mt-2 lg:h-[60px] lg:px-6">

                        <div className="flex md:hidden h-14 justify-center items-center px-4">
                            <Link href="/">
                                <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                            </Link>
                        </div>

                        <div className="w-full flex-1">
                            <h1 id="header-title" className="hidden sm:block text-lg font-semibold md:text-2xl">
                                {header}
                            </h1>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    id="profile-button"
                                    variant="secondary"
                                    size="icon"
                                    className={`group rounded-full text-${color} mb-2 focus-visible:ring-${color}`}
                                >
                                    <div className="relative">
                                        <div className={`relative w-10 h-10 rounded-full p-1 border-[3px] border-${color}`}>
                                            <LucideCircleUserRound className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-20 w-20" />
                                        <div className={`absolute -bottom-2 group-hover:-bottom-1 left-1/2 transform transition-all -translate-x-1/2 bg-${color} text-white px-3 rounded-full text-[8px] font-medium`}>
                                            {role}
                                        </div>
                                        </div>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>{payload?.name || payload?.role || user?.name || 'User'}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {user.role === "Warga" &&
                                    <Link href="/warga/akun">
                                        <DropdownMenuItem className="cursor-pointer" >
                                            Profile
                                        </DropdownMenuItem>
                                    </Link>
                                }
                                {user.role !== "Admin" &&
                                    <Link href={`/${user.role === "PejabatRT" ? "rt" : user.role === "PejabatRW" ? "rw" : user.role.toLowerCase()}/bantuan`}>
                                        <DropdownMenuItem className="cursor-pointer">
                                            Bantuan
                                        </DropdownMenuItem>
                                    </Link>
                                }
                                <DropdownMenuSeparator />
                                <DropdownMenuItem id="logout-button" onClick={logout} className="cursor-pointer">
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </header>
                    <main className="flex-1 pb-14 md:p-4 lg:p-6 overflow-auto">
                        {children}
                    </main>
                </div>
            </div>
        </>
    )
}

export default DashboardLayout