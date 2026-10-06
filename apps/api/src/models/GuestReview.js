import mongoose from "mongoose";

const guestReviewSchema = new mongoose.Schema(
  {
    guestName: {
      type: String,
      required: true,
      trim: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    review: {
      type: String,
      required: true,
      trim: true,
    },

    images: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "GuestReview",
  guestReviewSchema
);