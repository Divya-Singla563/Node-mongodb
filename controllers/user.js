const { user } = require("../services");
const {
  signupValidation,
  otpVericationValidation,
  updateProfileValidation,
  loginValidation,
  forgotPasswordValidation,
  passwordValidation,
  changePasswordValidation,
  firebaseValidation
} = require("../validations/user");

module.exports.signup = async (req, res, next) => {
  try {
    const { error } = signupValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const result = await user.signup(req.body);
    return res.status(200).json({ message: result?.message });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

module.exports.verify = async (req, res, next) => {
  try {
    const { error } = otpVericationValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const result = await user.verify(req.body);
    console.log("result: ", result);
    return res.status(200).json(result);
  } catch (error) {
    console.log("verification error: ", error);
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { error } = loginValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const result = await user.login(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.log("login controller error", error);
    next(error);
  }
};

module.exports.firebaseLogin = async (req, res, next) => {
  try {
    const { error } = firebaseValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const result = await user.firebaseLogin(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.log("login controller error", error);
    next(error);
  }
};

module.exports.forgotPassword = async (req, res, next) => {
  try {
    const { error } = forgotPasswordValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const result = await user.forgotPassword(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.log("forgot controller error", error);
    next(error);
  }
};

module.exports.forgotPasswordVerification = async (req, res, next) => {
  try {
    const { error } = otpVericationValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const result = await user.forgotPasswordVerification(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.log("forgot controller error", error);
    next(error);
  }
};

module.exports.updateProfile = async (req, res, next) => {
  try {
    const { error } = updateProfileValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { id } = req.user;
    const result = await user.updateProfileService(req.body, id);
    console.log(result, "result");
    return res.status(200).json(result);
  } catch (error) {
    console.log("error:update", error);
    next(error);
  }
};

module.exports.resetPassword = async (req, res, next) => {
  try {
    const { error } = passwordValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message || "" });
    }
    const { id } = req.user;
    const result = await user.resetPassword(req.body, id);
    return res.status(200).json(result);
  } catch (error) {
    console.log("reset error", error);
    next(error);
  }
};

module.exports.changePassword = async (req, res, next) => {
  try {
    const { error } = changePasswordValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message || "" });
    }
    const { id } = req.user;
    const result = await user.changePassword(req.body, id);
    return res.status(200).json(result);
  } catch (error) {
    console.log("reset error", error);
    next(error);
  }
};

module.exports.getProfile = async (req, res, next) => {
  try {
    const { id } = req.user;
    const result = await user.getProfile(id);
    return res.status(200).json(result);
  } catch (error) {
    console.log(error, "get profile");
    next(error);
  }
};

const { users, } = require("../modals");

