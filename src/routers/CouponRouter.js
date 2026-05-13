const express = require("express");
const router = express.Router();
const CouponController = require("../controllers/CouponController");
const { authMiddleware, Admin } = require("../middleware/authMiddlware");

// User routes
router.post("/validate", CouponController.validateCoupon);
router.post("/calculate-discount", CouponController.calculateDiscount);

// Admin routes
router.post("/", authMiddleware, Admin, CouponController.createCoupon);
router.get("/", authMiddleware, Admin, CouponController.getAllCoupons);
router.get("/:id", CouponController.getCouponById);
router.put("/:id", authMiddleware, Admin, CouponController.updateCoupon);
router.delete("/:id", authMiddleware, Admin, CouponController.deleteCoupon);

module.exports = router;
