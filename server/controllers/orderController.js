/**
 * Controller quản lý Order (Đơn hàng)
 * Đặt hàng, xem đơn hàng, cập nhật trạng thái
 */
const { Order, OrderItem, Product, User, sequelize } = require('../models');

/**
 * POST /api/orders
 * Đặt hàng (User đã đăng nhập)
 * Body: { items: [{ productId, quantity }], shippingName, shippingPhone, shippingAddress, note }
 */
const createOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { items, shippingName, shippingPhone, shippingAddress, note } = req.body;

    // Validate
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Giỏ hàng trống.' });
    }
    if (!shippingName || !shippingPhone || !shippingAddress) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin giao hàng.' });
    }

    // Lấy thông tin sản phẩm và kiểm tra tồn kho
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction: t });
      if (!product) {
        await t.rollback();
        return res.status(400).json({ success: false, message: `Sản phẩm ID ${item.productId} không tồn tại.` });
      }
      if (product.stock < item.quantity) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `Sản phẩm "${product.name}" chỉ còn ${product.stock} trong kho.`,
        });
      }

      const itemTotal = parseFloat(product.price) * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        product_id: product.id,
        product_name: product.name,
        product_image: product.image,
        price: product.price,
        quantity: item.quantity,
      });

      // Giảm tồn kho
      product.stock -= item.quantity;
      await product.save({ transaction: t });
    }

    // Tạo đơn hàng
    const order = await Order.create({
      user_id: req.user.id,
      total_amount: totalAmount,
      status: 'pending',
      shipping_name: shippingName,
      shipping_phone: shippingPhone,
      shipping_address: shippingAddress,
      note: note || '',
    }, { transaction: t });

    // Tạo order items
    for (const itemData of orderItemsData) {
      await OrderItem.create({ ...itemData, order_id: order.id }, { transaction: t });
    }

    await t.commit();

    // Lấy lại order đầy đủ
    const fullOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items' }],
    });

    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công!',
      data: { order: fullOrder },
    });
  } catch (error) {
    await t.rollback();
    console.error('CreateOrder error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi đặt hàng.' });
  }
};

/**
 * GET /api/orders/my
 * Lấy danh sách đơn hàng của user hiện tại
 */
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [{ model: OrderItem, as: 'items' }],
      order: [['created_at', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: { orders },
      total: orders.length,
    });
  } catch (error) {
    console.error('GetMyOrders error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server.' });
  }
};

/**
 * GET /api/orders/:id
 * Lấy chi tiết đơn hàng (user chỉ xem được đơn của mình, admin xem tất cả)
 */
const getById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: OrderItem, as: 'items' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      ],
    });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại.' });
    }
    // User thường chỉ xem được đơn của mình
    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền xem đơn hàng này.' });
    }
    res.status(200).json({ success: true, data: { order } });
  } catch (error) {
    console.error('GetById order error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server.' });
  }
};

/**
 * GET /api/orders (Admin only)
 * Lấy tất cả đơn hàng
 */
const getAll = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: OrderItem, as: 'items' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      ],
      order: [['created_at', 'DESC']],
    });
    res.status(200).json({ success: true, data: { orders }, total: orders.length });
  } catch (error) {
    console.error('GetAll orders error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server.' });
  }
};

/**
 * PUT /api/orders/:id/status (Admin only)
 * Cập nhật trạng thái đơn hàng
 */
const updateStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại.' });
    }
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ.' });
    }

    // Nếu huỷ đơn → hoàn lại tồn kho
    if (status === 'cancelled' && order.status !== 'cancelled') {
      const items = await OrderItem.findAll({ where: { order_id: order.id } });
      for (const item of items) {
        const product = await Product.findByPk(item.product_id);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }

    order.status = status;
    await order.save();

    res.status(200).json({ success: true, message: 'Cập nhật trạng thái thành công!', data: { order } });
  } catch (error) {
    console.error('UpdateStatus order error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server.' });
  }
};

module.exports = { createOrder, getMyOrders, getById, getAll, updateStatus };
