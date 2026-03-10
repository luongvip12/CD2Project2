/**
 * Trang Thanh Toán - Đặt hàng
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Checkout: React.FC = () => {
    const { items, totalAmount, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [shippingName, setShippingName] = useState(user?.name || '');
    const [shippingPhone, setShippingPhone] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const formatPrice = (p: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;
        setError(''); setLoading(true);

        try {
            const payload = {
                items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
                shippingName,
                shippingPhone,
                shippingAddress,
                note,
            };

            await api.post('/orders', payload);
            clearCart();
            navigate('/my-orders');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Lỗi khi đặt hàng.');
        } finally { setLoading(false); }
    };

    if (items.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="max-w-5xl mx-auto py-16 px-4">
            <h1 className="text-4xl font-black uppercase mb-2">Thanh Toán</h1>
            <p className="text-gray-400 mb-10">Xác nhận thông tin giao hàng và đặt hàng</p>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Form thông tin */}
                    <div className="lg:col-span-2 space-y-6">
                        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium border border-red-100">{error}</div>}

                        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
                            <h3 className="text-xl font-black uppercase">Thông tin giao hàng</h3>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Họ tên người nhận <span className="text-red-500">*</span></label>
                                <input type="text" value={shippingName} onChange={e => setShippingName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all text-sm" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Số điện thoại <span className="text-red-500">*</span></label>
                                <input type="tel" value={shippingPhone} onChange={e => setShippingPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all text-sm" placeholder="0xxx xxx xxx" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Địa chỉ giao hàng <span className="text-red-500">*</span></label>
                                <textarea value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all text-sm resize-none" rows={3} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Ghi chú</label>
                                <textarea value={note} onChange={e => setNote(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all text-sm resize-none" rows={2} placeholder="VD: Giao giờ hành chính..." />
                            </div>
                        </div>

                        {/* Danh sách SP */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                            <h3 className="text-xl font-black uppercase mb-6">Sản phẩm đặt mua</h3>
                            <div className="space-y-4">
                                {items.map(item => (
                                    <div key={item.productId} className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            {item.image ? <img src={`/uploads/products/${item.image}`} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate">{item.name}</p>
                                            <p className="text-gray-400 text-xs">{formatPrice(item.price)} × {item.quantity}</p>
                                        </div>
                                        <p className="font-black text-sm">{formatPrice(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tổng */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm sticky top-28">
                            <h3 className="text-xl font-black uppercase mb-6">Tổng đơn hàng</h3>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Tạm tính</span><span className="font-bold">{formatPrice(totalAmount)}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Phí vận chuyển</span><span className="font-bold text-emerald-500">Miễn phí</span></div>
                                <hr className="my-4" />
                                <div className="flex justify-between"><span className="font-bold text-lg">Tổng cộng</span><span className="font-black text-xl text-red-600">{formatPrice(totalAmount)}</span></div>
                            </div>
                            <button type="submit" disabled={loading} className="block w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-center uppercase tracking-wider hover:bg-red-600 transition-all disabled:opacity-50">
                                {loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Checkout;
