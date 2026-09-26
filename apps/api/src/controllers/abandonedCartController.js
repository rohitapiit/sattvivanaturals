import AbandonedCart from "../models/AbandonedCart.js";
import Order from "../models/Order.js";

// Default abandonment window: 60 minutes.
// Set ABANDONED_CART_MINUTES in apps/api/.env to change it.
const getThresholdMinutes = () => {
  const value = Number(process.env.ABANDONED_CART_MINUTES || 60);
  return Number.isFinite(value) && value >= 1 ? value : 60;
};

export const getAbandonedCarts = async (req, res) => {
  try {
    const thresholdMinutes = getThresholdMinutes();
    const cutoff = new Date(
      Date.now() - thresholdMinutes * 60 * 1000
    );

    // Any active cart that has been inactive beyond the threshold is
    // considered abandoned. This avoids needing a cron job.
    await AbandonedCart.updateMany(
      {
        status: "active",
        lastActivityAt: { $lte: cutoff },
        "items.0": { $exists: true },
      },
      { $set: { status: "abandoned" } }
    );

    const carts = await AbandonedCart.find({
      status: "abandoned",
      lastActivityAt: { $lte: cutoff },
      "items.0": { $exists: true },
    })
      .populate("user", "name email phone createdAt")
      .populate("items.product", "title price images category stock")
      .populate("recoveredOrder", "orderId totalAmount paymentStatus orderStatus createdAt")
      .sort({ lastActivityAt: -1 });

    const normalized = carts.map((cart) => ({
      _id: cart._id,
      status: cart.status,
      totalAmount: cart.totalAmount,
      itemCount: cart.items.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
      ),
      uniqueProductCount: cart.items.length,
      firstAddedAt: cart.firstAddedAt,
      lastActivityAt: cart.lastActivityAt,
      abandonedAt: new Date(
        cart.lastActivityAt.getTime() +
          thresholdMinutes * 60 * 1000
      ),
      customer: cart.user,
      items: cart.items,
      recoveredOrder: cart.recoveredOrder,
    }));

    const totalValue = normalized.reduce(
      (sum, cart) => sum + Number(cart.totalAmount || 0),
      0
    );

    res.status(200).json({
      success: true,
      thresholdMinutes,
      count: normalized.length,
      totalValue,
      carts: normalized,
    });
  } catch (error) {
    console.error("GET ABANDONED CARTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAbandonedCartById = async (req, res) => {
  try {
    const cart = await AbandonedCart.findById(req.params.id)
      .populate("user", "name email phone createdAt")
      .populate("items.product", "title price images category stock description")
      .populate(
        "recoveredOrder",
        "orderId totalAmount paymentStatus orderStatus paymentMethod createdAt"
      );

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Abandoned cart not found",
      });
    }

    const orders = await Order.find({ user: cart.user?._id })
      .select(
        "orderId totalAmount paymentStatus orderStatus paymentMethod createdAt items"
      )
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      cart,
      orders,
    });
  } catch (error) {
    console.error("GET ABANDONED CART ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
