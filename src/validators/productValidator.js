const Joi = require("joi");

// Schema tạo sản phẩm
const createProductSchema = Joi.object({
    name: Joi.string().min(2).max(200).required().messages({
        "string.empty": "Tên sản phẩm không được để trống",
        "string.min": "Tên sản phẩm phải có ít nhất 2 ký tự",
        "any.required": "Tên sản phẩm là bắt buộc",
    }),
    price: Joi.number().min(0).required().messages({
        "number.base": "Giá phải là số",
        "number.min": "Giá không được âm",
        "any.required": "Giá là bắt buộc",
    }),
    salePrice: Joi.number().min(0).optional().messages({
        "number.base": "Giá khuyến mãi phải là số",
        "number.min": "Giá khuyến mãi không được âm",
    }),
    description: Joi.string().max(5000).optional(),
    brand: Joi.string().max(100).optional(),
    categories: Joi.alternatives()
        .try(Joi.array().items(Joi.string()), Joi.string())
        .optional(),
    stock: Joi.number().integer().min(0).default(0).messages({
        "number.base": "Số lượng tồn kho phải là số",
        "number.min": "Số lượng tồn kho không được âm",
    }),
    specs: Joi.alternatives().try(Joi.object(), Joi.string()).optional(),
});

// Schema cập nhật sản phẩm
const updateProductSchema = Joi.object({
    name: Joi.string().min(2).max(200).optional(),
    price: Joi.number().min(0).optional(),
    salePrice: Joi.number().min(0).optional(),
    description: Joi.string().max(5000).optional(),
    brand: Joi.string().max(100).optional(),
    categories: Joi.alternatives()
        .try(Joi.array().items(Joi.string()), Joi.string())
        .optional(),
    stock: Joi.number().integer().min(0).optional(),
    specs: Joi.alternatives().try(Joi.object(), Joi.string()).optional(),
});

module.exports = {
    createProductSchema,
    updateProductSchema,
};
