"use client";

import { useAuth } from '@/hooks/auth';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RekapPengajuan from '@/components/Contents/RT/RekapPengajuan';
import DashboardLayout from '@/components/Layout/DashboardLayout';

export default function RekapPengajuanPage() {
    const { user } = useAuth({ middleware: 'auth' });
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Verifikasi role user untuk akses dashboard RT
        if (user) {
            setIsLoading(false);
            if (user.role !== 'RT') {
                router.push('/dashboard');
            }
        }
    }, [user, router]);

    // Jika masih loading atau user bukan RT
    if (isLoading || !user) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (user.role !== 'RT') {
        return null; // Akan di-redirect oleh useEffect
    }

    return (
        <DashboardLayout color={'yellow'}>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-6">Rekap Pengajuan</h1>
                <RekapPengajuan idRT={user?.id_rt} />
            </div>
        </DashboardLayout>
    );
} 