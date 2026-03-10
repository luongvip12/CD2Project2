/**
 * API Service - Axios instance với JWT interceptor
 * Tự động gắn token vào header Authorization
 */
import axios from 'axios';

// Tạo axios instance
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Tự động gắn JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - Xử lý lỗi 401 (token hết hạn)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token hết hạn hoặc không hợp lệ → logout
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirect về login nếu không phải trang login
            if (!window.location.hash.includes('/login')) {
                window.location.hash = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
