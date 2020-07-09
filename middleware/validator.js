const Joi = require("joi");

const validator = (schema, property) => {
    return (req, res, next) => {
      const { error } = Joi.validate(req.body, schema, {
        allowUnknown: true,
        abortEarly: false
      });
      const valid = error == null;
  
      if (valid) {
        next();
      } else {
        const { details } = error;
        const errors = details.map(i => {
          return { entity: i.path[0], message: i.message };
        });
        res.status(422).json({ success: false, statusCode: 422, errors: errors });
      }
    };
  };
  
  module.exports = validator;

  