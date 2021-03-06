const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //creating a transporter
  const transporter = nodemailer.createTransport({
    // service: 'serviceName like gmail',// USE mailtrap
    // port: 467,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAil_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //define  the email options
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: options.email,
    subject: options.subject,
    html: options.html,
    text: options.message,
  };
  //now send email
  await transporter.sendEmail(mailOptions);
};

const jwt = require('jsonwebtoken');

exports.signToken = async (payload) => {
  await jwt.sign({ id: payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

module.exports = sendEmail;
