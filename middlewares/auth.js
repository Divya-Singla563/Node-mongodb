const jwt = require("jsonwebtoken");

module.exports.authVerify = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authorization.split("Bearer ")[1];
    console.log("[JS] auth.js:10 - token:", token);

    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded?.data;

    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// //new way
// const jwt = require("jsonwebtoken");
// const Model = require("../model");

// module.exports.authverify = async (req, res, next) => {
//   try {
//     const authorization = req.headers.authorization;
//     if (!authorization) return res.Unauthorized({ message: "Unauthorized" });

//     const token = authorization.split("Bearer ")[1];
//     if (!token) return res.Unauthorized({ message: "Token not found" });

//     const decoded = jwt.verify(token, process.env.SECRET_KEY);
//     const userId = decoded?.tokendata?.id;

//     const blacklisted = await Model.session.findOne({ userId });
//     if (!blacklisted)
//       return res.Unauthorized({ message: "Token invalid: user logged out" });

//     const findUser = await Model.user.findById(userId);
//     if (!findUser) return res.status(401).json({ message: "User not found" });

//     if (findUser.isBlocked === "true")
//       return res.status(403).json({ message: "Blocked by admin" });
//     if (findUser.isDeleted === "true")
//       return res.status(403).json({ message: "Deleted by admin" });

//     req.user = findUser;
//     next();
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };

// // const jwt = require("jsonwebtoken");
// // const Model = require("../model");

// // module.exports.authverify = async (req, res, next) => {
// //   try {
// //     const authorization = req.headers.authorization;
// //     if (!authorization) {
// //       return res.status(401).json({ message: "Unauthorization" });
// //     }
// //     const token = authorization.split("Bearer ")[1];
// //     console.log("token", token);
// //     if (!token) {
// //       return res.status(404).json({ message: "token not found" });
// //     }
// //     const decode = jwt.verify(token, process.env.SECRET_KEY);
// //     const userId = decode?.tokendata.id;

// //     const findUser = await Model.user.findById(userId);
// //     if (!findUser) {
// //       return res.status(401).json({ message: "user not found" });
// //     }
// //     if (findUser.isBlocked === "true") {
// //       return res
// //         .status(403)
// //         .json({ message: "Access denied: You are blocked by admin" });
// //     }
// //      if (findUser.isDeleted === "true") {
// //       return res
// //         .status(403)
// //         .json({ message: "Access denied: You are deleted by admin" });
// //     }
// //     req.user = findUser;

// //     return next();
// //   } catch (error) {
// //     console.log(error);
// //     next(error);
// //   }
// // };
