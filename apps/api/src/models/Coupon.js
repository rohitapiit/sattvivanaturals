import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },

    discountValue: {
      type: Number,
      required: true,
    },

    minimumAmount: {
      type: Number,
      default: 0,
    },

    isVisible: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    expiryDate: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Coupon",
  couponSchema
);