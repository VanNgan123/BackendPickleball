const cartService = require("../services/CartService");

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, qty } = req.body;

    const cart = await cartService.addToCart(userId, productId, qty);

    res.status(201).json({
      status: "OK",
      message: "Đã thêm vào giỏ hàng",
      data: cart,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

const getMyCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await cartService.getCartByUser(userId);

    res.json({
      status: "OK",
      data: cart,
    });
  } catch (error) {
    res.status(404).json({
      status: "ERR",
      message: error.message,
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, qty } = req.body;

    const cart = await cartService.updateCartItem(userId, productId, qty);

    res.json({
      status: "OK",
      message: "Cập nhật giỏ hàng thành công",
      data: cart,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await cartService.removeFromCart(userId, productId);

    res.json({
      status: "OK",
      message: "Đã xóa sản phẩm khỏi giỏ hàng",
      data: cart,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await cartService.clearCart(userId);

    res.json({
      status: "OK",
      message: "Đã xóa toàn bộ giỏ hàng",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      status: "ERR",
      message: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getMyCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};