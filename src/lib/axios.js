import Axios from 'axios'

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    withCredentials: true
})

const getCookie = (name) => {
    if (typeof document === 'undefined') return null
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? match[2] : null
}

axios.interceptors.request.use(config => {
    const authToken = getCookie('auth_token')
    if (authToken) {
        config.headers['Authorization'] = `Bearer ${authToken}`
    }
    const xsrfToken = getCookie('XSRF-TOKEN')
    if (xsrfToken) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken)
    }
    return config
}, error => Promise.reject(error))

axios.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config
        if (error.response?.status === 419 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                await axios.get('/sanctum/csrf-cookie')
                return axios(originalRequest)
            } catch (e) {
                return Promise.reject(e)
            }
        }
        return Promise.reject(error)
    }
)

export default axios
