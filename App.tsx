
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import MasterLayout from './layouts/MasterLayout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import AITools from './pages/AITools';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import Dashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import OrderManagement from './pages/admin/OrderManagement';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<MasterLayout />}>
              {/* Routes công khai */}
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="ai-tools" element={<AITools />} />
              <Route path="contact" element={<Contact />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="cart" element={<Cart />} />

              {/* Routes cần đăng nhập */}
              <Route path="checkout" element={
                <ProtectedRoute><Checkout /></ProtectedRoute>
              } />
              <Route path="my-orders" element={
                <ProtectedRoute><MyOrders /></ProtectedRoute>
              } />

              {/* Routes Admin */}
              <Route path="admin/dashboard" element={
                <ProtectedRoute requireAdmin><Dashboard /></ProtectedRoute>
              } />
              <Route path="admin/products" element={
                <ProtectedRoute requireAdmin><ProductManagement /></ProtectedRoute>
              } />
              <Route path="admin/categories" element={
                <ProtectedRoute requireAdmin><CategoryManagement /></ProtectedRoute>
              } />
              <Route path="admin/orders" element={
                <ProtectedRoute requireAdmin><OrderManagement /></ProtectedRoute>
              } />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
