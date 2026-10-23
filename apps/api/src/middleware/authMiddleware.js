import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
        code: "AUTH_REQUIRED",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token || token === "null" || token === "undefined") {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing.",
        code: "AUTH_REQUIRED",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    if (error?.name === "TokenExpiredError") {
      console.warn(
        "JWT expired:",
        error.expiredAt?.toISOString?.() || error.expiredAt
      );

      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
        code: "TOKEN_EXPIRED",
      });
    }

    if (error?.name === "JsonWebTokenError") {
      console.warn("Invalid JWT:", error.message);

      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
        code: "INVALID_TOKEN",
      });
    }

    console.error("JWT ERROR:", error);

    return res.status(401).json({
      success: false,
      message: "Authentication failed.",
      code: "AUTH_FAILED",
    });
  }
};

// Guest Checkout
export const optionalAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(" ")[1];

    if (!token || token === "null" || token === "undefined") {
      req.user = null;
      return next();
    }

    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    req.user = null;
    next();
  }
};

export default authMiddleware;
