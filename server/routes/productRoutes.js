/**
 * Routes cho Product
 * GET    /api/products     - Lấy tất cả sản phẩm (public)
 * GET    /api/products/:id - Lấy chi tiết sản phẩm (public)
 * POST   /api/products     - Thêm sản phẩm + ảnh (admin)
 * PUT    /api/products/:id - Cập nhật sản phẩm + ảnh (admin)
 * DELETE /api/products/:id - Xoá sản phẩm (admin)
 */
const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// ============================================
// Routes công khai (không cần đăng nhập)
// ============================================
router.get('/', getAll);
router.get('/:id', getById);

// ============================================
// Routes bảo vệ (cần đăng nhập + role Admin)
// upload.single('image') → nhận 1 file ảnh từ field 'image'
// ============================================
router.post('/', verifyToken, isAdmin, upload.single('image'), create);
router.put('/:id', verifyToken, isAdmin, upload.single('image'), update);
router.delete('/:id', verifyToken, isAdmin, remove);

module.exports = router;
