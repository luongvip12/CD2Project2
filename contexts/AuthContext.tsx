/**
 * AuthContext - Quản lý trạng thái đăng nhập
 * Cung cấp: user, token, login(), register(), logout()
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

// Kiểu dữ liệu User
interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

// Kiểu dữ liệu Context
interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
    isAdmin: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Hook để sử dụng AuthContext
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth phải được dùng bên trong AuthProvider');
    }
    return context;
};

/**
 * AuthProvider Component
 * Wrap toàn bộ ứng dụng để cung cấp auth state
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Khôi phục state từ localStorage khi load trang
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    /**
     * Đăng nhập
     */
    const login = useCallback(async (email: string, password: string) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { user: userData, token: newToken } = response.data.data;

            // Lưu vào state và localStorage
            setUser(userData);
            setToken(newToken);
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userData));

            return { success: true, message: 'Đăng nhập thành công!' };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Đăng nhập thất bại.';
            return { success: false, message };
        }
    }, []);

    /**
     * Đăng ký
     */
    const register = useCallback(async (name: string, email: string, password: string) => {
        try {
            const response = await api.post('/auth/register', { name, email, password });
            const { user: userData, token: newToken } = response.data.data;

            // Tự động đăng nhập sau khi đăng ký
            setUser(userData);
            setToken(newToken);
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userData));

            return { success: true, message: 'Đăng ký thành công!' };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Đăng ký thất bại.';
            return { success: false, message };
        }
    }, []);

    /**
     * Đăng xuất
     */
    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }, []);

    const value: AuthContextType = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin',
        isAuthenticated: !!user && !!token,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
