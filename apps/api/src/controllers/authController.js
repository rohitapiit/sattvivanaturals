import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

export const register = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      password,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({
  email,
});

const existingPhone = await User.findOne({
  phone,
});

if (
  existingPhone &&
  existingPhone.isVerified
) {
  return res.status(400).json({
    success: false,
    message: "Phone number already registered",
  });
}

if (
  existingUser &&
  existingUser.isVerified
) {
  return res.status(400).json({
    success: false,
    message: "Email already exists",
  });
}

const otp = Math.floor(
  100000 + Math.random() * 900000
).toString();

if (
  existingUser &&
  !existingUser.isVerified
) {
  existingUser.otp = otp;

  existingUser.otpExpiry =
    Date.now() + 10 * 60 * 1000;

  await existingUser.save();

  await sendEmail(
  email,
  "Welcome to SattViva Naturals - Verify Your Email",
  `
Hello ${existingUser.name},

Welcome to SattViva Naturals!

Thank you for creating an account with us. We're excited to have you join our community that values purity, tradition, and wholesome nutrition.

To complete your registration and secure your account, please verify your email address using the OTP below:

OTP: ${otp}

If you did not create an account with SattViva Naturals, you can safely ignore this email.

Once verified, you'll be able to:

• Track your orders
• Save delivery addresses
• Access exclusive offers and updates
• Enjoy a faster checkout experience

Thank you for choosing SattViva Naturals.

When Purity Meets Life

Warm Regards,
Team SattViva Naturals
www.sattvivanaturals.com
`
);

  return res.status(200).json({
    success: true,
    message:
      "OTP resent successfully",
  });
}

console.log("1. Register request received");
    const hashedPassword = await bcrypt.hash(password, 10);

   

    const user = await User.create({
      name,
      phone,
      email,
      password: hashedPassword,
      otp,
      otpExpiry:
        Date.now() + 10 * 60 * 1000,
    });

await sendEmail(
  email,
  "Welcome to SattViva Naturals - Verify Your Email",
  `
Hello ${user.name},

Welcome to SattViva Naturals!

Thank you for creating an account with us. We're excited to have you join our community that values purity, tradition, and wholesome nutrition.

To complete your registration and secure your account, please verify your email address using the OTP below:

OTP: ${otp}

If you did not create an account with SattViva Naturals, you can safely ignore this email.

Once verified, you'll be able to:

• Track your orders
• Save delivery addresses
• Access exclusive offers and updates
• Enjoy a faster checkout experience

Thank you for choosing SattViva Naturals.

When Purity Meets Life

Warm Regards,
Team SattViva Naturals
www.sattvivanaturals.com
`
);
    res.status(201).json({
      success: true,
      message: "OTP sent to your email",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
  console.log("REGISTER ERROR:");
  console.log(error);
  console.log(error.stack);

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log("LOGIN EMAIL:", email);
console.log("USER FOUND:", user);

if (user) {
  console.log("DB PASSWORD:", user.password);
}

console.log("ENTERED PASSWORD:", password);

    if (!user) {
  return res.status(404).json({
    success: false,
    field: "email",
    message: "No account found. Please register first.",
  });
}
    if (!user.isVerified) {

      console.log("EMAIL NOT FOUND");
  return res.status(400).json({
    success: false,
    message:
      "Please verify your email first",
  });
}


    const isMatch = await bcrypt.compare(
  password,
  user.password
);

console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {

      console.log("PASSWORD WRONG");
  return res.status(401).json({
    success: false,
    field: "password",
    message: "Incorrect password. Please try again.",
  });
}

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    console.log("DB OTP:", user.otp);
console.log("Entered OTP:", otp);
console.log("DB OTP type:", typeof user.otp);
console.log("Entered OTP type:", typeof otp);
console.log("OTP Expiry:", user.otpExpiry);
console.log("Current Time:", Date.now());

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already verified",
      });
    }

    const expiryTime = new Date(
  user.otpExpiry
).getTime();

if (
  user.otp.toString() !==
    otp.toString() ||
  expiryTime < Date.now()
) {
  return res.status(400).json({
    success: false,
    message: "Invalid or expired OTP",
  });
}

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const resendOtp = async (
  req,
  res
) => {
  try {
    const { email } = req.body;

    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message:
          "User already verified",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.otp = otp;

    user.otpExpiry =
      Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendEmail(
  email,
  "Welcome to SattViva Naturals - Verify Your Email",
  `
Hello ${user.name},

Welcome to SattViva Naturals!

Thank you for creating an account with us. We're excited to have you join our community that values purity, tradition, and wholesome nutrition.

To complete your registration and secure your account, please verify your email address using the OTP below:

OTP: ${otp}

If you did not create an account with SattViva Naturals, you can safely ignore this email.

Once verified, you'll be able to:

• Track your orders
• Save delivery addresses
• Access exclusive offers and updates
• Enjoy a faster checkout experience

Thank you for choosing SattViva Naturals.

When Purity Meets Life

Warm Regards,
Team SattViva Naturals
www.sattvivanaturals.com
`
);

    res.status(200).json({
      success: true,
      message:
        "OTP resent successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

  

    console.log(user);
console.log(user.name);

   await sendEmail(
  email,
  "Welcome to SattViva Naturals - Verify Your Email",
  `
Hello ${user.name},

Welcome to SattViva Naturals!

To change your password and secure your account, please verify your email address using the OTP below:

Your OTP for password reset is ${otp}

If you did not request for forget password with SattViva Naturals, you can safely ignore this email.


Thank you for choosing SattViva Naturals.

When Purity Meets Life

Warm Regards,
Team SattViva Naturals
www.sattvivanaturals.com
`
);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });

    console.log("DB OTP:", user.otp);
console.log("Entered OTP:", otp);
console.log("DB OTP type:", typeof user.otp);
console.log("Entered OTP type:", typeof otp);
console.log("OTP Expiry:", user.otpExpiry);
console.log("Current Time:", Date.now());

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
  user.otp?.toString() !== otp?.toString() ||
  new Date(user.otpExpiry).getTime() < Date.now()
) {
  return res.status(400).json({
    success: false,
    message: "Invalid or expired OTP",
  });
}

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};