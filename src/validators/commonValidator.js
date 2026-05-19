const Joi = require("joi");

const mongoIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const mongoIdWithIndexSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
  index: Joi.number().integer().min(0).required(),
});

const userIdSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(),
});

module.exports = {
  mongoIdSchema,
  mongoIdWithIndexSchema,
  userIdSchema,
};
