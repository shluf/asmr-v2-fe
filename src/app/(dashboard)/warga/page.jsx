"use client";

import { useAuth } from '@/hooks/auth';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardContent from '@/components/Contents/Warga/DashboardContent';
import DashboardLayout from '@/components/Layout/DashboardLayout';

export default function WargaDashboard() {
    const { user } = useAuth({ middleware: 'auth' });
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Verifikasi role user untuk akses dashboard Warga
        if (user) {
            setIsLoading(false);
            if (user.role !== 'Warga') {
                router.push('/dashboard');
            }
        }
    }, [user, router]);

    // Jika masih loading atau user bukan Warga
    if (isLoading || !user) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (user.role !== 'Warga') {
        return null; // Akan di-redirect oleh useEffect
    }

    return (
        <DashboardLayout color={'green'}>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-6">Dashboard Warga</h1>
                <DashboardContent />
            </div>
        </DashboardLayout>
    );
} 