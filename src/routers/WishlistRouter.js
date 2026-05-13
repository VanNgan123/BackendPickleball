const express = require("express");
const router = express.Router();
const WishlistController = require("../controllers/WishlistController");
const { authMiddleware } = require("../middleware/authMiddlware");

// Tất cả routes yêu cầu đăng nhập
router.post("/", authMiddleware, WishlistController.addToWishlist);
router.get("/", authMiddleware, WishlistController.getWishlist);
router.delete("/:productId", authMiddleware, WishlistController.removeFromWishlist);
router.delete("/", authMiddleware, WishlistController.clearWishlist);
router.get("/check/:productId", authMiddleware, WishlistController.isInWishlist);

module.exports = router;
