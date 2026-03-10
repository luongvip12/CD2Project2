/**
 * Routes cho Authentication
 * POST /api/auth/register - Đăng ký
 * POST /api/auth/login    - Đăng nhập
 * GET  /api/auth/me       - Lấy thông tin user hiện tại
 */
const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { registerRules, loginRules } = require('../middleware/validate');

// Đăng ký tài khoản mới
router.post('/register', registerRules, register);

// Đăng nhập
router.post('/login', loginRules, login);

// Lấy thông tin user hiện tại (cần đăng nhập)
router.get('/me', verifyToken, getMe);

module.exports = router;
