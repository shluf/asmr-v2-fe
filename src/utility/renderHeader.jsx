const pageAdminRoutes = [
    { name: 'Dashboard', route: ''},
    { name: 'Biodata User', route: 'biodata-user'},
    { name: 'Rekapitulasi Pengajuan Surat', route: 'rekap-pengajuan'},
    { name: 'Approval Role', route: 'approval-role'},
    { name: 'Tambah RT/RW', route: 'tambah-rtrw'}
]

const pageRTRWRoutes = [
    { name: 'Dashboard', route: ''},
    { name: 'Pengajuan Warga', route: 'pengajuan-masalah'},
    { name: 'Rekap Pengajuan', route: 'rekap-pengajuan'},
    { name: 'Bantuan', route: 'bantuan'}
]

const pageWargaRoutes = [
    { name: 'Dashboard', route: ''},
    { name: 'Pengajuan Surat', route: 'pengajuan'},
    { name: 'Histori Pengajuan', route: 'histori'},
    { name: 'Akun', route: 'akun'},
    { name: 'Bantuan', route: 'bantuan'}
]

export const renderHeader = (setHeader, user) => {
    const pathname = window.location.pathname
    const actualUserRole = user?.role
    let userDisplayRole

    if (actualUserRole === "PejabatRT") {
        userDisplayRole = "RT"
    } else if (actualUserRole === "PejabatRW") {
        userDisplayRole = "RW"
    } else {
        userDisplayRole = actualUserRole
    }
    
    if (userDisplayRole && (pathname === `/${userDisplayRole.toLowerCase()}` || pathname === '/')) {
        setHeader("Dashboard " + userDisplayRole)
        return
    }
    
    const checkRouteMatch = (route, role) => {
        if (route === '') {
            return pathname === `/${role}`
        }
        return pathname === `/${role}/${route}` || pathname.startsWith(`/${role}/${route}/`)
    }
    
    switch (actualUserRole) {
        case "Admin":
            for (const data of pageAdminRoutes) {
                if (checkRouteMatch(data.route, "admin")) {
                    setHeader(data.name)
                    return
                }
            }
            break
            
        case "PejabatRT":
        case "PejabatRW":
            for (const data of pageRTRWRoutes) {
                if (checkRouteMatch(data.route, userDisplayRole.toLowerCase())) {
                    setHeader(data.name)
                    return
                }
            }
            break
            
        case "Warga":
            for (const data of pageWargaRoutes) {
                if (checkRouteMatch(data.route, "warga")) {
                    setHeader(data.name)
                    return
                }
            }
            break
            
        default:
            setHeader("Aplikasi Surat Menyurat")
            break
    }
}