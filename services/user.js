const dayjs = require("dayjs");
const bcrypt = require("bcryptjs");
const { users, otps } = require("../modals");
const {
  sendEmail,
  sendOTPToPhone,
  sendOTPToPhoneViaMSG,
} = require("../utils/mailer");
const { createToken } = require("../utils/token");
const Messages = require("../constants/messages").en;

module.exports.signup = async (data) => {
  try {
    const { email, phone_number, country_code } = data;
    if (email || phone_number) {
      const checkVerification = await users.findOne({
        $or: [
          email ? { email, isEmailVerified: true } : null,
          phone_number ? { phone_number, isPhoneNumberVerified: true } : null,
        ].filter(Boolean),
      });
      if (checkVerification) {
        throw new Error(Messages.ALREADY_VERIFIED);
      }

      let OTP = Math.floor(1000 + Math.random() * 9000);
      // if (email) {
      //   OTP = 1234;
      // } else {
      //   OTP = 1234;
      // }

      const expiresOtpAt = dayjs().add(10, "minutes").toDate();
      if (email) {
        sendEmail(email, OTP);
      }

      if (phone_number) {
        // sendOTPToPhone(`${country_code}${phone_number}`, OTP);

        const formattedCountryCode = country_code.replace(/^\+/, "");
        sendOTPToPhoneViaMSG(`${formattedCountryCode}${phone_number}`, OTP);
      }

      otps.create({
        email,
        phone_number,
        country_code,
        expiresAt: expiresOtpAt,
        otp: OTP,
      });
      return {
        message: Messages.OTP_SEND,
        statusCode: 200,
      };
    }
  } catch (error) {
    console.log("error: ", error);
    throw error;
  }
};

module.exports.verify = async (data) => {
  try {
    const { email, otp, phone_number, password, country_code } = data;

    const identifier = email ? { email } : { phone_number };

    const document = await otps.findOne(identifier);
    if (!document) {
      throw new Error(Messages.USER_NOT_FOUND);
    }

    const existingUser = await users.findOne(identifier);
    if (existingUser) {
      throw new Error(Messages.ALREADY_VERIFIED);
    }

    if (document.otp !== otp) {
      throw new Error(Messages.INVALID_OTP);
    }

    // Create new user
    const newUser = await users.create({
      email,
      phone_number,
      country_code,
    });

    // Mark verified and get lean user object
    const updatedUser = await users.findByIdAndUpdate(
      newUser._id,
      {
        $set: email
          ? { isEmailVerified: true }
          : { isPhoneNumberVerified: true },
      },
      { new: true, lean: true } // 🔥 RETURN CLEAN PLAIN OBJECT
    );

    // Delete OTP
    await otps.findByIdAndDelete(document._id);

    // Generate token
    const tokenData = { id: updatedUser._id };
    const token = await createToken(tokenData);

    return {
      data: {
        token,
        ...updatedUser, // 🔥 already lean → no mongoose metadata
      },
      message: Messages.USER_VERIFIED,
      statusCode: 200,
    };
  } catch (error) {
    console.log("error:service verify ", error);
    throw error;
  }
};

module.exports.verify = async (data) => {
  try {
    const { email, otp, phone_number, password, country_code } = data;
    const identifier = email ? { email } : { phone_number };
    const document = await otps.findOne(identifier);
    if (!document) {
      throw new Error(Messages.USER_NOT_FOUND);
    }

    const findUser = await users.findOne(identifier);
    if (findUser) {
      throw new Error(Messages.ALREADY_VERIFIED);
    }
    if (document && document.otp !== otp) {
      throw new Error(Messages.INVALID_OTP);
    }

    // if (email && !password) {
    //   throw new Error(Messages.PASSWORD_IS_REQUIRED);
    // }

    if (document) {
      const newUser = new users({
        email,
        phone_number,
        country_code,
        // password,
      });
      console.log("newUser: ", newUser);
      await newUser.save();

      if (newUser) {
        const updatedUser = await users.findByIdAndUpdate(
          newUser._id,
          {
            $set: email
              ? { isEmailVerified: true }
              : { isPhoneNumberVerified: true },
          },
          { new: true, lean: true }
        );

        await otps.findByIdAndDelete(document._id);

        const tokenData = {
          id: newUser._id,
        };

        const token = await createToken(tokenData);
        console.log("token: ", token);

        return {
          data: { token, ...updatedUser },
          message: Messages.USER_VERIFIED,
          statusCode: 200,
        };
      }
    }
    return { message: Messages.OTP_VERIFIED };
  } catch (error) {
    console.log("error:service verify ", error);
    throw error;
  }
};

