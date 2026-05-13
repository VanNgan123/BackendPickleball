const CouponService = require("../services/CouponServices");

// Admin: Tạo coupon
const createCoupon = async (req, res) => {
  try {
    const coupon = await CouponService.createCoupon(req.body);

    res.status(201).json({
      status: "OK",
      message: "Tạo coupon thành công",
      data: coupon,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

// Admin: Lấy tất cả coupon
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await CouponService.getAllCoupons();

    res.json({
      status: "OK",
      data: coupons,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

// Lấy coupon theo ID
const getCouponById = async (req, res) => {
  try {
    const coupon = await CouponService.getCouponById(req.params.id);

    res.json({
      status: "OK",
      data: coupon,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

// Admin: Cập nhật coupon
const updateCoupon = async (req, res) => {
  try {
    const coupon = await CouponService.updateCoupon(req.params.id, req.body);

    res.json({
      status: "OK",
      message: "Cập nhật coupon thành công",
      data: coupon,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

// Admin: Xoá coupon
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await CouponService.deleteCoupon(req.params.id);

    res.json({
      status: "OK",
      message: "Xoá coupon thành công",
      data: coupon,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

// Xác thực coupon (người dùng)
const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount, productIds, categoryIds } = req.body;

    const coupon = await CouponService.validateCoupon(
      code,
      orderAmount,
      productIds || [],
      categoryIds || []
    );

    res.json({
      status: "OK",
      message: "Coupon hợp lệ",
      data: coupon,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

// Tính giảm giá
const calculateDiscount = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    const discount = await CouponService.calculateDiscount(code, orderAmount);

    res.json({
      status: "OK",
      data: discount,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

module.exports = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  calculateDiscount,
};
