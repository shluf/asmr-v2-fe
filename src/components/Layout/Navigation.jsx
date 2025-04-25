import React from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, History, User, HelpCircle, Users, UserCog, FileBarChart } from 'lucide-react';

// Fungsi untuk menampilkan navigasi berdasarkan role
const Navigation = ({ role, color = 'blue' }) => {
    const router = useRouter();
    
    // Menentukan kelas warna berdasarkan parameter color
    let colorClass = '';
    switch(color) {
        case 'green':
            colorClass = 'bg-emerald-700';
            break;
        case 'blue':
            colorClass = 'bg-blue-700';
            break;
        case 'red':
            colorClass = 'bg-red-700';
            break;
        case 'yellow':
            colorClass = 'bg-yellow-600';
            break;
        default:
            colorClass = 'bg-blue-700';
    }
    
    // Menu navigasi untuk masing-masing role
    const roleMenus = {
        'Admin': [
            { name: 'Dashboard', icon: <LayoutDashboard />, path: '/dashboard/admin' },
            { name: 'Kelola Akun', icon: <UserCog />, path: '/dashboard/admin/kelola-akun' },
            { name: 'Laporan', icon: <FileBarChart />, path: '/dashboard/admin/laporan' },
        ],
        'RW': [
            { name: 'Dashboard', icon: <LayoutDashboard />, path: '/dashboard/rw' },
            { name: 'Warga', icon: <Users />, path: '/dashboard/rw/warga' },
            { name: 'Pengajuan', icon: <FileText />, path: '/dashboard/rw/pengajuan' },
            { name: 'Akun', icon: <User />, path: '/dashboard/rw/akun' },
        ],
        'RT': [
            { name: 'Dashboard', icon: <LayoutDashboard />, path: '/dashboard/rt' },
            { name: 'Warga', icon: <Users />, path: '/dashboard/rt/warga' },
            { name: 'Pengajuan', icon: <FileText />, path: '/dashboard/rt/pengajuan' },
            { name: 'Akun', icon: <User />, path: '/dashboard/rt/akun' },
        ],
        'Warga': [
            { name: 'Dashboard', icon: <LayoutDashboard />, path: '/dashboard/warga' },
            { name: 'Pengajuan Surat', icon: <FileText />, path: '/dashboard/warga/pengajuan' },
            { name: 'Histori Pengajuan', icon: <History />, path: '/dashboard/warga/histori' },
            { name: 'Akun', icon: <User />, path: '/dashboard/warga/akun' },
            { name: 'Bantuan', icon: <HelpCircle />, path: '/dashboard/warga/bantuan' },
        ],
    };

    const handleNavigation = (path) => {
        router.push(path);
    };

    return (
        <div className={`p-4 sidebar text-white ${colorClass} w-64 fixed h-full overflow-auto`}>
            <div className="mb-8">
                <img src="/logo.png" alt="Logo" className="h-14 mx-auto" />
            </div>

            <div className="space-y-2">
                {(roleMenus[role] || []).map((menu, index) => (
                    <div
                        key={index}
                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-all hover:bg-white/10`}
                        onClick={() => handleNavigation(menu.path)}
                    >
                        <span className="mr-3">{menu.icon}</span>
                        <span>{menu.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Navigation; 