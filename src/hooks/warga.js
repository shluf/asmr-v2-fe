'use client'

import axios from '@/lib/axios';

export const fetchAkunData = async (setProfileWarga, setData, nikWarga) => {
  try {
    const response = await axios.get(`/api/profile-warga/${nikWarga}`);
    
    if (response.data.status === 'success') {
      const profileData = response.data.data;
      setProfileWarga(profileData);
      
      // Set data form
      setData({
        phone: profileData.user?.phone || '',
        alamat: profileData.user?.alamat || '',
        kabupaten: profileData.user?.kabupaten || '',
        provinsi: profileData.user?.provinsi || '',
        agama: profileData.user?.agama || '',
      });
      
      return profileData.jenis_kelamin || '';
    }
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return '';
  }
};

export const submitPengajuan = async (formData) => {
  try {
    const response = await axios.post('/api/pengajuan-surat', formData);
    
    if (response.data.status === 'success') {
      return { success: true, data: response.data };
    } else {
      return { success: false, message: response.data.message || 'Gagal mengirim pengajuan' };
    }
  } catch (error) {
    console.error('Error submitting application:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Terjadi kesalahan pada server',
      errors: error.response?.data?.errors || {}
    };
  }
};

export const fetchHistoryPengajuan = async (nikWarga) => {
  try {
    const response = await axios.get(`/api/history-pengajuan/${nikWarga}`);
    
    if (response.data.status === 'success') {
      return { success: true, data: response.data.data };
    } else {
      return { success: false, data: [], message: response.data.message };
    }
  } catch (error) {
    console.error('Error fetching history:', error);
    return { success: false, data: [], message: 'Gagal mengambil data riwayat' };
  }
};

export const fetchDashboardData = async (nikWarga) => {
  try {
    const response = await axios.get(`/api/dashboard-warga/${nikWarga}`);
    
    if (response.data.status === 'success') {
      return { success: true, data: response.data.data };
    } else {
      return { success: false, data: {}, message: response.data.message };
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return { success: false, data: {}, message: 'Gagal mengambil data dashboard' };
  }
}; 