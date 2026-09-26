import mongoose from "mongoose";

const abandonedCartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: true }
);

const abandonedCartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: {
      type: [abandonedCartItemSchema],
      default: [],
    },

    totalAmount: {
      type: Number,
      default: 0,
    },

    firstAddedAt: {
      type: Date,
      default: Date.now,
    },

    lastActivityAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    status: {
      type: String,
      enum: ["active", "abandoned", "recovered", "cleared"],
      default: "active",
      index: true,
    },

    recoveredOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    recoveredAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// One open cart snapshot per customer. A new snapshot is created after
// the previous cart is cleared.
abandonedCartSchema.index({ user: 1, status: 1 });

export default mongoose.model("AbandonedCart", abandonedCartSchema);
