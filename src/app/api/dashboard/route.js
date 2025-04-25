import { NextResponse } from 'next/server';

// Mock data untuk contoh
const dashboardData = {
  admin: {
    stats: {
      totalUsers: 543,
      activeUsers: 498,
      pendingRequests: 27,
      rtCount: 12,
      rwCount: 3
    },
    recentActivities: [
      { id: 1, type: 'user_registered', name: 'Ahmad Fauzi', role: 'warga', date: '2023-12-28' },
      { id: 2, type: 'complaint_submitted', subject: 'Perbaikan Jalan', status: 'pending', date: '2023-12-27' },
      { id: 3, type: 'document_approved', name: 'Surat Domisili', requestedBy: 'Budi Santoso', date: '2023-12-26' },
    ]
  },
  
  rt: {
    stats: {
      totalWarga: 124,
      pendingRequests: 8,
      activeComplaints: 3,
      events: 2
    },
    recentActivities: [
      { id: 1, type: 'complaint_submitted', subject: 'Lampu Jalan Mati', status: 'pending', date: '2023-12-28' },
      { id: 2, type: 'document_requested', name: 'Surat Keterangan Usaha', requestedBy: 'Ani Wijaya', date: '2023-12-27' },
      { id: 3, type: 'warga_registered', name: 'Rini Suryani', date: '2023-12-25' },
    ]
  },
  
  rw: {
    stats: {
      totalRT: 12,
      totalWarga: 567,
      pendingPrograms: 4,
      completedPrograms: 15
    },
    recentActivities: [
      { id: 1, type: 'program_created', name: 'Kerja Bakti Lingkungan', date: '2023-12-29' },
      { id: 2, type: 'rt_report_submitted', rt: 'RT 03', subject: 'Laporan Bulanan', date: '2023-12-26' },
      { id: 3, type: 'complaint_escalated', subject: 'Drainase Tersumbat', rt: 'RT 05', date: '2023-12-24' },
    ]
  },
  
  warga: {
    stats: {
      pendingRequests: 1,
      completedRequests: 7,
      activeComplaints: 0,
      notifications: 3
    },
    recentActivities: [
      { id: 1, type: 'document_status', name: 'Surat Keterangan Domisili', status: 'approved', date: '2023-12-27' },
      { id: 2, type: 'event_announced', name: 'Rapat Warga RT 02', date: '2024-01-05', location: 'Balai RT' },
      { id: 3, type: 'complaint_status', subject: 'Sampah Menumpuk', status: 'resolved', date: '2023-12-20' },
    ]
  }
};

export async function GET(request) {
  try {
    // Dalam implementasi nyata, Anda akan mendapatkan token dari header 
    // dan memverifikasi role user dari token tersebut
    // Di sini kita simulasikan dengan menggunakan query parameter
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    
    if (!role || !['admin', 'rt', 'rw', 'warga'].includes(role)) {
      return NextResponse.json({ error: 'Role tidak valid' }, { status: 400 });
    }
    
    // Mengembalikan data dashboard sesuai role
    return NextResponse.json({ 
      success: true,
      data: dashboardData[role]
    });
    
  } catch (error) {
    console.error('Error pada dashboard API:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
} 