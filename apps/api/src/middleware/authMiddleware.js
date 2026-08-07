import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;


    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];


    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

  

    req.user = decoded;

    next();
  } catch (error) {

     console.log("JWT ERROR:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// ------Guest Checkout---------

export const optionalAuthMiddleware = (
  req,
  res,
  next
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      req.user = null;
      return next();
    }

    const token =
      authHeader.split(" ")[1];

    if (
      !token ||
      token === "null" ||
      token === "undefined"
    ) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

export default authMiddleware;