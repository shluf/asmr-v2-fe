"use client";

import { useAuth } from '@/hooks/auth';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TambahRTRW from "@/components/Contents/Admin/TambahRTRW";
import DashboardLayout from "@/components/Layout/DashboardLayout";

export default function TambahRTRWPage() {
    const { user } = useAuth({ middleware: 'auth' });
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Verifikasi role user untuk akses dashboard Admin
        if (user) {
            setIsLoading(false);
            if (user.role !== 'Admin') {
                router.push('/dashboard');
            }
        }
    }, [user, router]);

    // Jika masih loading atau user bukan admin
    if (isLoading || !user) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (user.role !== 'Admin') {
        return null; // Akan di-redirect oleh useEffect
    }

    return (
        <DashboardLayout color={"blue"}>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-6">Tambah RT/RW</h1>
                <TambahRTRW />
            </div>
        </DashboardLayout>
    );
} 