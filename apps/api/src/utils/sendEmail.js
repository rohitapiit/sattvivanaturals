import dotenv from "dotenv";

dotenv.config();
import nodemailer from "nodemailer";


console.log("SERVER EMAIL = ", process.env.EMAIL_USER);

console.log("EMAIL_USER = ", process.env.EMAIL_USER);
console.log("EMAIL_PASS = ", process.env.EMAIL_PASS);
console.log("EMAIL_HOST = ", process.env.EMAIL_HOST);
console.log("EMAIL_PORT = ", process.env.EMAIL_PORT);





const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});



transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP ERROR:", error);
  } else {
    console.log("SMTP READY");
  }
});

const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });

    console.log("✅ Email sent to:", to);
    console.log(info.messageId);

    return true;
  } catch (error) {
    console.error("❌ Email failed:", to);
    console.error(error);

    return false;
  }
};

export default sendEmail;