const joi = require("joi");
const { emailRegex, phoneNoRegex } = require("../constants");

module.exports.signupValidation = joi.object({
  email: joi.string().pattern(emailRegex),
  phone_number: joi.string().pattern(phoneNoRegex),
  country_code: joi.string().when("phone_number", {
    is: joi.exist(),
    then: joi.required(),
    otherwise: joi.forbidden(),
  }),
});

module.exports.otpVericationValidation = joi.object({
  email: joi.string().pattern(emailRegex),
  // password: joi.when("email", {
  //   is: joi.exist(),
  //   then: joi.string().min(8).required(),
  //   otherwise: joi.string().optional(),
  // }),
  otp: joi.string().required(),
  phone_number: joi.string().pattern(phoneNoRegex),
  country_code: joi.string().when("phone_number", {
    is: joi.exist(),
    then: joi.required(),
    otherwise: joi.forbidden(),
  }),
});

module.exports.loginValidation = joi.object({
  email: joi.string().pattern(emailRegex),
  password: joi.when("email", {
    is: joi.exist(),
    then: joi.string().min(8).required(),
    otherwise: joi.string().optional(),
  }),
  // captchaToken: joi.string().required(),
  phone_number: joi.string().pattern(phoneNoRegex),
  country_code: joi.string().when("phone_number", {
    is: joi.exist(),
    then: joi.required(),
    otherwise: joi.forbidden(),
  }),
});

module.exports.updateProfileValidation = joi.object({
  full_name: joi.string().required(),
  user_name: joi.string().required(),
  address: joi.string().required(),
  password: joi.string().min(8).required(),
  profile_image: joi.string(),
});

module.exports.forgotPasswordValidation = joi.object({
  email: joi.string().pattern(emailRegex).required(),
});

module.exports.passwordValidation = joi.object({
  password: joi.string().min(8).required(),
});

module.exports.changePasswordValidation = joi.object({
  oldPassword: joi.string().min(8).required(),
  password: joi.string().min(8).required(),
});
