'use client'

import { useEffect } from 'react'
import axios from '@/lib/axios'
import { create } from 'zustand'

const useNotificationStore = create((set) => ({
  pageAdminRoutes: [
    { name: 'Dashboard', route: 'dashboard', icon: 'home' },
    { name: 'Biodata User', route: 'biodata-user', icon: 'linechart', notification: 0 },
    { name: 'Rekap Pengajuan Warga', route: 'rekap-pengajuan', icon: 'history', notification: 0 },
    { name: 'Approval Role', route: 'approval-role', icon: 'user', notification: 0 },
    { name: 'Kelola RT/RW', route: 'kelola-rtrw', icon: 'settings' }
  ],
  pageRTRWRoutes: [
    { name: 'Dashboard', route: 'dashboard', icon: 'home'},
    { name: 'Pengajuan Warga', jenis: 'surat', route: 'pengajuan-masalah', icon: 'user', notification: 0 },
    { name: 'Rekap Pengajuan', route: 'rekap-pengajuan', icon: 'history', notification: 0 },
    { name: 'Bantuan', route: 'bantuan', icon: 'settings' }
  ],
  pageWargaRoutes: [
    { name: 'Dashboard', route: 'dashboard', icon: 'home'},
    { name: 'Pengajuan', route: 'pengajuan', icon: 'file-up', notification: 0 },
    { name: 'Histori Pengajuan', jenis: 'surat', route: 'histori', icon: 'history', notification: 0 },
    { name: 'Akun', route: 'akun', icon: 'user' },
    { name: 'Bantuan', route: 'bantuan', icon: 'settings' }
  ],
  
  updateNotifications: (role, route, count) =>
    set((state) => {
      const routes = `page${role === "PejabatRT" || role === "PejabatRW" ? "RTRW" : role}Routes`
      if (!state[routes]) return state
     
      const updatedRoutes = state[routes].map(item =>
        item.route === route ? { ...item, notification: count } : item
      )
     
      return { [routes]: updatedRoutes }
    }),
  
  // Method untuk refresh notifikasi manual
  manualRefreshNotifications: async (role) => {
    try {
      const response = await axios.get('/api/notifications/count')
      const notifications = response.data
      
      set((state) => {
        const routes = `page${role === "PejabatRT" || role === "PejabatRW" ? "RTRW" : role}Routes`
        if (!state[routes]) return state

        const updatedRoutes = state[routes].map(item => {
          const matchingNotification = notifications.find(notif => notif.route === item.route)
          return matchingNotification 
            ? { ...item, notification: matchingNotification.count } 
            : item
        })

        return { [routes]: updatedRoutes }
      })

      return true // Berhasil refresh
    } catch (error) {
      return false // Gagal refresh
    }
  }
}))

const fetchNotifications = async () => {
  try {
    const response = await axios.get('/api/notifications/count')
    return response.data
  } catch (error) {
    return null
  }
}

export const useNotificationPolling = (role) => {
  const updateNotifications = useNotificationStore(state => state.updateNotifications)
 
  useEffect(() => {
    const pollNotifications = async () => {
      const notifications = await fetchNotifications()
      if (notifications) {
        notifications.forEach(({ route, count }) => {
          updateNotifications(role, route, count)
        })
      }
    }

    // Polling setiap 20 detik
    pollNotifications()
    const interval = setInterval(pollNotifications, 20000)
    return () => clearInterval(interval)
  }, [role])

  return useNotificationStore(state => state[`page${role === "PejabatRT" || role === "PejabatRW" ? "RTRW" : role}Routes`] || [])
}

// Hook untuk menggunakan refresh manual
export const useManualNotificationRefresh = () => {
  return useNotificationStore(state => state.manualRefreshNotifications)
}