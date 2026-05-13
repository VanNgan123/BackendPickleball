/**
 * Validation Middleware Factory
 * Tạo middleware validate request dựa trên Joi schema
 */

/**
 * Validate request body
 * @param {Joi.Schema} schema - Joi validation schema
 */
const validateBody = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false, // Trả về tất cả lỗi, không dừng ở lỗi đầu tiên
            stripUnknown: true, // Loại bỏ các field không được định nghĩa trong schema
        });

        if (error) {
            const errors = error.details.map((detail) => ({
                field: detail.path.join("."),
                message: detail.message,
            }));

            return res.status(400).json({
                status: "ERR",
                message: "Dữ liệu không hợp lệ",
                errors,
            });
        }

        req.body = value; // Gán lại body đã được validate và clean
        next();
    };
};

/**
 * Validate request params
 * @param {Joi.Schema} schema - Joi validation schema
 */
const validateParams = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.params, {
            abortEarly: false,
        });

        if (error) {
            const errors = error.details.map((detail) => ({
                field: detail.path.join("."),
                message: detail.message,
            }));

            return res.status(400).json({
                status: "ERR",
                message: "Tham số URL không hợp lệ",
                errors,
            });
        }

        req.params = value;
        next();
    };
};

/**
 * Validate request query
 * @param {Joi.Schema} schema - Joi validation schema
 */
const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const errors = error.details.map((detail) => ({
                field: detail.path.join("."),
                message: detail.message,
            }));

            return res.status(400).json({
                status: "ERR",
                message: "Query parameters không hợp lệ",
                errors,
            });
        }

        req.query = value;
        next();
    };
};

module.exports = {
    validateBody,
    validateParams,
    validateQuery,
};
