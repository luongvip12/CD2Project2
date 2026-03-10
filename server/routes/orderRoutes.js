/**
 * Routes cho Order
 * POST   /api/orders        - Đặt hàng (user)
 * GET    /api/orders/my      - Đơn hàng của tôi (user)
 * GET    /api/orders         - Tất cả đơn (admin)
 * GET    /api/orders/:id     - Chi tiết đơn (user/admin)
 * PUT    /api/orders/:id/status - Cập nhật trạng thái (admin)
 */
const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getById, getAll, updateStatus } = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// User routes (cần đăng nhập)
router.post('/', verifyToken, createOrder);
router.get('/my', verifyToken, getMyOrders);

// Admin routes
router.get('/', verifyToken, isAdmin, getAll);

// Shared (user xem đơn mình, admin xem tất cả)
router.get('/:id', verifyToken, getById);

// Admin: cập nhật trạng thái
router.put('/:id/status', verifyToken, isAdmin, updateStatus);

module.exports = router;