module.exports.forgotPassword = async (data) => {
  try {
    const { email } = data;
    const user = await users.findOne({ email });

    if (!user) {
      throw new Error(Messages.USER_NOT_FOUND);
    }

    let OTP;

    const expiresOtpAt = dayjs().add(10, "minutes").toDate();
    if (email) {
      OTP = 1234;
      sendEmail(email, OTP);
    }
    otps.create({
      email,
      expiresAt: expiresOtpAt,
      otp: OTP,
    });
    return {
      message: Messages.OTP_SEND,
      statusCode: 200,
    };
  } catch (error) {
    console.log(error, "forgot service error");
    throw error;
  }
};

module.exports.forgotPasswordVerification = async (data) => {
  try {
    const { email, otp, phone_number } = data;

    const identifier = email ? { email } : { phone_number };

    const document = await otps.findOne(identifier);
    if (!document) {
      throw new Error(Messages.USER_NOT_FOUND);
    }

    const findUser = await users.findOne(identifier).lean();
    if (!findUser) {
      throw new Error(Messages.USER_NOT_FOUND);
    }

    if (document.otp !== otp) {
      throw new Error(Messages.INVALID_OTP);
    }

    // OTP is correct → delete OTP
    await otps.findByIdAndDelete(document._id);

    // Create token for the USER (not the OTP document)
    const tokenData = { id: findUser._id };
    const token = await createToken(tokenData);

    delete findUser.password;

    return {
      data: {
        token,
        ...findUser,
      },
      message: Messages.USER_VERIFIED,
      statusCode: 200,
    };
  } catch (error) {
    console.log("error:service verify ", error);
    throw error;
  }
};

module.exports.login = async (data) => {
  try {
    const { email, password, phone_number, country_code, captchaToken } = data;

    // if (!captchaToken) {
    //   throw new Error(
    //     "Captcha verification failed. Please check 'I'm not a robot'."
    //   );
    // }

    // // const captchaVerifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${captchaToken}`;
    // // const googleRes = await fetch(captchaVerifyURL, { method: "POST" });
    // // const captchaResponse = await googleRes.json();

    // // if (!captchaResponse.success) {
    // //   throw new Error("Captcha validation unsuccessful. Try again.");
    // // }

    let user;
    if (email) {
      user = await users.findOne({ email }).lean();
    } else if (phone_number) {
      user = await users.findOne({ phone_number, country_code }).lean();
    } else {
      throw new Error(Messages.USER_NOT_FOUND);
    }

    if (!user) {
      throw new Error(Messages.USER_NOT_FOUND);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error(Messages.INVALID_PASSWORD);
    }

    const tokenData = {
      id: user._id,
    };
    const token = await createToken(tokenData);
    delete user.password;

    return {
      data: {
        token,
        ...user,
      },
      message: Messages.LOGIN_SUCCESS,
      statusCode: 200,
    };
  } catch (error) {
    console.log("login service", error);
    throw error;
  }
};

module.exports.updateProfileService = async (data, userId) => {
  try {
    if (data?.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    const updatedUser = await users.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true, lean: true }
    );
    if (updatedUser.password) {
      updatedUser.password = undefined;
    }
    return {
      data: updatedUser,
      message: Messages.PROFILE_UPDATED,
      statusCode: 200,
    };
  } catch (error) {
    console.log("error: service updateProfileService", error);
    throw error;
  }
};

module.exports.resetPassword = async (data, userId) => {
  try {
    const { password } = data;
    let hashedPassword;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }
    const updatedUser = await users.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true, lean: true }
    );
    delete updatedUser.password;
    return {
      statusCode: 200,
      message: Messages.PASSWORD_RESET,
      data: updatedUser,
    };
  } catch (error) {
    console.log("reset password service", error);
    throw error;
  }
};

module.exports.changePassword = async (data, userId) => {
  try {
    const { password, oldPassword } = data;
    let user;
    user = await users.findOne({ _id: userId }).lean();
    const isOldPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordMatch) {
      throw new Error(Messages.INVALID_PASSWORD);
    }

    let hashedPassword;
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await users.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true, lean: true }
    );

    delete updatedUser.password;
    return {
      statusCode: 200,
      message: Messages.PASSWORD_CHANGED,
      data: updatedUser,
    };
  } catch (error) {
    console.log("reset password service", error);
    throw error;
  }
};

module.exports.getProfile = async (userId) => {
  try {
    // const user = await users.findOne({ _id: userId },{ email: 1, full_name: 1, _id: 0 }).lean(); // projection example
    const user = await users.findOne({ _id: userId }).lean();
    delete user.password;
    return { statusCode: 200, message: Messages.SUCCESS, data: user };
  } catch (error) {
    console.log(error, "get profile");
    throw error;
  }
};
