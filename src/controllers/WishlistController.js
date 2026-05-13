const WishlistService = require("../services/WishlistServices");

// Thêm vào wishlist
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const wishlist = await WishlistService.addToWishlist(userId, productId);

    res.status(201).json({
      status: "OK",
      message: "Thêm vào wishlist thành công",
      data: wishlist,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

// Lấy wishlist
const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await WishlistService.getWishlist(userId);

    res.json({
      status: "OK",
      data: wishlist,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

// Xoá khỏi wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const wishlist = await WishlistService.removeFromWishlist(userId, productId);

    res.json({
      status: "OK",
      message: "Xoá khỏi wishlist thành công",
      data: wishlist,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

// Xoá toàn bộ wishlist
const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await WishlistService.clearWishlist(userId);

    res.json({
      status: "OK",
      message: "Xoá toàn bộ wishlist thành công",
      data: wishlist,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

// Kiểm tra sản phẩm có trong wishlist không
const isInWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const inWishlist = await WishlistService.isInWishlist(userId, productId);

    res.json({
      status: "OK",
      data: { inWishlist },
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
  isInWishlist,
};
