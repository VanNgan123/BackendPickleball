const Coupon = require("../models/Coupon");

// Tạo coupon (admin)
const createCoupon = async (data) => {
  const { code, discountValue, discountType, validFrom, validTo } = data;

  if (!code || !discountValue || !validFrom || !validTo) {
    throw new Error("Thiếu thông tin coupon (code, discountValue, validFrom, validTo)");
  }

  const checkCode = await Coupon.findOne({ code: code.toUpperCase() });
  if (checkCode) throw new Error("Mã coupon đã tồn tại");

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    discountType: discountType || "percentage",
    discountValue,
    minOrderAmount: data.minOrderAmount || 0,
    maxDiscount: data.maxDiscount,
    usageLimit: data.usageLimit,
    validFrom: new Date(validFrom),
    validTo: new Date(validTo),
    applicableCategories: data.applicableCategories || [],
    applicableProducts: data.applicableProducts || [],
    description: data.description,
  });

  return coupon;
};

// Lấy tất cả coupon (admin)
const getAllCoupons = async () => {
  const coupons = await Coupon.find()
    .populate("applicableCategories", "name")
    .populate("applicableProducts", "name");
  return coupons;
};

// Lấy coupon theo ID
const getCouponById = async (id) => {
  const coupon = await Coupon.findById(id);
  if (!coupon) throw new Error("Coupon không tồn tại");
  return coupon;
};

// Cập nhật coupon
const updateCoupon = async (id, data) => {
  const coupon = await Coupon.findByIdAndUpdate(id, data, { new: true });
  if (!coupon) throw new Error("Coupon không tồn tại");
  return coupon;
};

// Xoá coupon
const deleteCoupon = async (id) => {
  const coupon = await Coupon.findByIdAndDelete(id);
  if (!coupon) throw new Error("Coupon không tồn tại");
  return coupon;
};

// Lấy coupon theo code
const getCouponByCode = async (code) => {
  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
  });

  if (!coupon) throw new Error("Coupon không tồn tại");

  const now = new Date();
  if (now > coupon.validTo) {
    throw new Error("Mã coupon hết hạn");
  }

  return coupon;
};

// Xác thực và áp dụng coupon
const validateCoupon = async (code, orderAmount, productIds = [], categoryIds = []) => {
  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
  });

  if (!coupon) throw new Error("Mã coupon không hợp lệ hoặc không tồn tại");

  // Kiểm tra ngày hiệu lực
  const now = new Date();
  if (now < coupon.validFrom || now > coupon.validTo) {
    throw new Error("Mã coupon hết hạn");
  }

  // Kiểm tra giới hạn sử dụng
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new Error("Mã coupon đã hết lượt sử dụng");
  }

  // Kiểm tra giá tối thiểu
  if (orderAmount < coupon.minOrderAmount) {
    throw new Error(
      `Đơn hàng phải tối thiểu ${coupon.minOrderAmount} để sử dụng coupon này`
    );
  }

  // Kiểm tra sản phẩm/danh mục áp dụng
  if (coupon.applicableProducts.length > 0) {
    const isApplicable = productIds.some((id) =>
      coupon.applicableProducts.includes(id)
    );
    if (!isApplicable) {
      throw new Error("Coupon này không áp dụng cho sản phẩm trong đơn hàng");
    }
  }

  if (coupon.applicableCategories.length > 0) {
    const isApplicable = categoryIds.some((id) =>
      coupon.applicableCategories.includes(id)
    );
    if (!isApplicable) {
      throw new Error("Coupon này không áp dụng cho danh mục trong đơn hàng");
    }
  }

  return coupon;
};

// Tính giảm giá
const calculateDiscount = async (code, orderAmount) => {
  const coupon = await validateCoupon(code, orderAmount);

  let discount = 0;
  if (coupon.discountType === "percentage") {
    discount = (orderAmount * coupon.discountValue) / 100;
    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
  } else {
    discount = coupon.discountValue;
  }

  const finalAmount = Math.max(0, orderAmount - discount);

  return {
    couponCode: coupon.code,
    discountAmount: discount,
    finalAmount,
    originalAmount: orderAmount,
  };
};

// Tăng lượt sử dụng coupon
const incrementCouponUsage = async (code) => {
  const coupon = await Coupon.findOneAndUpdate(
    { code: code.toUpperCase() },
    { $inc: { usedCount: 1 } },
    { new: true }
  );

  return coupon;
};

module.exports = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  getCouponByCode,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  calculateDiscount,
  incrementCouponUsage,
};
