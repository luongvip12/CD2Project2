/**
 * Trang Cửa Hàng - Hiển thị sản phẩm với bộ lọc danh mục + thêm giỏ hàng
 */
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useCart } from '../contexts/CartContext';

interface Category { id: number; name: string; productCount: number; }
interface Product {
  id: number; name: string; description: string; price: number; stock: number;
  image: string | null; category_id: number | null;
  category?: { id: number; name: string } | null;
}

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addedId, setAddedId] = useState<number | null>(null);
  const { addToCart } = useCart();

  // Lấy danh mục
  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data.data.categories)).catch(() => { });
  }, []);

  // Lấy sản phẩm (theo danh mục nếu có)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = selectedCat ? `/products?category_id=${selectedCat}` : '/products';
        const res = await api.get(url);
        setProducts(res.data.data.products);
        setError('');
      } catch (err: any) {
        setError('Không thể tải sản phẩm.');
      } finally { setLoading(false); }
    };
    fetchProducts();
  }, [selectedCat]);

  const formatPrice = (p: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) return;
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  if (error) return (
    <div className="max-w-7xl mx-auto py-16 px-4">
      <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl text-sm font-medium border border-red-100">{error}</div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-16 px-4">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-black mb-2 uppercase">Cửa Hàng</h1>
          <p className="text-gray-400">
            {selectedCat ? `Danh mục: ${categories.find(c => c.id === selectedCat)?.name}` : 'Tất cả sản phẩm'}
            {!loading && ` (${products.length} sản phẩm)`}
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setSelectedCat(null)}
          className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${selectedCat === null ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Tất cả
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${selectedCat === cat.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {cat.name}
            <span className="ml-1 text-xs opacity-60">({cat.productCount})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div></div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400"><p className="text-lg">Không có sản phẩm nào trong danh mục này.</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map(product => (
            <div key={product.id} className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100">
              <div className="relative h-72 overflow-hidden bg-gray-100">
                {product.image ? (
                  <img src={`/uploads/products/${product.image}`} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"><span className="text-7xl">📦</span></div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm backdrop-blur-sm ${product.stock > 0 ? 'bg-white/90 text-emerald-600' : 'bg-red-500/90 text-white'}`}>
                    {product.stock > 0 ? `Còn ${product.stock}` : 'Hết hàng'}
                  </span>
                  {product.category && (
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm text-gray-600">
                      {product.category.name}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold mb-2 group-hover:text-red-600 transition-colors">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2">{product.description || 'Không có mô tả'}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black text-gray-900">{formatPrice(product.price)}</span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock <= 0}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all transform ${addedId === product.id
                        ? 'bg-emerald-500 text-white scale-110'
                        : product.stock <= 0
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-900 text-white hover:bg-red-600 hover:rotate-90'
                      }`}
                  >
                    {addedId === product.id ? '✓' : '+'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
