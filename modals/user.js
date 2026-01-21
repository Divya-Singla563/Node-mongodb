const moongoose = require("mongoose");

const userSchema = new moongoose.Schema(
  {
    full_name: {
      type: String,
    },
    user_name: {
      type: String,
    },
    address: {
      type: String,
    },
    email: {
      type: String,
    },
    phone_number: {
      type: String,
    },
    country_code: {
      type: String,
    },
    password: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneNumberVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    profile_image: {
      type: String,
    },
    image_public_id: {
      type: String, // Cloudinary public_id
    },
    socialProvider: {
      type: String,
      enum: ["google", "facebook", "apple", null],
      default: null,
    },
    googleId: { type: String, default: null },
    facebookId: { type: String, default: null },
    appleId: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

module.exports.users = moongoose.model("users", userSchema);
