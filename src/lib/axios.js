import Axios from 'axios'

// Buat instance axios baru
const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    withCredentials: true // Penting untuk mengirim cookie dengan request
})

// Debug baseURL
console.log('Axios baseURL:', process.env.NEXT_PUBLIC_BACKEND_URL)

// Fungsi cek apakah kode berjalan di browser atau server
const isBrowser = () => typeof window !== 'undefined'

// Fungsi untuk mendapatkan token dari cookie
const getTokenFromCookie = () => {
    if (!isBrowser()) return null
    
    return document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]
}

// Fungsi untuk mendapatkan CSRF token dari cookie
const getXsrfTokenFromCookie = () => {
    if (!isBrowser()) return null
    
    return document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1]
}

// Add request interceptor for token and XSRF-TOKEN
axios.interceptors.request.use(config => {
    // Hanya berjalan di browser
    if (isBrowser()) {
        // Log URL request untuk debugging
        console.log(`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`)
        
        // Log request data (tetapi jangan log password)
        if (config.data && typeof config.data === 'object') {
            const logData = { ...config.data };
            if (logData.password) logData.password = '[REDACTED]';
            console.log('Request data:', logData);
        } else {
            console.log('Request data:', config.data);
        }
        
        // Clean up headers for logging
        const headersLog = { ...config.headers };
        if (headersLog.Authorization) headersLog.Authorization = 'Bearer [REDACTED]';
        console.log('Request headers:', headersLog);
        
        // Set auth token jika ada
        const authToken = getTokenFromCookie()
        if (authToken) {
            config.headers['Authorization'] = `Bearer ${authToken}`
            console.log('Adding auth token to request')
        }
        
        // Set CSRF token jika ada
        const xsrfToken = getXsrfTokenFromCookie()
        if (xsrfToken) {
            config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken)
            console.log('Adding XSRF token to request')
        }
    }
    
    return config
}, error => {
    return Promise.reject(error)
})

// Response interceptor for errors and CSRF handling
axios.interceptors.response.use(
    response => {
        // Log successful responses untuk debugging
        if (isBrowser()) {
            console.log(`Response from ${response.config.url}:`, response.status)
            console.log('Response data:', response.data)
            
            // Jangan tampilkan semua header di log
            const relevantHeaders = {
                'content-type': response.headers['content-type'],
                'set-cookie': response.headers['set-cookie'] ? '[PRESENT]' : '[NOT PRESENT]',
            };
            console.log('Response headers (filtered):', relevantHeaders)
            
            // Jika login berhasil, simpan info
            if (response.config.url.includes('/api/login') && response.data && response.data.token) {
                console.log('LOGIN SUCCESS: Token received and user authenticated');
            }
        }
        return response
    },
    async error => {
        if (!isBrowser()) return Promise.reject(error)
        
        const originalRequest = error.config
        
        // Jika error 419 (CSRF token expired) dan belum mencoba lagi
        if (error.response?.status === 419 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                console.log('CSRF token expired, refreshing...')
                // Ambil CSRF token baru dan coba lagi request
                await axios.get('/sanctum/csrf-cookie')
                console.log('CSRF token refreshed, retrying request')
                return axios(originalRequest)
            } catch (e) {
                console.error('Error refreshing CSRF token:', e)
                return Promise.reject(e)
            }
        }
        
        // Log error untuk debugging
        if (error.response) {
            console.error('Response Error:', error.response.status, error.response.data)
            console.error('Request URL:', originalRequest.baseURL + originalRequest.url)
            console.error('Request Method:', originalRequest.method)
            
            // Clean up headers for logging
            const headersLog = { ...originalRequest.headers };
            if (headersLog.Authorization) headersLog.Authorization = 'Bearer [REDACTED]';
            console.error('Request Headers:', headersLog)
            
            // Clean up data for logging
            if (originalRequest.data && typeof originalRequest.data === 'object') {
                try {
                    const logData = { ...JSON.parse(originalRequest.data) };
                    if (logData.password) logData.password = '[REDACTED]';
                    console.error('Request Data:', logData);
                } catch (e) {
                    console.error('Request Data:', originalRequest.data);
                }
            } else {
                console.error('Request Data:', originalRequest.data);
            }
        } else if (error.request) {
            console.error('Request Error (No Response):', error.request)
        } else {
            console.error('Axios Error:', error.message)
        }
        
        return Promise.reject(error)
    }
)

export default axios
