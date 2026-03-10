/**
 * Controller quản lý Product (CRUD)
 * Thêm, sửa, xoá, lấy danh sách sản phẩm
 * Hỗ trợ upload ảnh sản phẩm
 */
const { Product, Category } = require('../models');
const fs = require('fs');
const path = require('path');

/**
 * GET /api/products
 * Lấy tất cả sản phẩm (public)
 */
const getAll = async (req, res) => {
  try {
    // Hỗ trợ lọc theo category_id qua query param
    const where = {};
    if (req.query.category_id) {
      where.category_id = req.query.category_id;
    }

    const products = await Product.findAll({
      where,
      order: [['created_at', 'DESC']],
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
    });

    res.status(200).json({
      success: true,
      data: { products },
      total: products.length,
    });
  } catch (error) {
    console.error('GetAll products error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách sản phẩm.',
    });
  }
};

/**
 * GET /api/products/:id
 * Lấy chi tiết 1 sản phẩm (public)
 */
const getById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm.',
      });
    }

    res.status(200).json({
      success: true,
      data: { product },
    });
  } catch (error) {
    console.error('GetById product error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy sản phẩm.',
    });
  }
};

/**
 * POST /api/products
 * Thêm sản phẩm mới (Admin only)
 * Hỗ trợ upload ảnh qua multipart/form-data
 */
const create = async (req, res) => {
  try {
    const { name, description, price, stock, category_id } = req.body;

    // Lấy tên file ảnh nếu có upload
    const image = req.file ? req.file.filename : null;

    const product = await Product.create({
      name,
      description: description || '',
      price,
      stock,
      image,
      category_id: category_id || null,
    });

    res.status(201).json({
      success: true,
      message: 'Thêm sản phẩm thành công!',
      data: { product },
    });
  } catch (error) {
    console.error('Create product error:', error);
    // Xoá file ảnh đã upload nếu có lỗi
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ.',
        errors: error.errors.map((e) => ({
          field: e.path,
          message: e.message,
        })),
      });
    }
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi thêm sản phẩm.',
    });
  }
};

/**
 * PUT /api/products/:id
 * Cập nhật sản phẩm (Admin only)
 * Hỗ trợ thay đổi ảnh
 */
const update = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      // Xoá file ảnh mới nếu product không tồn tại
      if (req.file) fs.unlink(req.file.path, () => {});
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm.',
      });
    }

    // Cập nhật các field
    const { name, description, price, stock, category_id } = req.body;
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (category_id !== undefined) product.category_id = category_id || null;

    // Nếu có upload ảnh mới → xoá ảnh cũ và cập nhật
    if (req.file) {
      // Xoá ảnh cũ nếu có
      if (product.image) {
        const oldPath = path.join(__dirname, '..', 'uploads', 'products', product.image);
        fs.unlink(oldPath, () => {}); // Không throw lỗi nếu file không tồn tại
      }
      product.image = req.file.filename;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Cập nhật sản phẩm thành công!',
      data: { product },
    });
  } catch (error) {
    console.error('Update product error:', error);
    if (req.file) fs.unlink(req.file.path, () => {});
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ.',
        errors: error.errors.map((e) => ({
          field: e.path,
          message: e.message,
        })),
      });
    }
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật sản phẩm.',
    });
  }
};

/**
 * DELETE /api/products/:id
 * Xoá sản phẩm (Admin only)
 * Tự động xoá ảnh liên quan
 */
const remove = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm.',
      });
    }

    // Xoá file ảnh nếu có
    if (product.image) {
      const imgPath = path.join(__dirname, '..', 'uploads', 'products', product.image);
      fs.unlink(imgPath, () => {});
    }

    await product.destroy();

    res.status(200).json({
      success: true,
      message: 'Xoá sản phẩm thành công!',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xoá sản phẩm.',
    });
  }
};

module.exports = { getAll, getById, create, update, remove };
