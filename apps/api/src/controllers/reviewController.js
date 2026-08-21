import Review from "../models/Review.js";
import GuestReview from "../models/GuestReview.js";
import Order from "../models/Order.js";

// export const addReview = async (req, res) => {
//   try {
//     const { productId, orderId, rating, review } = req.body;

// const userId = req.user.userId;

//     // 1. Order exist karta hai?
//     const order = await Order.findOne({
//       _id: orderId,
//       user: userId,
//     });

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found.",
//       });
//     }

//     // 2. Kya ye product us order me hai?
//     const purchased = order.items.some(
//       (item) => item.product.toString() === productId
//     );

//     if (!purchased) {
//       return res.status(400).json({
//         success: false,
//         message: "You can review only purchased products.",
//       });
//     }

//     // 3. Duplicate review check
//     const alreadyReviewed = await Review.findOne({
//       user: userId,
//       product: productId,
//       order: orderId,
//     });

//     if (alreadyReviewed) {
//       return res.status(400).json({
//         success: false,
//         message: "You already reviewed this product.",
//       });
//     }

//     // 4. Save review
//     const newReview = await Review.create({
//       user: userId,
//       product: productId,
//       order: orderId,
//       rating,
//       review,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Review submitted successfully.",
//       review: newReview,
//     });

//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };

