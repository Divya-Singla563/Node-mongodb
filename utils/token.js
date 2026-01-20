const jwt = require("jsonwebtoken");

module.exports.createToken = async (data) => {
  const expiresIn = "1d";
  const secretKey = process.env.SECRET_KEY;

  return jwt.sign({ data }, secretKey, { expiresIn });
};
