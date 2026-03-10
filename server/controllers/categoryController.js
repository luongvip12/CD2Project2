/**
 * Controller quản lý Category (CRUD)
 * Thêm, sửa, xoá, lấy danh sách danh mục
 */
const { Category, Product } = require('../models');

/**
 * GET /api/categories
 * Lấy tất cả danh mục (public)
 */
const getAll = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']],
      include: [{
        model: Product,
        as: 'products',
        attributes: ['id'], // Chỉ lấy id để đếm số SP
      }],
    });

    // Thêm count vào mỗi category
    const result = categories.map(cat => ({
      ...cat.toJSON(),
      productCount: cat.products ? cat.products.length : 0,
      products: undefined, // Không trả mảng products
    }));

    res.status(200).json({
      success: true,
      data: { categories: result },
      total: result.length,
    });
  } catch (error) {
    console.error('GetAll categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh mục.',
    });
  }
};

/**
 * GET /api/categories/:id
 * Lấy chi tiết danh mục + sản phẩm trong danh mục
 */
const getById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{
        model: Product,
        as: 'products',
        include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
      }],
    });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Danh mục không tồn tại.' });
    }
    res.status(200).json({ success: true, data: { category } });
  } catch (error) {
    console.error('GetById category error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server.' });
  }
};

/**
 * POST /api/categories (Admin only)
 */
const create = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Tên danh mục phải từ 2 ký tự.' });
    }
    const category = await Category.create({ name: name.trim(), description: description || '' });
    res.status(201).json({ success: true, message: 'Thêm danh mục thành công!', data: { category } });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, message: 'Tên danh mục đã tồn tại.' });
    }
    console.error('Create category error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi thêm danh mục.' });
  }
};

/**
 * PUT /api/categories/:id (Admin only)
 */
const update = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Danh mục không tồn tại.' });
    }
    const { name, description } = req.body;
    if (name !== undefined) category.name = name.trim();
    if (description !== undefined) category.description = description;
    await category.save();
    res.status(200).json({ success: true, message: 'Cập nhật danh mục thành công!', data: { category } });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, message: 'Tên danh mục đã tồn tại.' });
    }
    console.error('Update category error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật danh mục.' });
  }
};

/**
 * DELETE /api/categories/:id (Admin only)
 */
const remove = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Danh mục không tồn tại.' });
    }
    // Kiểm tra xem có SP nào trong danh mục không
    const productCount = await Product.count({ where: { category_id: category.id } });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Không thể xoá. Danh mục này có ${productCount} sản phẩm.`,
      });
    }
    await category.destroy();
    res.status(200).json({ success: true, message: 'Xoá danh mục thành công!' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi xoá danh mục.' });
  }
};

module.exports = { getAll, getById, create, update, remove };
