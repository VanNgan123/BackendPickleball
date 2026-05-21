const express = require("express");
const router = express.Router();
const cartController = require("../controllers/CartController");
const { authMiddleware } = require("../middleware/authMiddleware");
router.post("/", authMiddleware, cartController.addToCart);
router.get("/me", authMiddleware, cartController.getMyCart);
router.put("/", authMiddleware, cartController.updateCartItem);
router.delete("/:productId", authMiddleware, cartController.removeFromCart);
router.delete("/clear/all", authMiddleware, cartController.clearCart);

module.exports = router;