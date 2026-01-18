
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const MasterLayout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Trang Chủ', path: '/' },
    { name: 'Cửa Hàng', path: '/shop' },
    { name: 'Công Cụ AI', path: '/ai-tools' },
    { name: 'Liên Hệ', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="text-2xl font-black tracking-tighter text-red-600">
              LARAVEL<span className="text-gray-900">SHOP</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-red-600 ${
                    location.pathname === item.path ? 'text-red-600' : 'text-gray-500'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="flex items-center space-x-4">
               <button className="p-2 text-gray-400 hover:text-red-600">
                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                 </svg>
               </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-black text-red-600 mb-4">LARAVEL SHOP</h3>
            <p className="text-gray-500 max-w-sm">Trang thương mại điện tử mô phỏng kiến trúc MVC mạnh mẽ và hiện đại.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-400">Chính sách</h4>
            <ul className="text-sm space-y-2 text-gray-600">
              <li className="hover:text-red-600 cursor-pointer">Giao hàng</li>
              <li className="hover:text-red-600 cursor-pointer">Đổi trả</li>
              <li className="hover:text-red-600 cursor-pointer">Bảo mật</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-400">Kết nối</h4>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all cursor-pointer">f</div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all cursor-pointer">i</div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all cursor-pointer">t</div>
            </div>
          </div>
        </div>
        <div className="mt-12 text-center text-xs text-gray-400">
          &copy; 2025 Laravel-Shop Project. Built for Excellence.
        </div>
      </footer>
    </div>
  );
};

export default MasterLayout;
