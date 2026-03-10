
import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const MasterLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { totalItems } = useCart();

  const navItems = [
    { name: 'Trang Chủ', path: '/' },
    { name: 'Cửa Hàng', path: '/shop' },
    { name: 'Công Cụ AI', path: '/ai-tools' },
    { name: 'Liên Hệ', path: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
                  className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-red-600 ${location.pathname === item.path ? 'text-red-600' : 'text-gray-500'
                    }`}
                >
                  {item.name}
                </Link>
              ))}
              {/* Link Admin */}
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-red-600 ${location.pathname.startsWith('/admin') ? 'text-red-600' : 'text-gray-500'
                    }`}
                >
                  ⚙ Admin
                </Link>
              )}
            </nav>
            <div className="flex items-center space-x-4">
              {/* Cart Icon */}
              <Link to="/cart" className="relative p-2 text-gray-500 hover:text-red-600 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <>
                  {/* My Orders */}
                  <Link to="/my-orders" className="text-sm font-bold text-gray-500 hover:text-red-600 uppercase tracking-wider transition-colors hidden sm:block">
                    Đơn hàng
                  </Link>
                  {/* User Info */}
                  <span className="text-sm text-gray-500 hidden sm:block">
                    <strong className="text-gray-900">{user?.name}</strong>
                    {isAdmin && (
                      <span className="ml-1 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                        Admin
                      </span>
                    )}
                  </span>
                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-red-600 uppercase tracking-wider transition-colors"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-red-600 uppercase tracking-wider transition-colors"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 bg-gray-900 text-white text-sm font-bold rounded-full uppercase tracking-wider hover:bg-red-600 transition-all"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
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
