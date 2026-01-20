const {
  addCategoryValidation,
  addSubCategoryValidation,
} = require("./category");
const {
  signupValidation,
  loginValidation,
  otpVericationValidation,
  forgotPasswordValidation,
  passwordValidation,
  updateProfileValidation,
  changePasswordValidation,
} = require("./user");

module.export = {
  signupValidation,
  otpVericationValidation,
  passwordValidation,
  forgotPasswordValidation,
  updateProfileValidation,
  loginValidation,
  changePasswordValidation,
  //category and sub category validation
  addCategoryValidation,
  addSubCategoryValidation,
};
