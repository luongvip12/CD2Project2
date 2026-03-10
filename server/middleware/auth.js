/**
 * Middleware xác thực JWT Token
 * Bảo vệ các route cần đăng nhập
 */
const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Middleware verifyToken
 * Kiểm tra JWT token từ header Authorization
 * Gắn thông tin user vào req.user
 */
const verifyToken = async (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy token xác thực. Vui lòng đăng nhập.',
      });
    }

    // Tách token từ "Bearer <token>"
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm user trong DB
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ. User không tồn tại.',
      });
    }

    // Gắn user vào request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token đã hết hạn. Vui lòng đăng nhập lại.',
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ.',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Lỗi xác thực.',
    });
  }
};

/**
 * Middleware isAdmin
 * Kiểm tra user có role admin không
 * Phải dùng sau verifyToken
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền truy cập. Chỉ Admin mới được phép.',
  });
};

module.exports = { verifyToken, isAdmin };