export const addReview = async (req, res) => {
  try {
    const {
      productId,
      orderId,
      rating,
      review,
      images = [],
    } = req.body;

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

    // 2. Kya product order me hai?
    const purchased = order.items.some(
      (item) => item.product.toString() === productId
    );

    if (!purchased) {
      return res.status(400).json({
        success: false,
        message: "You can review only purchased products.",
      });
    }

    // 3. Same user + same product ka review already hai?
    // const alreadyReviewed = await Review.findOne({
    //   user: userId,
    //   product: productId,
    // });

    // if (alreadyReviewed) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "You already reviewed this product.",
    //   });
    // }

    // 4. Save review
    const newReview = await Review.create({
      user: userId,
      product: productId,
      order: orderId,
      rating,
      review,
      images,
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

export const getMyReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    const review = await Review.findOne({
      user: userId,
      product: productId,
    });

    res.status(200).json({
      success: true,
      review: review || null,
    });
  } catch (error) {
    console.error("ADD REVIEW ERROR:", error);
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// export const updateReview = async (req, res) => {
//   try {
//     const { reviewId } = req.params;
//     const {
//       rating,
//       review,
//       images = [],
//     } = req.body;

//     const userId = req.user.userId;

//     const existingReview = await Review.findOne({
//       _id: reviewId,
//       user: userId,
//     });

//     if (!existingReview) {
//       return res.status(404).json({
//         success: false,
//         message: "Review not found.",
//       });
//     }

//     existingReview.rating = rating;
//     existingReview.review = review;
//     existingReview.images = images;

//     await existingReview.save();

//     res.status(200).json({
//       success: true,
//       message: "Review updated successfully.",
//       review: existingReview,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };

// Get logged-in user's all reviews
export const getMyReviews = async (req, res) => {
  try {
    const userId = req.user.userId;

    const reviews = await Review.find({ user: userId })
      .populate("product", "name images")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("GET MY REVIEWS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update logged-in user's review
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const {
      rating,
      review,
      images = [],
    } = req.body;

    const userId = req.user.userId;

    // Find only user's own review
    const existingReview = await Review.findOne({
      _id: reviewId,
      user: userId,
    });

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    // Update review
    existingReview.rating = rating;
    existingReview.review = review;
    existingReview.images = images;

    await existingReview.save();

    res.status(200).json({
      success: true,
      message: "Review updated successfully.",
      review: existingReview,
    });

  } catch (error) {
    console.error("UPDATE REVIEW ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Delete logged-in user's review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.userId;

    const review = await Review.findOne({
      _id: reviewId,
      user: userId,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE REVIEW ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// export const getAllProductReviews = async (req, res) => {
//   try {
//     const { productId } = req.params;

//     // Logged-in user reviews
//     const userReviews = await Review.find({
//       product: productId,
//     })
//       .populate("user", "name")
//       .sort({ createdAt: -1 })
//       .lean();

//     // Guest reviews
//     const guestReviews = await GuestReview.find({
//       product: productId,
//     })
//       .sort({ createdAt: -1 })
//       .lean();

//     // Logged-in reviews ko common format mein convert
//     const formattedUserReviews = userReviews.map((item) => ({
//       _id: item._id,
//       name: item.user?.name || "Customer",
//       rating: item.rating,
//       review: item.review,
//       images: item.images || [],
//       isGuest: false,
//       createdAt: item.createdAt,
//     }));

//     // Guest reviews ko same format mein convert
//     const formattedGuestReviews = guestReviews.map((item) => ({
//       _id: item._id,
//       name: item.guestName || "Customer",
//       rating: item.rating,
//       review: item.review,
//       images: item.images || [],
//       isGuest: true,
//       createdAt: item.createdAt,
//     }));

//     // Dono ko combine
//     const allReviews = [
//       ...formattedUserReviews,
//       ...formattedGuestReviews,
//     ];

//     // Latest review first
//     allReviews.sort(
//       (a, b) =>
//         new Date(b.createdAt) -
//         new Date(a.createdAt)
//     );

//     res.status(200).json({
//       success: true,
//       reviews: allReviews,
//     });
//   } catch (error) {
//     console.error(
//       "GET ALL PRODUCT REVIEWS ERROR:",
//       error
//     );

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };



export const getAllProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // Logged-in user reviews
    const userReviews = await Review.find({
      product: productId,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .lean();

    // Guest reviews
    const guestReviews = await GuestReview.find({
      product: productId,
    })
      .sort({ createdAt: -1 })
      .lean();

    // Logged-in reviews ko common format mein convert
    const formattedUserReviews = userReviews.map((item) => ({
      _id: item._id,
      name: item.user?.name || "Customer",
      rating: Number(item.rating),
      review: item.review,
      images: item.images || [],
      isGuest: false,
      createdAt: item.createdAt,
    }));

    // Guest reviews ko same format mein convert
    const formattedGuestReviews = guestReviews.map((item) => ({
      _id: item._id,
      name: item.guestName || "Customer",
      rating: Number(item.rating),
      review: item.review,
      images: item.images || [],
      isGuest: true,
      createdAt: item.createdAt,
    }));

    // Dono ko combine
    const allReviews = [
      ...formattedUserReviews,
      ...formattedGuestReviews,
    ];

    // Latest review first
    allReviews.sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

    // ================================
    // AVERAGE RATING CALCULATION
    // ================================

    const totalReviews = allReviews.length;

    const totalRating = allReviews.reduce(
      (sum, item) => sum + Number(item.rating || 0),
      0
    );

    const averageRating =
      totalReviews > 0
        ? Number((totalRating / totalReviews).toFixed(1))
        : 0;

    res.status(200).json({
      success: true,

      reviews: allReviews,

      // Rating summary
      totalReviews,
      averageRating,
    });

  } catch (error) {
    console.error(
      "GET ALL PRODUCT REVIEWS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getCustomerTestimonials = async (req, res) => {
  try {
    // Logged-in customer reviews
    const userReviews = await Review.find({})
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    // Guest reviews
    const guestReviews = await GuestReview.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    // Logged-in reviews format
    const formattedUserReviews = userReviews.map((item) => ({
      _id: item._id,
      name: item.user?.name || "Customer",
      rating: Number(item.rating),
      review: item.review,
      verified: true,
      createdAt: item.createdAt,
    }));

    // Guest reviews format
    const formattedGuestReviews = guestReviews.map((item) => ({
      _id: item._id,
      name: item.guestName || "Customer",
      rating: Number(item.rating),
      review: item.review,
      verified: false,
      createdAt: item.createdAt,
    }));

    // Combine both
    const allReviews = [
      ...formattedUserReviews,
      ...formattedGuestReviews,
    ];

    // Latest reviews first
    allReviews.sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

    // Only latest 3 testimonials
    const testimonials = allReviews.slice(0, 3);

    res.status(200).json({
      success: true,
      testimonials,
    });

  } catch (error) {
    console.error(
      "GET CUSTOMER TESTIMONIALS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const addReviewByToken = async (req, res) => {
  try {
    const { token } = req.params;

    const {
      productId,
      rating,
      review,
      images = [],
    } = req.body;

    // Find logged-in order using review token
    const order = await Order.findOne({
      "reviewTokens.token": token,
      isGuestOrder: false,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired review link.",
      });
    }

    // Find token entry
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
    if (new Date() > new Date(reviewTokenData.expiresAt)) {
      return res.status(400).json({
        success: false,
        message: "This review link has expired.",
      });
    }

    // Check whether token is already used
    if (reviewTokenData.used) {
      return res.status(400).json({
        success: false,
        message: "This review link has already been used.",
      });
    }

    // Check product belongs to this token
    if (
      reviewTokenData.product.toString() !== productId
    ) {
      return res.status(400).json({
        success: false,
        message: "This product was not part of this review link.",
      });
    }

    // Validate rating
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

    // Validate review
    if (!review?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please write your review.",
      });
    }

    // Save logged-in user's review
    const newReview = await Review.create({
      user: order.user,
      product: productId,
      order: order._id,
      rating: Number(rating),
      review: review.trim(),
      images: Array.isArray(images) ? images : [],
    });

    // Mark token as used
    reviewTokenData.used = true;

    await order.save();

    res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      review: newReview,
    });

  } catch (error) {
    console.error(
      "ADD REVIEW BY TOKEN ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



export const getReviewByToken = async (req, res) => {
  try {
    const { token } = req.params;

    const order = await Order.findOne({
      "reviewTokens.token": token,
      isGuestOrder: false,
    }).populate("items.product");

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
    if (new Date() > new Date(reviewTokenData.expiresAt)) {
      return res.status(400).json({
        success: false,
        message: "This review link has expired.",
      });
    }

    // Check used
    if (reviewTokenData.used) {
      return res.status(400).json({
        success: false,
        message: "This review link has already been used.",
      });
    }

    // Only the product associated with this token
    const product = order.items.find(
      (item) =>
        item.product?._id?.toString() ===
        reviewTokenData.product.toString()
    );

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found in this order.",
      });
    }

    res.status(200).json({
      success: true,

      customerName:
        order.shippingAddress.fullName,

      products: [
        {
          _id: product.product._id,
          title:
            product.product.title ||
            product.product.name,
          images:
            product.product.images || [],
        },
      ],
    });

  } catch (error) {
    console.error(
      "GET REVIEW BY TOKEN ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};