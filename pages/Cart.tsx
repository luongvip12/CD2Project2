/**
 * Trang Giỏ Hàng - Chi tiết giỏ hàng
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Cart: React.FC = () => {
    const { items, removeFromCart, updateQuantity, totalItems, totalAmount } = useCart();
    const { isAuthenticated } = useAuth();

    const formatPrice = (p: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

    if (items.length === 0) {
        return (
            <div className="max-w-4xl mx-auto py-20 px-4 text-center">
                <div className="text-6xl mb-6">🛒</div>
                <h1 className="text-3xl font-black uppercase mb-4">Giỏ hàng trống</h1>
                <p className="text-gray-400 mb-8">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm.</p>
                <Link to="/shop" className="inline-block px-8 py-3 bg-gray-900 text-white rounded-xl font-bold uppercase tracking-wider hover:bg-red-600 transition-all">
                    Tiếp tục mua sắm
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-16 px-4">
            <h1 className="text-4xl font-black uppercase mb-2">Giỏ Hàng</h1>
            <p className="text-gray-400 mb-10">{totalItems} sản phẩm trong giỏ</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Danh sách SP */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map(item => (
                        <div key={item.productId} className="bg-white rounded-2xl border border-gray-100 p-6 flex gap-6 items-center shadow-sm">
                            {/* Ảnh */}
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                {item.image ? (
                                    <img src={`/uploads/products/${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                                ) : <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>}
                            </div>
                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                                <p className="text-red-600 font-black mt-1">{formatPrice(item.price)}</p>
                            </div>
                            {/* Quantity */}
                            <div className="flex items-center gap-2">
                                <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 font-bold text-gray-600">−</button>
                                <span className="w-10 text-center font-bold">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.productId, Math.min(item.quantity + 1, item.stock))} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 font-bold text-gray-600">+</button>
                            </div>
                            {/* Subtotal */}
                            <div className="text-right w-28">
                                <p className="font-black text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                            {/* Remove */}
                            <button onClick={() => removeFromCart(item.productId)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Tổng */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm sticky top-28">
                        <h3 className="text-xl font-black uppercase mb-6">Tổng đơn hàng</h3>
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Tạm tính ({totalItems} SP)</span><span className="font-bold">{formatPrice(totalAmount)}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Phí vận chuyển</span><span className="font-bold text-emerald-500">Miễn phí</span></div>
                            <hr className="my-4" />
                            <div className="flex justify-between"><span className="font-bold text-lg">Tổng cộng</span><span className="font-black text-xl text-red-600">{formatPrice(totalAmount)}</span></div>
                        </div>
                        {isAuthenticated ? (
                            <Link to="/checkout" className="block w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-center uppercase tracking-wider hover:bg-red-600 transition-all">
                                Thanh toán
                            </Link>
                        ) : (
                            <Link to="/login" className="block w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-center uppercase tracking-wider hover:bg-red-600 transition-all">
                                Đăng nhập để thanh toán
                            </Link>
                        )}
                        <Link to="/shop" className="block w-full mt-3 py-3 border border-gray-200 rounded-xl font-bold text-sm text-center uppercase tracking-wider hover:bg-gray-50 transition-all">
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
