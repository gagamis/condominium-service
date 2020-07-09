const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi)

// validating schema for register condominium
exports.registerSchema = Joi.object().keys({
  name: Joi.string()
    .min(3)
    .max(250)
    .required()
});

exports.addUserSchema = Joi.object().keys({
  condominium_id: Joi.objectId().required(),
  users: Joi.array().items(Joi.objectId()).min(1)
});

exports.deleteUserSchema = Joi.object().keys({
  condominium_id: Joi.objectId().required(),
  users: Joi.array().items(Joi.objectId()).min(1)
});