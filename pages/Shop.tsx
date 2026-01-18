
import React, { useState, useEffect, useMemo } from 'react';
import { ShopController } from '../controllers/ShopController';
import { Product } from '../models/ProductModel';

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const controller = useMemo(() => new ShopController(), []);

  useEffect(() => {
    const fetchData = async () => {
      // View gọi Controller để lấy dữ liệu sản phẩm
      const data = await controller.index();
      setProducts(data);
      setLoading(false);
    };
    fetchData();
  }, [controller]);

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-16 px-4">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black mb-2 uppercase">Cửa Hàng</h1>
          <p className="text-gray-400">Danh sách sản phẩm mô phỏng dữ liệu từ Controller & Model</p>
        </div>
        <div className="flex space-x-2">
           <button className="px-6 py-2 bg-gray-100 rounded-full text-sm font-bold hover:bg-red-600 hover:text-white transition-all">Lọc</button>
           <button className="px-6 py-2 bg-gray-100 rounded-full text-sm font-bold hover:bg-red-600 hover:text-white transition-all">Sắp xếp</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map((product) => (
          <div key={product.id} className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100">
            <div className="relative h-80 overflow-hidden">
              <img 
                src={product.image} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                alt={product.name} 
              />
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                  {product.category}
                </span>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-xl font-bold mb-2 group-hover:text-red-600 transition-colors">{product.name}</h3>
              <p className="text-gray-500 text-sm mb-6 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-black text-gray-900">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                </span>
                <button className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all transform hover:rotate-90">
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
