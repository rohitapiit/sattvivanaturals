import Product from "../models/Product.js";
import Review from "../models/Review.js";
import GuestReview from "../models/GuestReview.js";

export const createProduct = async (req, res) => {
  try {
    const data = req.body;
    if (!data.category || !data.subcategory) {
  return res.status(400).json({
    success: false,
    message: "Category and Subcategory are required.",
  });
}

// Agar variants aaye hain aur top-level price missing hai
if (
  data.variants &&
  data.variants.length > 0
) {
  data.price = data.variants[0].price;
  data.stock = data.variants[0].stock;
  data.sku = data.variants[0].sku;
}

const product = await Product.create(data);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// export const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find();

//     res.status(200).json({
//       success: true,
//       count: products.length,
//       products,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().lean();

    // Logged-in user reviews
    const userReviewStats = await Review.aggregate([
      {
        $group: {
          _id: "$product",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    // Guest reviews
    const guestReviewStats = await GuestReview.aggregate([
      {
        $group: {
          _id: "$product",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    // Create maps for quick lookup
    const userStatsMap = new Map(
      userReviewStats.map((item) => [
        item._id.toString(),
        item,
      ])
    );

    const guestStatsMap = new Map(
      guestReviewStats.map((item) => [
        item._id.toString(),
        item,
      ])
    );

    // Add rating + review count to every product
    const productsWithRatings = products.map((product) => {
      const productId = product._id.toString();

      const userStats = userStatsMap.get(productId);
      const guestStats = guestStatsMap.get(productId);

      const userCount = userStats?.reviewCount || 0;
      const guestCount = guestStats?.reviewCount || 0;

      const userAverage = userStats?.averageRating || 0;
      const guestAverage = guestStats?.averageRating || 0;

      const totalReviews = userCount + guestCount;

      let averageRating = 0;

      if (totalReviews > 0) {
        averageRating =
          (
            (userAverage * userCount) +
            (guestAverage * guestCount)
          ) / totalReviews;
      }

      return {
        ...product,

        rating:
          totalReviews > 0
            ? Number(averageRating.toFixed(1))
            : 0,

        reviews: totalReviews,
      };
    });

    res.status(200).json({
      success: true,
      count: productsWithRatings.length,
      products: productsWithRatings,
    });

  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateProduct = async (req, res) => {

  const data = req.body;

  if (!data.category || !data.subcategory) {
  return res.status(400).json({
    success: false,
    message: "Category and Subcategory are required.",
  });
}
if (
  data.variants &&
  data.variants.length > 0
) {
  data.price = data.variants[0].price;
  data.stock = data.variants[0].stock;
  data.sku = data.variants[0].sku;
}

const product =
await Product.findByIdAndUpdate(
  req.params.id,
  data,
  {
    new: true,
    runValidators: true,
  }
);
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

