const mongoose = require("mongoose");

module.exports.connectDB = async () => {
  try {
    let res = await mongoose.connect("mongodb://localhost:27017/divyaNode");

    console.log("DB CONNECTED");
  } catch (error) {
    console.log("DB NOT CONNECTED ", error);
  }
};
