const pageAdminRoutes = [
    { name: 'Dashboard', route: ''},
    { name: 'Biodata User', route: 'biodataUser'},
    { name: 'Rekapitulasi Pengajuan Surat', route: 'rekapPengajuan'},
    { name: 'Approval Role', route: 'approvalRole'},
    { name: 'Tambah RT/RW', route: 'tambahRTRW'}
]

const pageRTRWRoutes = [
    { name: 'Dashboard', route: ''},
    { name: 'Pengajuan Warga', route: 'pengajuanMasalah'},
    { name: 'Rekap Pengajuan', route: 'rekapPengajuan'},
    { name: 'Bantuan', route: 'bantuan'}
]

const pageWargaRoutes = [
    { name: 'Dashboard', route: ''},
    { name: 'Pengajuan', route: 'pengajuan'},
    { name: 'Histori Pengajuan', route: 'histori' },
    { name: 'Akun', route: 'akun'},
    { name: 'Bantuan', route: 'bantuan'}
]

export const renderHeader = (setHeader, user) => {
    const pathname = window.location.pathname;
    const userRole = user?.role?.toLowerCase() || "";
    
    if (pathname === `/${userRole}` || pathname === '/') {
        setHeader("Dashboard " + (user?.role || ""));
        return;
    }
    
    const checkRouteMatch = (route, role) => {
        if (route === '') {
            return pathname === `/${role}`;
        }
        return pathname === `/${role}/${route}` || pathname.startsWith(`/${role}/${route}/`);
    };
    
    switch (user?.role) {
        case "Admin":
            for (const data of pageAdminRoutes) {
                if (checkRouteMatch(data.route, "admin")) {
                    setHeader(data.name);
                    return;
                }
            }
            break;
            
        case "PejabatRT":
        case "PejabatRW":
            for (const data of pageRTRWRoutes) {
                if (checkRouteMatch(data.route, userRole)) {
                    setHeader(data.name);
                    return;
                }
            }
            break;
            
        case "Warga":
            for (const data of pageWargaRoutes) {
                if (checkRouteMatch(data.route, "warga")) {
                    setHeader(data.name);
                    return;
                }
            }
            break;
            
        default:
            setHeader("Aplikasi Surat Menyurat");
            break;
    }
    
    setHeader("Aplikasi Surat Menyurat");
}