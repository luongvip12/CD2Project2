/**
 * Admin Order Management - Quản lý đơn hàng
 */
import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

interface OrderItem {
    id: number;
    product_name: string;
    product_image: string | null;
    price: number;
    quantity: number;
}

interface Order {
    id: number;
    total_amount: number;
    status: string;
    shipping_name: string;
    shipping_phone: string;
    shipping_address: string;
    note: string;
    items: OrderItem[];
    user: { id: number; name: string; email: string };
    created_at: string;
}

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: 'Chờ xác nhận', color: 'text-amber-600', bg: 'bg-amber-50' },
    confirmed: { label: 'Đã xác nhận', color: 'text-blue-600', bg: 'bg-blue-50' },
    shipping: { label: 'Đang giao', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    delivered: { label: 'Đã giao', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    cancelled: { label: 'Đã huỷ', color: 'text-red-600', bg: 'bg-red-50' },
};

const allStatuses = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];

const OrderManagement: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [successMsg, setSuccessMsg] = useState('');

    const formatPrice = (p: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
    const formatDate = (d: string) => new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const fetchOrders = useCallback(async () => {
        try {
            const res = await api.get('/orders');
            setOrders(res.data.data.orders);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);
    useEffect(() => { if (successMsg) { const t = setTimeout(() => setSuccessMsg(''), 3000); return () => clearTimeout(t); } }, [successMsg]);

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            setSuccessMsg(`Đơn hàng #${orderId} → ${statusMap[newStatus]?.label}`);
            fetchOrders();
        } catch (err: any) { alert(err.response?.data?.message || 'Lỗi cập nhật.'); }
    };

    if (loading) return <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div></div>;

    return (
        <div className="max-w-7xl mx-auto py-16 px-4">
            <h1 className="text-4xl font-black uppercase mb-2">Quản Lý Đơn Hàng</h1>
            <p className="text-gray-400 mb-10">{orders.length} đơn hàng</p>

            {successMsg && (
                <div className="bg-emerald-50 text-emerald-600 px-6 py-4 rounded-xl text-sm font-medium border border-emerald-100 mb-8 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {successMsg}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="text-center py-20 text-gray-400"><p className="text-lg">Chưa có đơn hàng nào.</p></div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => {
                        const st = statusMap[order.status] || statusMap.pending;
                        const isExpanded = expandedId === order.id;
                        return (
                            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="p-6 flex flex-wrap items-center gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors" onClick={() => setExpandedId(isExpanded ? null : order.id)}>
                                    <div className="flex-1 min-w-[200px]">
                                        <p className="text-xs text-gray-400 font-mono">#{order.id}</p>
                                        <p className="text-sm font-bold">{order.user?.name} <span className="text-gray-400 font-normal">({order.user?.email})</span></p>
                                        <p className="text-xs text-gray-400 mt-1">{formatDate(order.created_at)}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${st.color} ${st.bg}`}>{st.label}</span>
                                    <p className="font-black text-lg w-32 text-right">{formatPrice(order.total_amount)}</p>
                                    {/* Status dropdown (stop propagation so click doesn't toggle expand) */}
                                    <select
                                        value={order.status}
                                        onClick={e => e.stopPropagation()}
                                        onChange={e => handleStatusChange(order.id, e.target.value)}
                                        className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-700 focus:border-red-500 outline-none"
                                    >
                                        {allStatuses.map(s => <option key={s} value={s}>{statusMap[s].label}</option>)}
                                    </select>
                                    <svg className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                                {isExpanded && (
                                    <div className="border-t border-gray-100 p-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-sm">
                                            <div><span className="text-gray-400 block">Người nhận</span><span className="font-bold">{order.shipping_name}</span></div>
                                            <div><span className="text-gray-400 block">SĐT</span><span className="font-bold">{order.shipping_phone}</span></div>
                                            <div><span className="text-gray-400 block">Địa chỉ</span><span className="font-bold">{order.shipping_address}</span></div>
                                        </div>
                                        {order.note && <p className="text-sm text-gray-500 mb-6"><b>Ghi chú:</b> {order.note}</p>}
                                        <div className="space-y-3">
                                            {order.items.map(item => (
                                                <div key={item.id} className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                                        {item.product_image ? <img src={`/uploads/products/${item.product_image}`} alt={item.product_name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">📦</div>}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-sm truncate">{item.product_name}</p>
                                                        <p className="text-gray-400 text-xs">{formatPrice(item.price)} × {item.quantity}</p>
                                                    </div>
                                                    <p className="font-black text-sm">{formatPrice(item.price * item.quantity)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
