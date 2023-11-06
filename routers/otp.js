const otpGenerator = require("otp-generator");
const sql = require("mssql");
const nodemailer = require("nodemailer");
const express = require("express");
const app = express();
const cors = require("cors");
var router = require("express").Router();

router.post("/", async (req, res) => {
  const checkEmail = req.body.email;
  const otp = generateOTP(checkEmail);
  // sendMail(otp)
  finalOTP = otp;
  res.json({
    result: "Success",
    message: "OTP sent successfully to your email for verification.",
    otp: otp,
  });
});

// const { OTP_LENGTH, OTP_CONFIG } = require('../constants/constants');

const generateOTP = (checkEmail) => {
  const OTP = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  sendEmail(OTP, checkEmail);
  return OTP;
};

function sendEmail(OTP, checkEmail) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp@gmail.com",
    port: 587,
    secureConnection: false, // true for 465, false for other ports
    auth: {
      user: "@gmail.com", // generated ethereal user
      pass: "", // generated ethereal password
    },
  });

  // setup email data with unicode symbols

  var mailOptions = {
    from: "@gmail.com", // sender address
    to: `${checkEmail}`, // list of receIVers
    cc: "@gmail.com",
    subject: "Validation OTP", // Subject line
    html: ` <html>
    <body style="font-family: Arial, sans-serif;">
      <h1>Hello Dear,</h1>
      <p>We hope this message finds you well.</p>
      <p>Your One-Time Password (OTP) for verification is:</p>
      <h2 style="background-color: #007BFF;width: fit-content; color: #fff; padding: 10px 20px; border-radius: 5px;">${OTP}</h2>
      <p>This OTP is essential to confirm your identity securely.</p>
      <p>Please do not share this OTP with anyone for your safety.</p>
      <p>If you didn't request this OTP, please ignore this message.</p>
      <p>Thank you for choosing our service!</p>
      <p>Best regards,</p>
      <p>- GHOST</p>
    </body>
  </html>`,
  };
  // send mail with defined transport object

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Sent Success");
    }
  });
}

module.exports = router;
