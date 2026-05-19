const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

/**
 * Tạo Access Token (ngắn hạn)
 * @param {Object} payload - Dữ liệu user (id, role)
 * @returns {string} Access token
 */
const generateAccessToken = (payload) => {
    const access_token = jwt.sign(
        { payload },
        process.env.ACCESS_TOKEN,
        { expiresIn: "1h" } // 1 giờ
    );
    return access_token;
};

/**
 * Tạo Refresh Token (dài hạn)
 * @param {Object} payload - Dữ liệu user (id, role)
 * @returns {string} Refresh token
 */
const generateRefreshToken = (payload) => {
    const refresh_token = jwt.sign(
        { payload },
        process.env.REFRESH_TOKEN,
        { expiresIn: "7d" } // 7 ngày
    );
    return refresh_token;
};

/**
 * Tạo cặp Access + Refresh tokens
 * @param {Object} payload - Dữ liệu user
 * @returns {Object} { accessToken, refreshToken }
 */
const generateTokenPair = (payload) => {
    return {
        accessToken: generateAccessToken(payload),
        refreshToken: generateRefreshToken(payload),
    };
};

/**
 * Verify Refresh Token
 * @param {string} token - Refresh token cần xác thực
 * @returns {Object} Decoded payload hoặc throw error
 */
const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN);
        return decoded;
    } catch (error) {
        throw new Error("Refresh token không hợp lệ hoặc đã hết hạn");
    }
};

/**
 * Verify Access Token
 * @param {string} token - Access token cần xác thực
 * @returns {Object} Decoded payload hoặc throw error
 */
const verifyAccessToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        return decoded;
    } catch (error) {
        throw new Error("Access token không hợp lệ hoặc đã hết hạn");
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    generateTokenPair,
    verifyRefreshToken,
    verifyAccessToken,
};