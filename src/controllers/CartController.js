const cartService = require("../services/CartService");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, qty } = req.body;
    const cart = await cartService.addToCart(userId, productId, qty);
    res.status(201).json({ success: true, data: cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getCartByUser = async (req, res) => {
  try {
    const cart = await cartService.getCartByUser(req.params.userId);
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const cart = await cartService.updateCartItem(
      req.params.userId,
      productId,
      qty
    );
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const cart = await cartService.removeFromCart(userId, productId);
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await cartService.clearCart(req.params.userId);
    res.json({
      success: true,
      message: "Đã xóa toàn bộ giỏ hàng.",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addToCart,
  getCartByUser,
  updateCartItem,
  removeFromCart,
  clearCart,
};
