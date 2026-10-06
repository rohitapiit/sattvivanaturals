import Cart from "../models/Cart.js";
import AbandonedCart from "../models/AbandonedCart.js";



// =====================================================
// ABANDONED CART TRACKING
// =====================================================
// We only track authenticated customers because the admin dashboard
// needs a reliable customer identity. Guest carts remain browser-only.
export const syncAbandonedCart = async (userId) => {
  if (!userId) return;

  const cart = await Cart.findOne({ user: userId }).populate(
    "items.product"
  );

  const validItems = (cart?.items || []).filter(
    (item) => item.product
  );

  const existing = await AbandonedCart.findOne({
    user: userId,
    status: { $in: ["active", "abandoned"] },
  });

  if (!validItems.length) {
    if (existing) {
      existing.items = [];
      existing.totalAmount = 0;
      existing.status = "cleared";
      existing.lastActivityAt = new Date();
      await existing.save();
    }
    return;
  }

  const items = validItems.map((item) => ({
    product: item.product._id,
    quantity: item.quantity,
    price: Number(item.product.price) || 0,
  }));

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (existing) {
    existing.items = items;
    existing.totalAmount = totalAmount;
    existing.lastActivityAt = new Date();
    existing.status = "active";
    existing.recoveredOrder = null;
    existing.recoveredAt = null;
    await existing.save();
    return existing;
  }

  return AbandonedCart.create({
    user: userId,
    items,
    totalAmount,
    firstAddedAt: new Date(),
    lastActivityAt: new Date(),
    status: "active",
  });
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.userId,
        items: [
          {
            product: productId,
            quantity,
          },
        ],
      });
    } else {
      const existingItem = cart.items.find(
        item =>
          item.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({
          product: productId,
          quantity,
        });
      }

      await cart.save();
    }

    await syncAbandonedCart(req.user.userId);

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {

    console.log("========== CART ERROR ==========");
  console.log(error);

  
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.userId,
    }).populate("items.product");

    if (cart) {
  cart.items = cart.items.filter(item => item.product);
  await cart.save();
}


    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {

    const { productId, quantity } = req.body;

    console.log("Received productId:", productId);

    const cart = await Cart.findOne({
      user: req.user.userId,
    });

     console.log(
      "Cart products:",
      cart.items.map(item => item.product.toString())
    );

    const item = cart.items.find(
      item => item.product.toString() === productId
    );

    console.log("Matched Item:", item);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    item.quantity = quantity;

    await cart.save();
    await syncAbandonedCart(req.user.userId);

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();
    await syncAbandonedCart(req.user.userId);

    res.status(200).json({
      success: true,
      cart,
    });

  } catch (error) {
    console.log("REMOVE CART ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};