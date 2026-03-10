/**
 * Routes cho Dashboard
 * GET /api/dashboard/stats - Thống kê tổng quan (admin)
 */
const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboardController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Tất cả routes dashboard đều cần role Admin
router.get('/stats', verifyToken, isAdmin, getStats);

module.exports = router;
