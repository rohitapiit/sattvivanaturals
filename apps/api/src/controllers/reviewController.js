import Review from "../models/Review.js";
import Order from "../models/Order.js";

export const addReview = async (req, res) => {
  try {
    const { productId, orderId, rating, review } = req.body;

const userId = req.user.userId;

    // 1. Order exist karta hai?
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // 2. Kya ye product us order me hai?
    const purchased = order.items.some(
      (item) => item.product.toString() === productId
    );

    if (!purchased) {
      return res.status(400).json({
        success: false,
        message: "You can review only purchased products.",
      });
    }

    // 3. Duplicate review check
    const alreadyReviewed = await Review.findOne({
      user: userId,
      product: productId,
      order: orderId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product.",
      });
    }

    // 4. Save review
    const newReview = await Review.create({
      user: userId,
      product: productId,
      order: orderId,
      rating,
      review,
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      review: newReview,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};