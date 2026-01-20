const nodemailer = require("nodemailer");
const twilio = require("twilio");
const axios = require("axios");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

module.exports.sendInvoice = async (to, filePath) => {
  try {
    await transport.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Your Invoice",
      text: "Please find attached your invoice.",
      attachments: [
        {
          filename: "invoice.pdf",
          path: filePath,
        },
      ],
    });

    console.log("Invoice email sent successfully");
  } catch (error) {
    console.error("Invoice email failed:", error);
  }
};
module.exports.sendEmail = async (to, OTP) => {
  try {
    await transport.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "OTP for sign up",
      text: `OTP ${OTP}`,
    });
  } catch (error) {
    console.log("otp not send: ", error);
  }
};

module.exports.sendOTPToPhone = async (to, OTP) => {
  try {
    await client.messages.create({
      body: `Your OTP is ${OTP}`,
      to,
      from: process.env.TWILIO_PHONE,
    });
  } catch (error) {
    console.log("[JS] mailer.js:28 - error phone otp:", error);
  }
};

module.exports.sendOTPToPhoneViaMSG = async (to, OTP) => {
  try {
    const response = await axios.post(
      `https://control.msg91.com/api/v5/otp?authkey=${process.env.MSG91_AUTH_KEY}&template_id=${process.env.MSG91_TEMPLATE_ID}&mobile=${to}&otp_expiry=5&realTimeResponse=true`,
      { OTP }, // must match the placeholder in template
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    console.log("MSG91 response:", response.data);
    console.log("OTP sent to:", to, "OTP:", OTP);
  } catch (error) {
    console.error(error.response?.data || error.message);
  }
};
