"use client";

import { useAuth } from '@/hooks/auth';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HistoriPengajuan from '@/components/Contents/Warga/HistoriPengajuan';

export default function HistoriPage() {
    const { user } = useAuth({ middleware: 'auth' });
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setIsLoading(false);
            if (user.role !== 'Warga') {
                router.push('/dashboard');
            }
        }
    }, [user, router]);

    if (isLoading || !user) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (user.role !== 'Warga') {
        return null;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Histori Pengajuan</h1>
            <HistoriPengajuan nikWarga={user?.nik} />
        </div>
    );
} 