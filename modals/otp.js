const moongoose = require("mongoose");

const otpSchema = new moongoose.Schema(
  {
    email: {
      type: String,
    },
    phone_number: {
      type: String,
    },
    country_code: {
      type: String,
    },
    otp: {
      type: String,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
module.exports.otps = moongoose.model("otps", otpSchema);
