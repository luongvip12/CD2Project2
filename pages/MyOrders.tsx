/**
 * Trang Đơn Hàng Của Tôi - Xem trạng thái đơn hàng
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

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
    created_at: string;
}

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: 'Chờ xác nhận', color: 'text-amber-600', bg: 'bg-amber-50' },
    confirmed: { label: 'Đã xác nhận', color: 'text-blue-600', bg: 'bg-blue-50' },
    shipping: { label: 'Đang giao', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    delivered: { label: 'Đã giao', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    cancelled: { label: 'Đã huỷ', color: 'text-red-600', bg: 'bg-red-50' },
};

const MyOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const formatPrice = (p: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
    const formatDate = (d: string) => new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get('/orders/my');
                setOrders(res.data.data.orders);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetch();
    }, []);

    if (loading) return <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div></div>;

    if (orders.length === 0) {
        return (
            <div className="max-w-4xl mx-auto py-20 px-4 text-center">
                <div className="text-6xl mb-6">📋</div>
                <h1 className="text-3xl font-black uppercase mb-4">Chưa có đơn hàng</h1>
                <p className="text-gray-400 mb-8">Bạn chưa đặt đơn hàng nào.</p>
                <Link to="/shop" className="inline-block px-8 py-3 bg-gray-900 text-white rounded-xl font-bold uppercase tracking-wider hover:bg-red-600 transition-all">Mua sắm ngay</Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-16 px-4">
            <h1 className="text-4xl font-black uppercase mb-2">Đơn Hàng Của Tôi</h1>
            <p className="text-gray-400 mb-10">{orders.length} đơn hàng</p>

            <div className="space-y-6">
                {orders.map(order => {
                    const st = statusMap[order.status] || statusMap.pending;
                    const isExpanded = expandedId === order.id;
                    return (
                        <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            {/* Header */}
                            <div className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors" onClick={() => setExpandedId(isExpanded ? null : order.id)}>
                                <div className="flex items-center gap-6">
                                    <div>
                                        <p className="text-xs text-gray-400 font-mono">Đơn hàng #{order.id}</p>
                                        <p className="text-sm text-gray-500 mt-1">{formatDate(order.created_at)}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${st.color} ${st.bg}`}>{st.label}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="font-black text-lg">{formatPrice(order.total_amount)}</p>
                                    <svg className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>

                            {/* Detail */}
                            {isExpanded && (
                                <div className="border-t border-gray-100 p-6">
                                    {/* Shipping info */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-sm">
                                        <div><span className="text-gray-400 block">Người nhận</span><span className="font-bold">{order.shipping_name}</span></div>
                                        <div><span className="text-gray-400 block">SĐT</span><span className="font-bold">{order.shipping_phone}</span></div>
                                        <div><span className="text-gray-400 block">Địa chỉ</span><span className="font-bold">{order.shipping_address}</span></div>
                                    </div>
                                    {order.note && <p className="text-sm text-gray-500 mb-6"><span className="font-bold">Ghi chú:</span> {order.note}</p>}
                                    {/* Items */}
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
        </div>
    );
};

export default MyOrders;
