import Product from "../models/Product.js";
import Review from "../models/Review.js";
import GuestReview from "../models/GuestReview.js";

const createProductSlug = (value = "") =>
  String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeProductData = (body = {}) => {
  const data = { ...body };

  data.slug = createProductSlug(data.slug || data.title);

  if (Array.isArray(data.variants) && data.variants.length > 0) {
    const validVariants = data.variants.filter(
      (variant) =>
        variant &&
        variant.size &&
        variant.price !== "" &&
        variant.price !== undefined &&
        variant.stock !== "" &&
        variant.stock !== undefined
    );

    data.variants = validVariants.map((variant) => ({
      ...variant,
      price: Number(variant.price),
      stock: Number(variant.stock || 0),
      cutPrice:
        variant.cutPrice === "" ||
        variant.cutPrice === null ||
        variant.cutPrice === undefined
          ? null
          : Number(variant.cutPrice),
    }));

    if (data.variants.length > 0) {
      data.price = Number(data.variants[0].price);
      data.cutPrice =
        validVariants[0].cutPrice === "" ||
        validVariants[0].cutPrice === null ||
        validVariants[0].cutPrice === undefined
          ? null
          : Number(validVariants[0].cutPrice);
      data.stock = validVariants.reduce(
        (total, variant) => total + Number(variant.stock || 0),
        0
      );
      if (validVariants[0].sku !== undefined) {
        data.sku = validVariants[0].sku;
      }
    }
  }

  data.displayOrder = data.displayOrder === "" || data.displayOrder === null || data.displayOrder === undefined
    ? 9999
    : Math.max(1, Number(data.displayOrder) || 9999);

  if (data.cutPrice === "" || data.cutPrice === null || data.cutPrice === undefined) {
    data.cutPrice = null;
  } else {
    data.cutPrice = Number(data.cutPrice);
  }

  return data;
};

const validateProductSlug = (slug, res) => {
  if (!slug || slug.length > 160 || /^[a-f\d]{24}$/i.test(slug)) {
    res.status(400).json({
      success: false,
      message: "Enter a URL slug containing letters, numbers, and hyphens.",
    });
    return false;
  }

  return true;
};

const handleProductSaveError = (error, res, operation) => {
  if (error.code === 11000 && error.keyPattern?.slug) {
    return res.status(409).json({
      success: false,
      message: "That product URL is already in use. Please choose another slug.",
    });
  }

  console.error(`${operation} ERROR:`, error);
  return res.status(500).json({
    success: false,
    message: error.message,
  });
};

export const createProduct = async (req, res) => {
  try {
    const data = normalizeProductData(req.body);

    if (!validateProductSlug(data.slug, res)) {
      return;
    }

    if (!data.category || !data.subcategory) {
      return res.status(400).json({
        success: false,
        message: "Category and Subcategory are required.",
      });
    }

    const product = await Product.create(data);

    return res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    return handleProductSaveError(error, res, "CREATE PRODUCT");
  }
};

export const getProducts = async (req, res) => {
  try {
    const search = req.query.search?.trim();
    const searchFilter = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
            { subcategory: { $regex: search, $options: "i" } },
            { "variants.size": { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const products = await Product.find(searchFilter)
      .sort({ displayOrder: 1, createdAt: -1, _id: 1 })
      .lean();

    const userReviewStats = await Review.aggregate([
      {
        $group: {
          _id: "$product",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    const guestReviewStats = await GuestReview.aggregate([
      {
        $group: {
          _id: "$product",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    const userStatsMap = new Map(
      userReviewStats.map((item) => [item._id.toString(), item])
    );

    const guestStatsMap = new Map(
      guestReviewStats.map((item) => [item._id.toString(), item])
    );

    const productsWithRatings = products.map((product) => {
      const productId = product._id.toString();
      const userStats = userStatsMap.get(productId);
      const guestStats = guestStatsMap.get(productId);

      const userCount = userStats?.reviewCount || 0;
      const guestCount = guestStats?.reviewCount || 0;
      const userAverage = userStats?.averageRating || 0;
      const guestAverage = guestStats?.averageRating || 0;
      const totalReviews = userCount + guestCount;

      const averageRating =
        totalReviews > 0
          ? ((userAverage * userCount) + (guestAverage * guestCount)) / totalReviews
          : 0;

      return {
        ...product,
        rating: totalReviews > 0 ? Number(averageRating.toFixed(1)) : 0,
        reviews: totalReviews,
      };
    });

    return res.status(200).json({
      success: true,
      count: productsWithRatings.length,
      products: productsWithRatings,
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSeoIndexProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isActive: { $ne: false },
    })
      .select("_id slug category subcategory updatedAt")
      .lean();

    return res.status(200).json({
      success: true,
      products: products.map((product) => ({
        id: product._id.toString(),
        slug: product.slug || null,
        category: product.category,
        subcategory: product.subcategory,
        updatedAt: product.updatedAt,
      })),
    });
  } catch (error) {
    console.error("GET SEO PRODUCT INDEX ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load sitemap product data.",
    });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  const isObjectId = /^[a-f\d]{24}$/i.test(id);

  if (!isObjectId && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    return res.status(400).json({
      success: false,
      message: "Product URL must be a valid slug or 24-character ObjectId.",
    });
  }

  try {
    const product = isObjectId
      ? await Product.findById(id)
      : await Product.findOne({ slug: id.toLowerCase() });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("GET PRODUCT BY ID ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const data = normalizeProductData(req.body);

    if (!validateProductSlug(data.slug, res)) {
      return;
    }

    if (!data.category || !data.subcategory) {
      return res.status(400).json({
        success: false,
        message: "Category and Subcategory are required.",
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      data,
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

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return handleProductSaveError(error, res, "UPDATE PRODUCT");
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
