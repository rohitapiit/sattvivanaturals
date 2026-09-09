import Coupon from "../models/Coupon.js";

export const createCoupon = async (
  req,
  res
) => {
  try {
    const coupon = await Coupon.create(
      req.body
    );

    res.status(201).json({
      success: true,
      coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getVisibleCoupons =
  async (req, res) => {
    try {
      const coupons =
        await Coupon.find({
          isVisible: true,
          isActive: true,
        });

      res.status(200).json({
        success: true,
        coupons,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

export const applyCoupon = async (req, res) => {
  try {
    const code = String(req.body?.code || "")
      .trim()
      .toUpperCase();
    const amount = Number(req.body?.amount);

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Please enter a coupon code",
      });
    }

    if (!Number.isFinite(amount) || amount < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount",
      });
    }

    const coupon = await Coupon.findOne({
      code,
      isActive: true,
    });

    if (!coupon) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon",
      });
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "This coupon has expired",
      });
    }

    const minimumAmount = Number(coupon.minimumAmount) || 0;

    if (amount < minimumAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount is ₹${minimumAmount}`,
      });
    }

    const discountValue = Number(coupon.discountValue);

    if (!Number.isFinite(discountValue) || discountValue < 0) {
      return res.status(400).json({
        success: false,
        message: "Coupon has an invalid discount value",
      });
    }

    let discount =
      coupon.discountType === "percentage"
        ? (amount * discountValue) / 100
        : discountValue;

    discount = Math.max(0, Math.min(discount, amount));

    res.status(200).json({
      success: true,
      discount,
      finalAmount: amount - discount,
      coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllCoupons = async (
  req,
  res
) => {
  try {
    const coupons =
      await Coupon.find().sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      coupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCoupon = async (
  req,
  res
) => {
  try {
    const coupon =
      await Coupon.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    res.status(200).json({
      success: true,
      coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCoupon = async (
  req,
  res
) => {
  try {
    const coupon =
      await Coupon.findById(
        req.params.id
      );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    await coupon.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Coupon deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};