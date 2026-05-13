const Joi = require("joi");

// Schema đăng ký user
const registerSchema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
        "string.empty": "Tên không được để trống",
        "string.min": "Tên phải có ít nhất 2 ký tự",
        "string.max": "Tên không được vượt quá 100 ký tự",
        "any.required": "Tên là bắt buộc",
    }),
    email: Joi.string().email().required().messages({
        "string.empty": "Email không được để trống",
        "string.email": "Email không hợp lệ",
        "any.required": "Email là bắt buộc",
    }),
    password: Joi.string().min(6).max(128).required().messages({
        "string.empty": "Mật khẩu không được để trống",
        "string.min": "Mật khẩu phải có ít nhất 6 ký tự",
        "string.max": "Mật khẩu không được vượt quá 128 ký tự",
        "any.required": "Mật khẩu là bắt buộc",
    }),
    phone: Joi.string()
        .pattern(/^[0-9]{10,11}$/)
        .optional()
        .messages({
            "string.pattern.base": "Số điện thoại phải có 10-11 chữ số",
        }),
});

// Schema đăng nhập
const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "Email không được để trống",
        "string.email": "Email không hợp lệ",
        "any.required": "Email là bắt buộc",
    }),
    password: Joi.string().required().messages({
        "string.empty": "Mật khẩu không được để trống",
        "any.required": "Mật khẩu là bắt buộc",
    }),
});

// Schema refresh token
const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required().messages({
        "string.empty": "Refresh token không được để trống",
        "any.required": "Refresh token là bắt buộc",
    }),
});

module.exports = {
    registerSchema,
    loginSchema,
    refreshTokenSchema,
};
