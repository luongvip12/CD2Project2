/**
 * Admin Product Management - CRUD sản phẩm
 * Bảng danh sách + Modal thêm/sửa + Xoá
 * Hỗ trợ upload ảnh sản phẩm
 */
import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

interface Category { id: number; name: string; }
interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string | null;
    category_id: number | null;
    category?: Category | null;
    created_at: string;
}

interface ProductForm {
    name: string;
    description: string;
    price: string;
    stock: string;
    category_id: string;
}

const emptyForm: ProductForm = { name: '', description: '', price: '', stock: '', category_id: '' };

const ProductManagement: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<ProductForm>(emptyForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    // Lấy danh mục
    useEffect(() => {
        api.get('/categories').then(res => setCategories(res.data.data.categories)).catch(() => { });
    }, []);

    // Lấy danh sách sản phẩm
    const fetchProducts = useCallback(async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data.data.products);
        } catch (err) {
            console.error('Lỗi lấy sản phẩm:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    // Auto-hide success message
    useEffect(() => {
        if (successMsg) {
            const timer = setTimeout(() => setSuccessMsg(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMsg]);

    // Xử lý chọn ảnh
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            // Tạo preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Xoá ảnh đã chọn
    const clearImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    // Mở modal thêm mới
    const openCreateModal = () => {
        setForm(emptyForm);
        setEditingId(null);
        setImageFile(null);
        setImagePreview(null);
        setError('');
        setShowModal(true);
    };

    // Mở modal sửa
    const openEditModal = (product: Product) => {
        setForm({
            name: product.name,
            description: product.description || '',
            price: String(product.price),
            stock: String(product.stock),
            category_id: product.category_id ? String(product.category_id) : '',
        });
        setEditingId(product.id);
        setImageFile(null);
        setImagePreview(product.image ? `/uploads/products/${product.image}` : null);
        setError('');
        setShowModal(true);
    };

    // Submit form (thêm hoặc sửa) — dùng FormData cho multipart upload
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('description', form.description);
            formData.append('price', form.price);
            formData.append('stock', form.stock);
            formData.append('category_id', form.category_id);

            // Gắn file ảnh nếu có
            if (imageFile) {
                formData.append('image', imageFile);
            }

            if (editingId) {
                await api.put(`/products/${editingId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setSuccessMsg('Cập nhật sản phẩm thành công!');
            } else {
                await api.post('/products', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setSuccessMsg('Thêm sản phẩm thành công!');
            }

            setShowModal(false);
            setForm(emptyForm);
            setEditingId(null);
            setImageFile(null);
            setImagePreview(null);
            fetchProducts();
        } catch (err: any) {
            const message = err.response?.data?.message || 'Có lỗi xảy ra.';
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    // Xoá sản phẩm
    const handleDelete = async (id: number, name: string) => {
        if (!window.confirm(`Bạn có chắc muốn xoá sản phẩm "${name}"?`)) return;

        try {
            await api.delete(`/products/${id}`);
            setSuccessMsg('Xoá sản phẩm thành công!');
            fetchProducts();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Lỗi khi xoá sản phẩm.');
        }
    };

    // Format giá VND
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    if (loading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-16 px-4">
            {/* Header */}
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl font-black uppercase mb-2">Quản Lý Sản Phẩm</h1>
                    <p className="text-gray-400">Thêm, sửa, xoá sản phẩm trong hệ thống</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold uppercase tracking-wider hover:bg-red-600 transition-all duration-300 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm sản phẩm
                </button>
            </div>

            {/* Success Message */}
            {successMsg && (
                <div className="bg-emerald-50 text-emerald-600 px-6 py-4 rounded-xl text-sm font-medium border border-emerald-100 mb-8 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {successMsg}
                </div>
            )}

            {/* Products Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Ảnh</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Tên sản phẩm</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Danh mục</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Giá</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Tồn kho</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-16 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                            <p>Chưa có sản phẩm nào.</p>
                                            <button onClick={openCreateModal} className="text-red-600 font-bold hover:underline">
                                                Thêm sản phẩm đầu tiên
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-400 font-mono">#{product.id}</td>
                                        <td className="px-6 py-4">
                                            {product.image ? (
                                                <img
                                                    src={`/uploads/products/${product.image}`}
                                                    alt={product.name}
                                                    className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                                                    📦
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-gray-900">{product.name}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.category ? (
                                                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">{product.category.name}</span>
                                            ) : <span className="text-gray-300 text-xs">—</span>}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-bold text-gray-900">{formatPrice(product.price)}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`text-sm font-bold ${product.stock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(product)}
                                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Sửa"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id, product.name)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Xoá"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Thêm/Sửa */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black uppercase">
                                {editingId ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium border border-red-100">
                                    {error}
                                </div>
                            )}

                            {/* Upload ảnh sản phẩm */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                    Ảnh sản phẩm
                                </label>
                                {imagePreview ? (
                                    <div className="relative inline-block">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-xl border border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={clearImage}
                                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-red-400 hover:bg-red-50/30 transition-all">
                                        <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-sm text-gray-500 font-medium">Click để chọn ảnh</p>
                                        <p className="text-xs text-gray-400 mt-1">JPEG, PNG, GIF, WebP (tối đa 5MB)</p>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/gif,image/webp"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                    Tên sản phẩm <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all text-sm"
                                    placeholder="Nhập tên sản phẩm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                    Mô tả
                                </label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all text-sm resize-none"
                                    rows={3}
                                    placeholder="Nhập mô tả sản phẩm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                        Giá (VND) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all text-sm"
                                        placeholder="0"
                                        min="0"
                                        step="1000"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                        Tồn kho <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={form.stock}
                                        onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all text-sm"
                                        placeholder="0"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Danh mục</label>
                                <select
                                    value={form.category_id}
                                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all text-sm"
                                >
                                    <option value="">-- Không chọn --</option>
                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-gray-50 transition-all"
                                >
                                    Huỷ
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-red-600 transition-all disabled:opacity-50"
                                >
                                    {submitting ? 'Đang xử lý...' : editingId ? 'Cập Nhật' : 'Thêm Mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
