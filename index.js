const express = require("express");
const { connectDB } = require("./db/db");
require("dotenv").config();
const Messages = require("./constants/messages").en;
const app = express();
const routes = require("./routes");
const cors = require("cors");

// ===== CORS Middleware =====
app.use(
  cors({
    origin: "*", // or put your frontend URL: "http://localhost:8000"
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

//middlewares
app.use(express.json());
app.use("/api", routes);

app.use((error, req, res, next) => {
  res.status(error.status || 400).json({
    success: false,
    message: error.message || Messages.INTERNAL_SERVER_ERROR,
  });
});

// cron.schedule("*/1 * * * *", () => {
//   try {
//     let OTP = Math.floor(1000 + Math.random() * 9000);
//     sendEmail("divya@yopmail.com", OTP);
//     console.log("cron running");
//   } catch (error) {
//     console.log("[JS] index.js:33 - error: cron", error);
//   }
// });

app.listen(process.env.PORT, () => {
  console.log(`SERVER STARTED ON PORT ${process.env.PORT}`);
  connectDB();
});

// var express = require("express");
// var multer = require("multer");
// var port = 3000;

// var app = express();

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
// var upload = multer({ storage: storage });
// // app.use(express.static(__dirname + "/public"));
// // app.use("/uploads", express.static("uploads"));

// app.post("/upload-single", upload.single("file"), function (req, res, next) {
//   console.log("[JS] index.js:52 - req:", req.protocol, req.get("host"));
//   const fileUrl =
//     req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename;

//   return res.json({
//     success: true,
//     message: "File uploaded successfully",
//     url: fileUrl,
//   });
// });

// app.post(
//   "/upload-multiple",
//   upload.array("files", 12),
//   function (req, res, next) {
//     const files = req.files.map((file) => ({
//       filename: file.filename,
//       url: req.protocol + "://" + req.get("host") + "/uploads/" + file.filename,
//     }));

//     return res.json({
//       success: true,
//       message: "Files uploaded successfully",
//       files: files,
//     });
//   }
// );

// app.listen(port, () => console.log(`Server running on port ${port}!`));
