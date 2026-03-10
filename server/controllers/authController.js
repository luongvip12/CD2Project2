/**
 * Controller xử lý Authentication
 * Đăng ký, đăng nhập, lấy thông tin user hiện tại
 */
const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Tạo JWT Token
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

/**
 * POST /api/auth/register
 * Đăng ký tài khoản mới
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng.',
      });
    }

    // Tạo user mới (password sẽ được hash qua hook beforeCreate)
    const user = await User.create({ name, email, password });

    // Tạo token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công!',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng ký.',
      error: error.message,
    });
  }
};

/**
 * POST /api/auth/login
 * Đăng nhập
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user theo email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng.',
      });
    }

    // So sánh mật khẩu
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng.',
      });
    }

    // Tạo token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công!',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng nhập.',
      error: error.message,
    });
  }
};

/**
 * GET /api/auth/me
 * Lấy thông tin user hiện tại (cần đăng nhập)
 */
const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: { user: req.user.toJSON() },
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server.',
    });
  }
};

module.exports = { register, login, getMe };
