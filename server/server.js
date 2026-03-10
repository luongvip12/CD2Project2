/**
 * Server Entry Point
 * Khởi tạo Express server, kết nối MySQL, mount routes
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { syncDatabase } = require('./models');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// Middleware
// ============================================
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));
app.use(express.json());        // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded body

// Phục vụ file tĩnh (ảnh sản phẩm)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// Routes
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Route kiểm tra server
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'CD2 API Server is running!',
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// Error Handling Middleware
// ============================================

// 404 - Route không tồn tại
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} không tồn tại.`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Lỗi server nội bộ.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ============================================
// Khởi động Server
// ============================================
const startServer = async () => {
  try {
    // Kết nối MySQL
    await connectDB();

    // Đồng bộ database (tạo/cập nhật bảng)
    await syncDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
      console.log(`📦 API Endpoints:`);
      console.log(`   POST   /api/auth/register`);
      console.log(`   POST   /api/auth/login`);
      console.log(`   GET    /api/auth/me`);
      console.log(`   GET    /api/products`);
      console.log(`   GET    /api/products/:id`);
      console.log(`   POST   /api/products`);
      console.log(`   PUT    /api/products/:id`);
      console.log(`   DELETE /api/products/:id`);
      console.log(`   GET    /api/dashboard/stats`);
      console.log(`   GET    /api/health`);
    });
  } catch (error) {
    console.error('❌ Không thể khởi động server:', error.message);
    process.exit(1);
  }
};

startServer();
