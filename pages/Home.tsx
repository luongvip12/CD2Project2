
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      <section className="relative h-[600px] bg-gray-900 flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           <img 
             src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600" 
             className="w-full h-full object-cover" 
             alt="Banner"
           />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-white">
          <h1 className="text-7xl font-black mb-6 leading-none">
            THỜI ĐẠI MỚI CỦA<br/>
            <span className="text-red-600">MUA SẮM AI</span>
          </h1>
          <p className="text-xl max-w-lg mb-8 text-gray-300">
            Khám phá bộ sưu tập sản phẩm công nghệ và thời trang được tuyển chọn kỹ lưỡng, vận hành bởi kiến trúc MVC chuẩn Laravel.
          </p>
          <div className="flex space-x-4">
            <Link to="/shop" className="bg-red-600 text-white px-10 py-4 rounded-full font-bold hover:bg-red-700 transition-all">
              Mua Sắm Ngay
            </Link>
            <Link to="/ai-tools" className="bg-white text-gray-900 px-10 py-4 rounded-full font-bold hover:bg-gray-100 transition-all">
              Thử Nghiệm AI
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Stats */}
      <section className="py-16 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <h3 className="text-4xl font-black text-gray-900 mb-2">10k+</h3>
            <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Khách hàng tin tưởng</p>
          </div>
          <div>
            <h3 className="text-4xl font-black text-gray-900 mb-2">24/7</h3>
            <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Hỗ trợ khách hàng</p>
          </div>
          <div>
            <h3 className="text-4xl font-black text-gray-900 mb-2">MVC</h3>
            <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Kiến trúc bền vững</p>
          </div>
        </div>
      </section>

      {/* Intro section for AI features as an "Extra" */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
             <span className="text-red-600 font-bold uppercase tracking-widest text-sm">Tính năng mở rộng</span>
             <h2 className="text-4xl font-black mt-4 mb-6">Trải nghiệm mua sắm thông minh với Gemini AI</h2>
             <p className="text-gray-600 mb-8 leading-relaxed text-lg">
               Chúng tôi không chỉ bán hàng. Chúng tôi cung cấp các công cụ AI mạnh mẽ để giúp bạn tra cứu thông tin sản phẩm và chỉnh sửa hình ảnh trực tiếp trên trình duyệt.
             </p>
             <Link to="/ai-tools" className="text-gray-900 font-bold border-b-2 border-red-600 pb-1 hover:text-red-600 transition-all">
               Khám phá công nghệ AI &rarr;
             </Link>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="aspect-square bg-white rounded-3xl shadow-xl flex items-center justify-center p-8">
               <span className="text-5xl">🔍</span>
            </div>
            <div className="aspect-square bg-red-600 rounded-3xl shadow-xl flex items-center justify-center p-8 mt-12">
               <span className="text-5xl">🎨</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
