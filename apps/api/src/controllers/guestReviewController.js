import GuestReview from "../models/GuestReview.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const addGuestReview = async (req, res) => {
  try {
    console.log("========== GUEST REVIEW ==========");
    console.log("BODY:", req.body);

    const {
      guestName,
      productId,
      rating,
      review,
      images = [],
    } = req.body;

    // Name
    if (!guestName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter your name.",
      });
    }

    // Product ID
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Please select a product.",
      });
    }

    // Check product
    const product = await Product.findById(productId);

    console.log("PRODUCT FOUND:", product ? "YES" : "NO");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Rating
    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        success: false,
        message: "Please select a rating between 1 and 5.",
      });
    }

    // Review
    if (!review?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please write a review.",
      });
    }

    // Save
    const newReview = await GuestReview.create({
      guestName: guestName.trim(),
      product: productId,
      rating: Number(rating),
      review: review.trim(),
      images: Array.isArray(images) ? images : [],
    });

    console.log("GUEST REVIEW SAVED:", newReview._id);

    res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      review: newReview,
    });

  } catch (error) {
    console.error("========== GUEST REVIEW ERROR ==========");
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const addGuestReviewByToken = async (req, res) => {
  try {
    const { token } = req.params;

    const {
      productId,
      rating,
      review,
      images = [],
    } = req.body;

    const order = await Order.findOne({
  "reviewTokens.token": token,
});

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired review link.",
      });
    }

    // Find token
    const reviewTokenData = order.reviewTokens.find(
      (item) => item.token === token
    );

    if (!reviewTokenData) {
      return res.status(404).json({
        success: false,
        message: "Invalid review link.",
      });
    }

    // Check expiry
    if (
      reviewTokenData.expiresAt &&
      new Date(reviewTokenData.expiresAt) < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "This review link has expired.",
      });
    }

    // Already used
    if (reviewTokenData.used) {
      return res.status(400).json({
        success: false,
        message: "This review link has already been used.",
      });
    }

    // Check whether product belongs to this order
    const purchasedProduct = order.items.find(
      (item) =>
        item.product.toString() === productId
    );

    if (!purchasedProduct) {
      return res.status(400).json({
        success: false,
        message: "This product was not part of this order.",
      });
    }

    // Rating
    if (
      !rating ||
      Number(rating) < 1 ||
      Number(rating) > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Please select a rating between 1 and 5.",
      });
    }

    // Review
    if (!review?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please write your review.",
      });
    }

    // Save review
    const newReview = await GuestReview.create({
      guestName: order.shippingAddress.fullName,
      product: productId,
      rating: Number(rating),
      review: review.trim(),
      images: Array.isArray(images)
        ? images
        : [],
    });

    // Mark this token as used
    reviewTokenData.used = true;

    await order.save();

    res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      review: newReview,
    });

  } catch (error) {
    console.error(
      "GUEST TOKEN REVIEW ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const getGuestReviewByToken = async (req, res) => {
  try {
    const { token } = req.params;

   console.log("========== REVIEW LINK DEBUG ==========");
    console.log("TOKEN FROM URL:", token);

    const order = await Order.findOne({
  "reviewTokens.token": token,
}).populate("items.product");

    console.log("ORDER FOUND:", order ? "YES" : "NO");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Invalid review link.",
      });
    }

   const reviewToken = order.reviewTokens.find(
  (item) => item.token === token
);

if (!reviewToken) {
  return res.status(404).json({
    success: false,
    message: "Invalid review link.",
  });
}

if (reviewToken.used) {
  return res.status(400).json({
    success: false,
    message: "This review link has already been used.",
  });
}

if (reviewToken.expiresAt < new Date()) {
  return res.status(400).json({
    success: false,
    message: "This review link has expired.",
  });
}

    console.log("REVIEW TOKEN FOUND:", reviewToken ? "YES" : "NO");

    if (!reviewToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid review token.",
      });
    }

    if (reviewToken.used) {
      return res.status(400).json({
        success: false,
        message: "This review link has already been used.",
      });
    }

    if (reviewToken.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "This review link has expired.",
      });
    }

    res.status(200).json({
      success: true,

      guestName: order.shippingAddress.fullName,

      products: order.items.map((item) => ({
        _id: item.product._id,
        title:
          item.product.title ||
          item.product.name,

        images:
          item.product.images || [],
      })),
    });

  } catch (error) {
    console.error(
      "GET GUEST REVIEW BY TOKEN ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};