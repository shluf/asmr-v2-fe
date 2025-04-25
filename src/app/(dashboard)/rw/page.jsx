"use client";

import { useAuth } from '@/hooks/auth';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardContent from '@/components/Contents/RW/DashboardContent';
import DashboardLayout from '@/components/Layout/DashboardLayout';

export default function RWDashboard() {
    const { user } = useAuth({ middleware: 'auth' });
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Verifikasi role user untuk akses dashboard RW
        if (user) {
            setIsLoading(false);
            if (user.role !== 'PejabatRW') {
                router.push('/dashboard');
            }
        }
    }, [user, router]);

    // Jika masih loading atau user bukan RW
    if (isLoading || !user) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (user.role !== 'PejabatRW') {
        return null; // Akan di-redirect oleh useEffect
    }

    return (
        <DashboardLayout color={'yellow'}>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-6">Dashboard RW</h1>
                <DashboardContent idRW={user?.id_rw} />
            </div>
        </DashboardLayout>
    );
} 