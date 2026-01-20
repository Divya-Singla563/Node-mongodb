const joi = require("joi");

module.exports.addCategoryValidation = joi.object({
  name: joi.string().required(),
  image: joi.string().required(),
  description: joi.string().optional(),
});

module.exports.addSubCategoryValidation = joi.object({
  name: joi.string().required(),
  image: joi.string().required(),
  category: joi.string().required(),
  description: joi.string().optional(),
});
