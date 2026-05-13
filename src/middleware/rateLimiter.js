const rateLimit = require("express-rate-limit");

// General API rate limiter: 500 requests per 15 minutes
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 500, // Giới hạn 500 requests mỗi IP
    message: {
        status: "ERR",
        message: "Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút.",
    },
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

// Strict limiter for auth routes: 5 requests per 15 minutes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 5, // Chỉ 5 lần thử đăng nhập/đăng ký
    message: {
        status: "ERR",
        message: "Quá nhiều lần thử đăng nhập, vui lòng thử lại sau 15 phút.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Không tính những request thành công
});

module.exports = {
    generalLimiter,
    authLimiter,
};
