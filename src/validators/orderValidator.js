const Joi = require("joi");

// Schema địa chỉ giao hàng
const shippingAddressSchema = Joi.object({
    fullName: Joi.string().min(2).max(100).required().messages({
        "string.empty": "Họ tên không được để trống",
        "any.required": "Họ tên là bắt buộc",
    }),
    phone: Joi.string()
        .pattern(/^[0-9]{10,11}$/)
        .required()
        .messages({
            "string.pattern.base": "Số điện thoại phải có 10-11 chữ số",
            "any.required": "Số điện thoại là bắt buộc",
        }),
    address: Joi.string().required().messages({
        "string.empty": "Địa chỉ không được để trống",
        "any.required": "Địa chỉ là bắt buộc",
    }),
    city: Joi.string().optional(),
    district: Joi.string().optional(),
    ward: Joi.string().optional(),
});

// Schema item trong đơn hàng
const orderItemSchema = Joi.object({
    productId: Joi.string().required().messages({
        "string.empty": "ID sản phẩm không được để trống",
        "any.required": "ID sản phẩm là bắt buộc",
    }),
    qty: Joi.number().integer().min(1).required().messages({
        "number.base": "Số lượng phải là số",
        "number.min": "Số lượng phải ít nhất là 1",
        "any.required": "Số lượng là bắt buộc",
    }),
    price: Joi.number().min(0).optional(),
});

// Schema tạo đơn hàng
const createOrderSchema = Joi.object({
    items: Joi.array().items(orderItemSchema).min(1).required().messages({
        "array.min": "Đơn hàng phải có ít nhất 1 sản phẩm",
        "any.required": "Danh sách sản phẩm là bắt buộc",
    }),
    shippingAddress: shippingAddressSchema.required().messages({
        "any.required": "Địa chỉ giao hàng là bắt buộc",
    }),
    paymentMethod: Joi.string()
        .valid("COD", "CreditCard", "Momo", "BankTransfer")
        .default("COD")
        .messages({
            "any.only":
                "Phương thức thanh toán phải là COD, CreditCard, Momo hoặc BankTransfer",
        }),
});

// Schema tạo đơn hàng từ giỏ hàng
const createOrderFromCartSchema = Joi.object({
    shippingAddress: shippingAddressSchema.required().messages({
        "any.required": "Địa chỉ giao hàng là bắt buộc",
    }),
    paymentMethod: Joi.string()
        .valid("COD", "CreditCard", "Momo", "BankTransfer")
        .default("COD"),
});

// Schema cập nhật trạng thái đơn hàng
const updateOrderStatusSchema = Joi.object({
    status: Joi.string()
        .valid("Pending", "Confirmed", "Shipping", "Completed", "Cancelled")
        .required()
        .messages({
            "any.only":
                "Trạng thái phải là Pending, Confirmed, Shipping, Completed hoặc Cancelled",
            "any.required": "Trạng thái là bắt buộc",
        }),
});

module.exports = {
    createOrderSchema,
    createOrderFromCartSchema,
    updateOrderStatusSchema,
};
