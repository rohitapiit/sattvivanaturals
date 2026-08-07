import Product from "../models/Product.js";

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

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
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

