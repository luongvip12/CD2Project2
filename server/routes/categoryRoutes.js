/**
 * Routes cho Category
 * GET    /api/categories     - Lấy tất cả (public)
 * GET    /api/categories/:id - Chi tiết (public)
 * POST   /api/categories     - Thêm (admin)
 * PUT    /api/categories/:id - Sửa (admin)
 * DELETE /api/categories/:id - Xoá (admin)
 */
const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/categoryController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public
router.get('/', getAll);
router.get('/:id', getById);

// Admin only
router.post('/', verifyToken, isAdmin, create);
router.put('/:id', verifyToken, isAdmin, update);
router.delete('/:id', verifyToken, isAdmin, remove);

module.exports = router;
