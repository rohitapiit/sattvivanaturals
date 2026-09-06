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

  export const applyCoupon = async (
  req,
  res
) => {
  try {
    const { code, amount} = req.body;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });


    if (!coupon) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon",
      });
    }

    if (amount < coupon.minimumAmount) {
      return res.status(400).json({
        success: false,
        message:
          `Minimum order amount is ₹${coupon.minimumAmount}`,
      });
    }

    let discount = 0;

    if (
      coupon.discountType ===
      "percentage"
    ) {
      discount =
        (amount *
          coupon.discountValue) /
        100;
    } else {
      discount =
        coupon.discountValue;
    }

    res.status(200).json({
      success: true,
      discount,
      finalAmount:
        amount - discount,
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