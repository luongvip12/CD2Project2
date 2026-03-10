/**
 * Admin Dashboard - Thống kê tổng quan
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

interface Stats {
    totalUsers: number;
    totalProducts: number;
    totalCategories: number;
    totalOrders: number;
    ordersByStatus: {
        pending: number;
        confirmed: number;
        shipping: number;
        delivered: number;
        cancelled: number;
    };
}

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard/stats');
                setStats(res.data.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div></div>;

    const cards = [
        { label: 'Người dùng', value: stats?.totalUsers || 0, icon: '👥', color: 'from-blue-500 to-blue-600', link: '#' },
        { label: 'Sản phẩm', value: stats?.totalProducts || 0, icon: '📦', color: 'from-emerald-500 to-emerald-600', link: '/admin/products' },
        { label: 'Danh mục', value: stats?.totalCategories || 0, icon: '📁', color: 'from-purple-500 to-purple-600', link: '/admin/categories' },
        { label: 'Đơn hàng', value: stats?.totalOrders || 0, icon: '🛒', color: 'from-orange-500 to-orange-600', link: '/admin/orders' },
    ];

    const orderStatuses = stats ? [
        { label: 'Chờ xác nhận', value: stats.ordersByStatus.pending, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Đã xác nhận', value: stats.ordersByStatus.confirmed, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Đang giao', value: stats.ordersByStatus.shipping, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Đã giao', value: stats.ordersByStatus.delivered, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Đã huỷ', value: stats.ordersByStatus.cancelled, color: 'text-red-600', bg: 'bg-red-50' },
    ] : [];

    return (
        <div className="max-w-7xl mx-auto py-16 px-4">
            <h1 className="text-4xl font-black uppercase mb-2">Admin Dashboard</h1>
            <p className="text-gray-400 mb-10">Tổng quan hệ thống</p>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-3 mb-10">
                <Link to="/admin/products" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-red-600 transition-all">📦 Quản lý Sản phẩm</Link>
                <Link to="/admin/categories" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-red-600 transition-all">📁 Quản lý Danh mục</Link>
                <Link to="/admin/orders" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-red-600 transition-all">🛒 Quản lý Đơn hàng</Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {cards.map(card => (
                    <Link to={card.link} key={card.label} className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-3xl">{card.icon}</span>
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center opacity-20 group-hover:opacity-100 transition-all`}>
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </div>
                        </div>
                        <p className="text-3xl font-black text-gray-900">{card.value}</p>
                        <p className="text-sm text-gray-400 mt-1">{card.label}</p>
                    </Link>
                ))}
            </div>

            {/* Order Status Breakdown */}
            {stats && (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                    <h3 className="text-xl font-black uppercase mb-6">Trạng thái đơn hàng</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                        {orderStatuses.map(s => (
                            <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
                                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                                <p className="text-xs text-gray-500 mt-1 font-bold">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
