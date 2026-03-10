/**
 * Admin Category Management - CRUD danh mục
 */
import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

interface Category {
    id: number;
    name: string;
    description: string;
    productCount: number;
}

const CategoryManagement: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchCategories = useCallback(async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data.data.categories);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);
    useEffect(() => { if (successMsg) { const t = setTimeout(() => setSuccessMsg(''), 3000); return () => clearTimeout(t); } }, [successMsg]);

    const openCreate = () => { setName(''); setDescription(''); setEditingId(null); setError(''); setShowModal(true); };
    const openEdit = (cat: Category) => { setName(cat.name); setDescription(cat.description || ''); setEditingId(cat.id); setError(''); setShowModal(true); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setSubmitting(true);
        try {
            if (editingId) {
                await api.put(`/categories/${editingId}`, { name, description });
                setSuccessMsg('Cập nhật danh mục thành công!');
            } else {
                await api.post('/categories', { name, description });
                setSuccessMsg('Thêm danh mục thành công!');
            }
            setShowModal(false); fetchCategories();
        } catch (err: any) { setError(err.response?.data?.message || 'Có lỗi xảy ra.'); }
        finally { setSubmitting(false); }
    };

    const handleDelete = async (id: number, catName: string) => {
        if (!window.confirm(`Xoá danh mục "${catName}"?`)) return;
        try {
            await api.delete(`/categories/${id}`);
            setSuccessMsg('Xoá danh mục thành công!');
            fetchCategories();
        } catch (err: any) { alert(err.response?.data?.message || 'Lỗi khi xoá.'); }
    };

    if (loading) return <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div></div>;

    return (
        <div className="max-w-5xl mx-auto py-16 px-4">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl font-black uppercase mb-2">Quản Lý Danh Mục</h1>
                    <p className="text-gray-400">Phân loại sản phẩm theo danh mục</p>
                </div>
                <button onClick={openCreate} className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold uppercase tracking-wider hover:bg-red-600 transition-all flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Thêm danh mục
                </button>
            </div>

            {successMsg && (
                <div className="bg-emerald-50 text-emerald-600 px-6 py-4 rounded-xl text-sm font-medium border border-emerald-100 mb-8 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {successMsg}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead><tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Tên danh mục</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Mô tả</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Số SP</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Thao tác</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-50">
                        {categories.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-16 text-center text-gray-400">Chưa có danh mục nào.</td></tr>
                        ) : categories.map(cat => (
                            <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-400 font-mono">#{cat.id}</td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-900">{cat.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{cat.description || '—'}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">{cat.productCount}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => openEdit(cat)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Sửa">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                        <button onClick={() => handleDelete(cat.id, cat.name)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Xoá">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black uppercase">{editingId ? 'Sửa Danh Mục' : 'Thêm Danh Mục'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium border border-red-100">{error}</div>}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Tên danh mục <span className="text-red-500">*</span></label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all text-sm" placeholder="VD: Điện thoại, Laptop..." required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Mô tả</label>
                                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all text-sm resize-none" rows={3} placeholder="Mô tả danh mục" />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-gray-50 transition-all">Huỷ</button>
                                <button type="submit" disabled={submitting} className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-red-600 transition-all disabled:opacity-50">
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

export default CategoryManagement;
