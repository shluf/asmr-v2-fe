'use client'

import {
    Home,
    LineChart,
    Settings,
    ShoppingCart,
    User,
    ShieldCheck,
    History,
    FileUp,
    CirclePlus,
    Pencil,
    CircleMinus,
} from "lucide-react"
import { UserFilled } from "./svg-icons"

const renderIcon = (keyword, size = 4) => {
    switch (keyword) {
        case "home":
            return <Home className={`h-${size} w-${size}`} />
        case "settings":
            return <Settings className={`h-${size} w-${size}`} />
        case "user":
            return <User className={`h-${size} w-${size}`} />
        case "user-filled":
            return <UserFilled className={`h-${size} w-${size}`} />
        case "linechart":
            return <LineChart className={`h-${size} w-${size}`} />
        case "shoppingchart":
            return <ShoppingCart className={`h-${size} w-${size}`} />
        case "shield-check":
            return <ShieldCheck className={`h-${size} w-${size}`} />
        case "history":
            return <History className={`h-${size} w-${size}`} />
        case "file-up":
            return <FileUp className={`h-${size} w-${size}`} />
        case "circle-minus":
            return <CircleMinus className={`h-${size} w-${size}`} />
        case "circle-plus":
            return <CirclePlus className={`h-${size} w-${size}`} />
        case "pencil":
            return <Pencil className={`h-${size} w-${size}`} />
        default:
            return null
    }
}

export default renderIcon
