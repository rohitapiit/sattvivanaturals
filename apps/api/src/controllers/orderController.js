import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import razorpay from "../config/razorpay.js";
import Address from "../models/Address.js";
import PDFDocument from "pdfkit";
import Counter from "../models/Counter.js";
import crypto from "crypto";

import {
  createShiprocketOrder,
  cancelShiprocketOrder,
  createShiprocketReturnOrder,
} from "../utils/shiprocket.js";

// Builds an order ID like "SV04082026123" — "SV" + today's date as
// DDMMYYYY + the ever-increasing sequence number from the Counter
// collection. The counter itself is NOT reset daily (it just keeps
// counting up), so IDs stay guaranteed-unique even if two orders land
// on the same date.
const generateOrderId = (seq) => {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  return `SV${day}${month}${year}${seq}`;
};

// const sendReviewEmail = async (order) => {
//   try {

//    // ONLY GUEST ORDERS
//     if (!order.isGuestOrder) {
//       console.log(
//         "Skipping guest review email for logged-in order:",
//         order.orderId
//       );
//       return;
//     }
//     // Generate secure token for this order
//     const token = crypto.randomBytes(32).toString("hex");

//     console.log("GENERATED REVIEW TOKEN:", token);

//     // Create review token for the order
// order.reviewTokens = order.items.map((item) => ({
//   product: item.product,
//   token,
//   expiresAt: new Date(
//     Date.now() + 7 * 24 * 60 * 60 * 1000
//   ),
//   used: false,
// }));

//     await order.save();

//     console.log(
//   "AFTER SAVE REVIEW TOKENS:",
//   order.reviewTokens
// );

// const savedOrder = await Order.findById(order._id);

// console.log(
//   "DB CHECK REVIEW TOKENS:",
//   savedOrder.reviewTokens
// );

//     console.log(
//       "SAVED REVIEW TOKENS:",
//       order.reviewTokens
//     );

//     const frontendUrl =
//       process.env.FRONTEND_URL ||
//       "https://sattvivanaturals.com";

//     const reviewLink =
//       `${frontendUrl}/guest-review/${token}`;

//       console.log(
//       "REVIEW LINK:",
//       reviewLink
//     );

//     const customerName =
//       order.shippingAddress.fullName;

//     const customerEmail =
//       order.shippingAddress.email;

//     const productList = order.items
//       .map(
//         (item) =>
//           `${item.product?.title || "Product"} x ${item.quantity}`
//       )
//       .join("\n");

//     const emailSent = await sendEmail(
//       customerEmail,

//       "How was your SattViva purchase? ⭐",

//       `
// Hello ${customerName},

// We hope you are enjoying your SattViva Naturals products! 🌿

// Your order ${order.orderId} has been delivered.

// Products:
// ${productList}

// We would love to hear about your experience.

// Please take a moment to share your feedback:

// ${reviewLink}

// Your feedback helps us improve and also helps other customers make better choices.

// Thank you for choosing SattViva Naturals ❤️

// Regards,
// SattViva Naturals Team
// `
//     );

//     if (emailSent) {
//       order.reviewEmailSentAt = new Date();

//       await order.save();

//       console.log(
//         "✅ GUEST REVIEW EMAIL SENT:",
//         customerEmail
//       );
//     } else {
//       console.log(
//         "❌ GUEST REVIEW EMAIL FAILED:",
//         customerEmail
//       );
//     }

//   } catch (error) {
//     console.error(
//       "GUEST REVIEW EMAIL ERROR:",
//       error
//     );
//   }
// };

const sendReviewEmail = async (order) => {
  try {

    // =========================
    // GENERATE REVIEW TOKEN
    // =========================

    const token = crypto.randomBytes(32).toString("hex");

    console.log(
      "GENERATED REVIEW TOKEN:",
      token
    );

    // =========================
    // SAVE TOKEN
    // =========================

    order.reviewTokens = order.items.map((item) => ({
      product: item.product,
      token,
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ),
      used: false,
    }));

    await order.save();

    console.log(
      "SAVED REVIEW TOKENS:",
      order.reviewTokens
    );

    // =========================
    // CHECK DATABASE
    // =========================

    const savedOrder =
      await Order.findById(order._id);

    console.log(
      "DB CHECK REVIEW TOKENS:",
      savedOrder.reviewTokens
    );

    // =========================
    // FRONTEND URL
    // =========================

    const frontendUrl =
      process.env.FRONTEND_URL ||
      "https://sattvivanaturals.com";

    // =========================
    // DIFFERENT LINK
    // =========================

    let reviewLink;

    if (order.isGuestOrder) {

      // Guest
      reviewLink =
        `${frontendUrl}/guest-review/${token}`;

      console.log(
        "GUEST REVIEW LINK:",
        reviewLink
      );

    } else {

      // Logged-in
      reviewLink =
        `${frontendUrl}/review/${token}`;

      console.log(
        "LOGGED-IN REVIEW LINK:",
        reviewLink
      );
    }

    // =========================
    // CUSTOMER DETAILS
    // =========================

    const customerName =
      order.shippingAddress.fullName;

    const customerEmail =
      order.shippingAddress.email;

    // =========================
    // PRODUCT LIST
    // =========================

    const productList = order.items
      .map(
        (item) =>
          `${item.product?.title || item.product?.name || "Product"} x ${item.quantity}`
      )
      .join("\n");

    // =========================
    // EMAIL
    // =========================

    const emailSent = await sendEmail(
      customerEmail,

      "How was your SattViva purchase? ⭐",

      `
Hello ${customerName},

We hope you are enjoying your SattViva Naturals products! 🌿

Your order ${order.orderId} has been delivered.

Products:
${productList}

We would love to hear about your experience.

Please take a moment to share your feedback:

${reviewLink}

Your feedback helps us improve and also helps other customers make better choices.

Thank you for choosing SattViva Naturals ❤️

Regards,
SattViva Naturals Team
`
    );

    // =========================
    // EMAIL STATUS
    // =========================

    if (emailSent) {

      order.reviewEmailSentAt =
        new Date();

      await order.save();

      console.log(
        "✅ REVIEW EMAIL SENT:",
        customerEmail
      );

    } else {

      console.log(
        "❌ REVIEW EMAIL FAILED:",
        customerEmail
      );

    }

  } catch (error) {

    console.error(
      "REVIEW EMAIL ERROR:",
      error
    );

  }
};

export const createOrder = async (req, res) => {
  
  try {

    console.log("BODY:", req.body);
    const {
      shippingAddress,
      billingAddress,
      razorpayOrderId,
      razorpayPaymentId,
      paymentMethod,
      guestItems = [],
      finalAmount,
      couponCode,
      discount,
    } = req.body;

    if (paymentMethod === "COD" && couponCode) {
      return res.status(400).json({
        success: false,
        message: "Coupons are applicable only for prepaid orders.",
      });
    }

    // Prevent duplicate ONLINE orders
if (paymentMethod === "ONLINE" && razorpayPaymentId) {
  const existingOrder = await Order.findOne({
    razorpayPaymentId,
  });

  if (existingOrder) {
    return res.status(200).json({
      success: true,
      message: "Order already created.",
      order: existingOrder,
    });
  }
}

// -----Guest Checkin
    const userId =
  req.user?.userId || null;

const isGuestOrder =
  !userId;


console.log(
  "CHECKOUT USER ID:",
  userId
);

console.log(
  "IS GUEST ORDER:",
  isGuestOrder
);



let sourceItems = [];

let cart = null;


   // =========================
// LOGGED-IN USER CHECKOUT
// =========================

if (userId) {

  cart = await Cart.findOne({
    user: userId,
  }).populate("items.product");


  if (
    !cart ||
    cart.items.length === 0
  ) {

    return res.status(400).json({
      success: false,
      message: "Cart is empty",
    });

  }

sourceItems = cart.items.map((item) => ({
  product: item.product,
  quantity: item.quantity,
  size: item.size,
}));

} else {

  // =========================
  // GUEST CHECKOUT
  // =========================

  if (
    !Array.isArray(guestItems) ||
    guestItems.length === 0
  ) {

    return res.status(400).json({
      success: false,

      message:
        "Guest cart items are required",
    });

  }


  for (const item of guestItems) {

    const product =
      await Product.findById(
        item.productId
      );


    if (!product) {

      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    }


    sourceItems.push({

      product,

      quantity:
        Number(item.quantity),

    });

  }

}
   // =========================
// CALCULATE ORDER ITEMS
// =========================

let totalAmount = 0;

const orderItems = [];


for (const item of sourceItems) {

  const product =
    item.product;

  const quantity =
    Number(item.quantity);

  

  // =========================
  // VALIDATE QUANTITY
  // =========================

  if (
    !Number.isInteger(quantity) ||
    quantity <= 0
  ) {

    return res.status(400).json({
      success: false,
      message: "Invalid quantity",
    });

  }


  // =========================
  // CHECK PRODUCT
  // =========================

  if (!product) {

    return res.status(404).json({
      success: false,
      message: "Product not found",
    });

  }

if (product.stock < quantity) {
  return res.status(400).json({
    success: false,
    message: `${product.title} is out of stock`,
  });
}

product.stock -= quantity;

await product.save();


  totalAmount +=
    product.price * quantity;


  // =========================
  // CREATE ORDER ITEM
  // =========================

  orderItems.push({

    product:
      product._id,

    quantity,

    price:
      product.price,

  });

}

  if (typeof finalAmount === "number") {
      totalAmount = finalAmount;
    }

const counter = await Counter.findByIdAndUpdate(
  "order",
  { $inc: { seq: 1 } },
  {
    new: true,
    upsert: true,
  }
);

const orderId = generateOrderId(counter.seq);

const order =
await Order.create({

    orderId,

  user:
    userId,

  isGuestOrder,

  items:
    orderItems,

  totalAmount,
  couponCode,
    discount,

  paymentMethod,

  paymentStatus:
    paymentMethod === "COD"
      ? "Pending"
      : "Paid",

  refundStatus:
    "Not Required",

  razorpayOrderId,

  razorpayPaymentId,

  shippingAddress,

  billingAddress,

});

const isSameAddress =
  shippingAddress?.fullName?.trim() === billingAddress?.fullName?.trim() &&
  shippingAddress?.phone?.trim() === billingAddress?.phone?.trim() &&
  shippingAddress?.address?.trim() === billingAddress?.address?.trim() &&
  shippingAddress?.city?.trim() === billingAddress?.city?.trim() &&
  shippingAddress?.state?.trim() === billingAddress?.state?.trim() &&
  shippingAddress?.pincode?.trim() === billingAddress?.pincode?.trim();

// =========================
// SAVE ADDRESSES
// LOGGED-IN USERS ONLY
// =========================

if (userId) {

  // =========================
  // SAVE SHIPPING ADDRESS
  // =========================

  const existingShippingAddress =
    await Address.findOne({

      user: userId,

      fullName:
        shippingAddress.fullName.trim(),

      email:
        shippingAddress.email
          .trim()
          .toLowerCase(),

      phone:
        shippingAddress.phone.trim(),

      address:
        shippingAddress.address.trim(),

      city:
        shippingAddress.city.trim(),

      state:
        shippingAddress.state.trim(),

      pincode:
        shippingAddress.pincode.trim(),

    });


  if (!existingShippingAddress) {

    await Address.create({

      user: userId,

      nickname: "Other",

      fullName:
        shippingAddress.fullName,

      email:
        shippingAddress.email,

      phone:
        shippingAddress.phone,

      address:
        shippingAddress.address,

      city:
        shippingAddress.city,

      state:
        shippingAddress.state,

      pincode:
        shippingAddress.pincode,

      isDefault: false,

    });

  }


  // =========================
  // CHECK BILLING ADDRESS
  // =========================

  const isSameAddress =

    shippingAddress?.fullName?.trim() ===
      billingAddress?.fullName?.trim() &&

    shippingAddress?.email?.trim()
      ?.toLowerCase() ===
      billingAddress?.email?.trim()
        ?.toLowerCase() &&

    shippingAddress?.phone?.trim() ===
      billingAddress?.phone?.trim() &&

    shippingAddress?.address?.trim() ===
      billingAddress?.address?.trim() &&

    shippingAddress?.city?.trim() ===
      billingAddress?.city?.trim() &&

    shippingAddress?.state?.trim() ===
      billingAddress?.state?.trim() &&

    shippingAddress?.pincode?.trim() ===
      billingAddress?.pincode?.trim();


  // =========================
  // SAVE BILLING ADDRESS
  // ONLY IF DIFFERENT
  // =========================

  if (
    !isSameAddress &&
    billingAddress
  ) {

    const existingBillingAddress =
      await Address.findOne({

        user: userId,

        fullName:
          billingAddress.fullName.trim(),

        email:
          billingAddress.email
            .trim()
            .toLowerCase(),

        phone:
          billingAddress.phone.trim(),

        address:
          billingAddress.address.trim(),

        city:
          billingAddress.city.trim(),

        state:
          billingAddress.state.trim(),

        pincode:
          billingAddress.pincode.trim(),

      });


    if (!existingBillingAddress) {

      await Address.create({

        user: userId,

        nickname: "Other",

        fullName:
          billingAddress.fullName,

        email:
          billingAddress.email,

        phone:
          billingAddress.phone,

        address:
          billingAddress.address,

        city:
          billingAddress.city,

        state:
          billingAddress.state,

        pincode:
          billingAddress.pincode,

        isDefault: false,

      });

    }

  }

}


// =========================
// CUSTOMER INFORMATION
// =========================

const user = userId
  ? await User.findById(userId)
  : null;


const customerName =
  user?.name ||
  shippingAddress.fullName;


const registeredEmail =
  user?.email?.trim().toLowerCase();

const checkoutEmail =
  shippingAddress?.email?.trim().toLowerCase();

  const recipients = [];

if (registeredEmail) {
  recipients.push(registeredEmail);
}

if (
  checkoutEmail &&
  checkoutEmail !== registeredEmail
) {
  recipients.push(checkoutEmail);
}


console.log(
  "CUSTOMER NAME:",
  customerName
);

console.log(
  "CUSTOMER EMAIL:",
  checkoutEmail || registeredEmail
);

// ---------------------------------------------------------
// Shiprocket runs in the BACKGROUND (not awaited) so the
// "Place Order" / "Pay Now" request doesn't hang waiting on
// an external courier API before the customer sees success.
// ---------------------------------------------------------

(async () => {
  try {
    const populatedOrder = await Order.findById(
      order._id
    ).populate("items.product");

    const shiprocketData =
      await createShiprocketOrder(
        populatedOrder,
        {
          name: customerName,
          email: checkoutEmail || registeredEmail,
        }
      );

    order.shiprocketOrderId =
      shiprocketData.order_id?.toString() || "";

    order.shiprocketShipmentId =
      shiprocketData.shipment_id?.toString() || "";

    await order.save();

    console.log(
      "SHIPROCKET IDS SAVED:",
      {
        orderId: order.shiprocketOrderId,
        shipmentId: order.shiprocketShipmentId,
      }
    );
  } catch (shiprocketError) {
    console.error(
      "SHIPROCKET ORDER FAILED:",
      shiprocketError.response?.data ||
      shiprocketError.message
    );
  }
})();

const productList =
  sourceItems
    .map(
      (item) =>
        `${item.product.title} x ${item.quantity}`
    )
    .join("\n");

    

    

  sendEmail(
    recipients.join(","),
  "Order Confirmation - SattViva",
  `
  Hello ${customerName},

Thank you for your order!

Order ID: ${order.orderId}

Products:
${productList}

Subtotal: ₹${order.totalAmount + (order.discount || 0)}
Coupon: ${order.couponCode || "N/A"}
Discount: ₹${order.discount || 0}
Total Paid: ₹${order.totalAmount}

Your order has been received and is being processed.

Regards,
SattViva Team
`
);


sendEmail(
  "info@sattvivanaturals.in",
  "New Order Received",
  `
  Customer: ${customerName}

 Email: ${checkoutEmail || registeredEmail}

Order ID: ${order.orderId}

Products:
${productList}

Subtotal: ₹${order.totalAmount + (order.discount || 0)}
Coupon: ${order.couponCode || "N/A"}
Discount: ₹${order.discount || 0}
Total Paid: ₹${order.totalAmount}
`
);

 console.log("Before clearing cart");


 if (cart) {

  cart.items = [];

  await cart.save();

  console.log(
    "Logged-in user cart cleared"
  );

}


 res.status(201).json({
  success: true,
  order,
});

    
  }catch (error) {
  console.log("FULL ERROR:");
  console.log(error);

  console.log("ERROR RESPONSE:");
  console.log(error.response?.data);

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};

export const createRazorpayOrder = async (
  req,
  res
) => {
  console.log(
  process.env.RAZORPAY_KEY_ID
);

console.log(
  process.env.RAZORPAY_KEY_SECRET
);

const {
  finalAmount,
  productId,
  quantity,
  guestItems = [],
  
} = req.body;
  try {
    let totalAmount = 0;

if (productId) {

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  totalAmount = product.price * quantity;

} else {

  const userId =
    req.user?.userId || null;


  // =========================
  // LOGGED-IN USER CART
  // =========================

  if (userId) {

    const cart =
      await Cart.findOne({
        user: userId,
      }).populate("items.product");


    if (
      !cart ||
      cart.items.length === 0
    ) {

      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });

    }


    for (const item of cart.items) {

      totalAmount +=
        item.product.price *
        item.quantity;

    }

  } else {

    // =========================
    // GUEST CART
    // =========================

    if (
      !Array.isArray(guestItems) ||
      guestItems.length === 0
    ) {

      return res.status(400).json({
        success: false,

        message:
          "Guest cart items are required",
      });

    }


    for (const item of guestItems) {

      const product =
        await Product.findById(
          item.productId
        );


      if (!product) {

        return res.status(404).json({
          success: false,
          message: "Product not found",
        });

      }


      const itemQuantity =
        Number(item.quantity);


      if (
        !Number.isInteger(itemQuantity) ||
        itemQuantity <= 0
      ) {

        return res.status(400).json({
          success: false,
          message: "Invalid quantity",
        });

      }


      totalAmount +=
        product.price *
        itemQuantity;

    }

  }

}

    if (finalAmount) {
  totalAmount = finalAmount;
}

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt:
        "receipt_" + Date.now(),
    };

    const razorpayOrder =
      await razorpay.orders.create(
        options
      );

      
    res.status(200).json({
      success: true,
      order:
        razorpayOrder,
      amount:
        totalAmount,
    });
  } catch (error) {
  console.log("========== RAZORPAY ERROR ==========");
  console.log(error);

  console.log("STATUS CODE:");
  console.log(error.statusCode);

  console.log("ERROR DESCRIPTION:");
  console.log(error.error);

  console.log("MESSAGE:");
  console.log(error.message);

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};
export const getMyOrders = async (
  req,
  res
) => {
  try {
    const orders = await Order.find({
      user: req.user.userId,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Used by the success page to poll for the Shiprocket order/shipment
// IDs, which are created in the background right after the order
// response is sent (see createOrder / createBuyNowOrder).
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    ).select(
      "orderId user paymentMethod paymentStatus orderStatus shiprocketOrderId shiprocketShipmentId awbCode totalAmount"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Orders placed by a registered user can only be viewed by that
    // same user (or an admin). Guest orders (order.user is null) are
    // viewable by anyone who has the order's Mongo _id, which is what
    // the success page already has right after checkout.
    if (order.user) {
      const requesterId = req.user?.userId;

      const isOwner =
        requesterId &&
        requesterId === order.user.toString();

      if (!isOwner) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("GET ORDER BY ID ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Previous status save karna
    const previousStatus = order.orderStatus;

    // New status
    order.orderStatus = status;

    await order.save();

    // =================================
    // GUEST REVIEW EMAIL
    // =================================

 if (
  status === "Delivered" &&
  previousStatus !== "Delivered" &&
  !order.reviewEmailSentAt
) {
  await sendReviewEmail(order);
}

    res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {

    console.error(
      "UPDATE ORDER STATUS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTrackingNumber = async (
  req,
  res
) => {
  try {
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.trackingNumber =
      req.body.trackingNumber;

    await order.save();

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Only the owner can cancel
    if (order.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Cannot cancel after shipping
    if (
      order.orderStatus === "Shipped" ||
      order.orderStatus === "Delivered" ||
      order.orderStatus === "Cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This order has already been shipped. Please contact customer support or refuse delivery from the courier partner.",
      });
    }


    // -------------Debug Block---------------------

    console.log("CANCEL ORDER ID:", order._id);

console.log(
  "CANCEL SHIPROCKET ORDER ID:",
  order.shiprocketOrderId
);

// ================= SHIPROCKET CANCEL =================

if (order.shiprocketOrderId) {
  try {
    await cancelShiprocketOrder(
      order.shiprocketOrderId
    );

    console.log(
      "SHIPROCKET ORDER CANCELLED:",
      order.shiprocketOrderId
    );
  } catch (shiprocketError) {
    console.error(
      "SHIPROCKET CANCELLATION FAILED:",
      shiprocketError.response?.data ||
        shiprocketError.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to cancel shipment. Please try again.",
    });
  }
}

    // Restore Product Stock
    for (const item of order.items) {

      const product = await Product.findById(item.product);

      if (product) {

        product.stock += item.quantity;

        await product.save();

      }

    }

    // Cancel Order
    order.orderStatus = "Cancelled";

    // For prepaid orders
    if (
      order.paymentMethod === "ONLINE"
    ) {
      order.refundStatus = "Pending";
    }

    await order.save();


    const user = await User.findById(order.user);

const productList = await Promise.all(
  order.items.map(async (item) => {
    const product = await Product.findById(item.product);
    return `${product.title} x ${item.quantity}`;
  })
);

sendEmail(
  user.email,
  "Order Cancellation Confirmation - SattViva",
  `
Hello ${user.name},

Your order has been cancelled successfully.

Order ID:
${order.orderId}

Cancelled Products:
${productList.join("\n")}

Refund Status:
${
  order.paymentMethod === "ONLINE"
    ? "Your refund has been initiated and will be processed within 5-7 business days."
    : "Since this was a Cash on Delivery order, no refund is required."
}

If you have any questions, please contact our support team.

Regards,
SattViva Team
`
);

sendEmail(
  "info@sattvivanaturals.in",
  "Order Cancelled - SattViva",
  `
Customer Name:
${user.name}

Customer Email:
${user.email}

Order ID:
${order.orderId}

Cancelled Products:
${productList.join("\n")}

Payment Method:
${order.paymentMethod}

Order Total:
₹${order.totalAmount}

Refund Status:
${
  order.paymentMethod === "ONLINE"
    ? "Pending"
    : "Not Required"
}
`
);

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully.",
      order,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


export const createBuyNowOrder = async (req, res) => {
 try {
  const {
    productId,
    variantId,
    quantity,
    shippingAddress,
    billingAddress,
    paymentMethod,
    razorpayOrderId,
    razorpayPaymentId,
    finalAmount,
    couponCode,
    discount,
  } = req.body;

    const userId =
  req.user?.userId || null;

const isGuestOrder =
  !userId;


    const product =
await Product.findById(productId);


const orderQuantity =
  Number(quantity);


if (
  !Number.isInteger(orderQuantity) ||
  orderQuantity <= 0
) {

  return res.status(400).json({
    success: false,
    message: "Invalid quantity",
  });

}

if(!product){

return res.status(404).json({

success:false,

message:"Product not found"

});

}

if (
  product.stock < orderQuantity
){

  return res.status(400).json({
  
  success:false,
  
  message:"Out of Stock"
  
  });
  
  }

  const selectedVariant = product.variants.id(variantId);

if (!selectedVariant) {
  return res.status(400).json({
    success: false,
    message: "Variant not found",
  });
}

if (selectedVariant.stock < orderQuantity) {
  return res.status(400).json({
    success: false,
    message: "Out of Stock",
  });
}

selectedVariant.stock -= orderQuantity;

product.stock = product.variants.reduce(
  (total, v) => total + v.stock,
  0
);

await product.save();

const counter = await Counter.findByIdAndUpdate(
  "order",
  { $inc: { seq: 1 } },
  {
    new: true,
    upsert: true,
  }
);

const orderId = generateOrderId(counter.seq);

const order = await Order.create({

  orderId,

  user: userId,

  isGuestOrder,

  items: [{
    product: product._id,
    quantity,
    price: product.price,
  }],

  totalAmount:
  typeof finalAmount === "number"
    ? finalAmount
    : product.price * quantity,
  couponCode,
  discount,

  paymentMethod,

  paymentStatus:
    paymentMethod === "ONLINE"
      ? "Paid"
      : "Pending",

  razorpayOrderId,

  razorpayPaymentId,

  shippingAddress,

  billingAddress,

});

const user = userId
  ? await User.findById(userId)
  : null;



  // =========================
// CUSTOMER INFO
// =========================

const customerName =
  user?.name ||
  shippingAddress.fullName;


const customerEmail =
  user?.email ||
  shippingAddress.email;

  const productList =
  `${product.title} x ${orderQuantity}`;


// =========================
// RESPOND IMMEDIATELY
// =========================
// Shiprocket + emails happen in the background below so the
// "Pay Now" / "Place Order" button doesn't hang waiting on
// external services before the customer sees success.

res.status(201).json({

  success: true,

  order,

});


// =========================
// CREATE SHIPROCKET ORDER (background)
// =========================

(async () => {
  try {

    const populatedOrder =
      await Order.findById(
        order._id
      ).populate("items.product");


    const shiprocketData =
      await createShiprocketOrder(
        populatedOrder,
        {
          name: customerName,
          email: customerEmail,
        }
      );


    order.shiprocketOrderId =
      shiprocketData.order_id
        ?.toString() || "";


    order.shiprocketShipmentId =
      shiprocketData.shipment_id
        ?.toString() || "";


    await order.save();


    console.log(
      "BUY NOW SHIPROCKET IDS SAVED:",
      {
        orderId:
          order.shiprocketOrderId,

        shipmentId:
          order.shiprocketShipmentId,
      }
    );

  } catch (shiprocketError) {

    console.error(
      "BUY NOW SHIPROCKET FAILED:",
      shiprocketError.response?.data ||
      shiprocketError.message
    );

  }
})();



// await sendEmail(
//   user.email,
//   "Order Confirmation - SattViva",
//   `
// Hello ${user.name},

// Thank you for your order!

// Order ID: ${order._id}

// Products:
// ${productList}

// Total Amount: ₹${order.totalAmount}

// Your order has been received and is being processed.

// Regards,
// SattViva Team
// `
// );

// await sendEmail(
//   "info@sattvivanaturals.in",
//   "New Order Received",
//   `
// Customer: ${user.name}

// Email: ${user.email}

// Order ID: ${order._id}

// Products:
// ${productList}

// Total Amount: ₹${order.totalAmount}
// `
// );


// ================= SHIPROCKET =================

// try {

//   const populatedOrder =
//     await Order.findById(
//       order._id
//     ).populate("items.product");

//   const shiprocketData =
//     await createShiprocketOrder(
//       populatedOrder,
//       user
//     );

//   order.shiprocketOrderId =
//     shiprocketData.order_id?.toString() || "";

//   order.shiprocketShipmentId =
//     shiprocketData.shipment_id?.toString() || "";

//   await order.save();

//   console.log(
//     "BUY NOW SHIPROCKET IDS SAVED:",
//     {
//       orderId:
//         order.shiprocketOrderId,

//       shipmentId:
//         order.shiprocketShipmentId,
//     }
//   );

// } catch (shiprocketError) {

//   console.error(
//     "BUY NOW SHIPROCKET FAILED:",
//     shiprocketError.response?.data ||
//     shiprocketError.message
//   );

// }


// ================= ORDER EMAILS =================

sendEmail(
  customerEmail,
  "Order Confirmation - SattViva",
  `
  Hello ${customerName},

Thank you for your order!

Order ID: ${order.orderId}

Products:
${productList}

Total Amount: ₹${order.totalAmount}

Shiprocket Order ID: ${
  order.shiprocketOrderId || "Pending"
}

Shipment ID: ${
  order.shiprocketShipmentId || "Pending"
}

Tracking ID / AWB: ${
  order.awbCode || "Not assigned yet"
}

Your order has been received and is being processed.

You will receive tracking details once a courier is assigned.

Regards,
SattViva Team
`
);


sendEmail(
  "info@sattvivanaturals.in",
  "New Order Received",
  `
Customer: ${customerName}

Email: ${customerEmail}

Customer Type: ${
  isGuestOrder
    ? "Guest Checkout"
    : "Registered Customer"
}

Order Type: Buy Now

Order ID: ${order.orderId}

Products:
${productList}

Total Amount: ₹${order.totalAmount}

Shiprocket Order ID:
${order.shiprocketOrderId || "Pending"}

Shipment ID:
${order.shiprocketShipmentId || "Pending"}
`
);



 } catch (error) {

  console.error("BUY NOW ORDER ERROR:", error);

  if (!res.headersSent) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
 }
};

// ================= RETURN ORDER =================

export const returnOrder = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    ).populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      !order.user ||
      order.user.toString() !==
        req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (
      order.orderStatus !== "Delivered"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Return is only available after delivery.",
      });
    }

    if (
      order.returnStatus !== "Not Requested"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Return request already submitted.",
      });
    }

    const user = await User.findById(
      order.user
    );

    const shiprocketData =
      await createShiprocketReturnOrder(
        order,
        user,
        "RETURN"
      );

    order.returnStatus = "Requested";

    order.returnType = "RETURN";

    order.shiprocketReturnOrderId =
      shiprocketData.order_id?.toString() ||
      "";

    order.shiprocketReturnShipmentId =
      shiprocketData.shipment_id?.toString() ||
      "";

    order.returnAwbCode =
      shiprocketData.awb_code || "";

    await order.save();

    console.log(
      "RETURN ORDER SAVED:",
      {
        returnStatus:
          order.returnStatus,

        shiprocketReturnOrderId:
          order.shiprocketReturnOrderId,

        shiprocketReturnShipmentId:
          order.shiprocketReturnShipmentId,
      }
    );

    return res.status(200).json({
      success: true,

      message:
        "Return request submitted successfully. Refund will be processed after successful pickup and verification.",

      order,
    });

  } catch (error) {

    console.error(
      "RETURN ORDER ERROR:",
      error.response?.data ||
      error.message
    );

    return res.status(500).json({
      success: false,

      message:
        error.response?.data?.message ||
        error.message,
    });
  }
};

// ================= REPLACE ORDER =================

export const replaceOrder = async (
  req,
  res
) => {
  try {
    const order = await Order.findById(
      req.params.id
    ).populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      !order.user ||
      order.user.toString() !==
        req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (
      order.orderStatus !== "Delivered"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Replacement is only available after delivery.",
      });
    }

    if (
      order.replaceStatus !==
      "Not Requested"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Replacement request already submitted.",
      });
    }

    const user = await User.findById(
      order.user
    );

    const shiprocketData =
      await createShiprocketReturnOrder(
        order,
        user,
        "REPLACEMENT"
      );

    order.replaceStatus = "Requested";

    order.returnType = "REPLACEMENT";

    order.shiprocketReturnOrderId =
      shiprocketData.order_id?.toString() ||
      "";

    order.shiprocketReturnShipmentId =
      shiprocketData.shipment_id?.toString() ||
      "";

    order.returnAwbCode =
      shiprocketData.awb_code || "";

    await order.save();

    console.log(
      "REPLACEMENT RETURN SAVED:",
      {
        replaceStatus:
          order.replaceStatus,

        shiprocketReturnOrderId:
          order.shiprocketReturnOrderId,

        shiprocketReturnShipmentId:
          order.shiprocketReturnShipmentId,
      }
    );

    return res.status(200).json({
      success: true,

      message:
        "Replacement request submitted successfully. Pickup will be processed first.",

      order,
    });

  } catch (error) {

    console.error(
      "REPLACE ORDER ERROR:",
      error.response?.data ||
      error.message
    );

    return res.status(500).json({
      success: false,

      message:
        error.response?.data?.message ||
        error.message,
    });
  }
};

export const downloadInvoice = async (req, res) => {
  try {

    const order = await Order.findById(req.params.id)
  .populate("user")
  .populate("items.product");

  if (!order) {
  return res.status(404).json({
    success: false,
    message: "Order not found",
  });
}

if (
  order.user &&
  order.user._id.toString() !== req.user.userId
) {
  return res.status(403).json({
    success: false,
    message: "Unauthorized",
  });
}

const doc = new PDFDocument({
  margin: 40,
});

res.setHeader(
  "Content-Type",
  "application/pdf"
);

res.setHeader(
  "Content-Disposition",
  `attachment; filename=Invoice-${order.orderId}.pdf`
);

doc.pipe(res);

// ================= HEADER =================

doc
  .lineWidth(1)
  .rect(20, 20, 555, 800)
  .stroke("#cfcfcf");
doc
  .rect(0, 0, 595, 85)
  .fill("#0b3d1f");

doc
  .fillColor("white")
  .fontSize(24)
  .font("Helvetica-Bold")
  .text("SATTVIVA NATURALS", 40, 20);

doc
  .fontSize(10)
  .font("Helvetica")
  .text("WHEN PURITY MEETS LIFE", 42, 50);

doc
  .fontSize(18)
  .font("Helvetica-Bold")
  .text("TAX INVOICE", 380, 20);

doc
  .fontSize(10)
  .font("Helvetica")
  .text(`Invoice No : INV-${order._id.toString().slice(-6)}`, 380, 45);

doc.text(
  `Invoice Date : ${new Date(
    order.createdAt
  ).toLocaleDateString()}`,
  380,
  60
);

doc.moveDown(4);

// ================= SOLD BY =================

doc
  .fillColor("black")
  .font("Helvetica-Bold")
  .fontSize(12)
  .text("SOLD BY", 40, 120);

 
doc
  .font("Helvetica")
  .fontSize(10)
  .text(
    "SattViva Naturals Pvt. Ltd.",
    40,
    140
  );

doc.text(
  "Kanpur, Uttar Pradesh",
  40,
  155
);

doc.text(
  "GSTIN: XXABCDE1234F1Z5",
  40,
  170
);

doc.text(
  "Email: info@sattvivanaturals.in",
  40,
  185
);

doc.text(
  "Phone: +91 8448349300",
  40,
  200
);

doc
  .font("Helvetica-Bold")
  .fontSize(12)
  .text("BILL TO", 250, 120);

doc
  .font("Helvetica")
  .fontSize(10)
  .text(
    order.shippingAddress.fullName,
    250,
    140
);

doc.text(
  order.shippingAddress.address,
  250,
  155,
  {
    width: 180,
  }
);

doc.text(
  `${order.shippingAddress.city}, ${order.shippingAddress.state}`,
  250,
  185
);

doc.text(
  order.shippingAddress.email,
  250,
  200
);

doc.text(
  order.shippingAddress.phone,
  250,
  215
);

doc
  .font("Helvetica-Bold")
  .fontSize(12)
  .text("SHIP TO", 430, 120);

doc
  .font("Helvetica")
  .fontSize(10)
  .text(
    "Same as Billing Address",
    430,
    140
);



// doc.moveDown();


// doc.text("Products");

// doc.moveDown();

// order.items.forEach((item) => {
//   doc.text(
//     `${item.product?.title || "Product"} × ${item.quantity} = Rs. ${item.price * item.quantity}`
//   );
// });

// doc.moveDown();

// doc.fontSize(16).text(
//   `Total: ₹${order.totalAmount}`
// );

// doc.text(
//   `Payment: ${order.paymentMethod}`
// );

// doc.text(
//   `Status: ${order.paymentStatus}`
// );
// ================= PRODUCT TABLE =================

// ================= PRODUCT TABLE =================

let tableTop = 270;

doc
  .fillColor("#0b3d1f")
  .rect(40, tableTop, 515, 25)
  .fill();

doc
  .fillColor("white")
  .font("Helvetica-Bold")
  .fontSize(10);

doc.text("S.No", 50, tableTop + 8);
doc.text("Product", 95, tableTop + 8);
doc.text("Qty", 330, tableTop + 8);
doc.text("Price", 390, tableTop + 8);
doc.text("Amount", 470, tableTop + 8);

let y = tableTop + 25;

doc.font("Helvetica").fillColor("black");

let subtotal = 0;

order.items.forEach((item, index) => {

  const amount = item.price * item.quantity;

  subtotal += amount;

  doc.rect(40, y, 515, 25).stroke();

  doc.text(index + 1, 50, y + 8);

  doc.text(
    item.product?.title || "Product",
    95,
    y + 8,
    {
      width: 220,
    }
  );

  doc.text(item.quantity.toString(), 330, y + 8);

  doc.text(`Rs. ${item.price}`, 390, y + 8);

  doc.text(`Rs. ${amount}`, 470, y + 8);

  y += 25;
});

y += 20;

// ================= ORDER SUMMARY =================

doc
  .font("Helvetica-Bold")
  .fontSize(11)
  .text("Order Summary", 340, y);

y += 25;

doc
  .font("Helvetica")
  .fontSize(10);

// Subtotal
doc.text("Subtotal", 340, y);
doc.text(`Rs. ${subtotal}`, 470, y);

y += 18;

// Coupon
doc.text("Coupon", 340, y);
doc.text(order.couponCode || "N/A", 470, y);

y += 18;

// Discount
doc.text("Discount", 340, y);
doc.text(`- Rs. ${order.discount || 0}`, 470, y);

y += 18;

// Shipping
doc.text("Shipping", 340, y);
doc.text("Rs. 0", 470, y);

y += 18;

// Divider
doc
  .moveTo(340, y)
  .lineTo(540, y)
  .stroke();

y += 10;

// Grand Total
doc
  .font("Helvetica-Bold")
  .fontSize(12);

doc.text("Grand Total", 340, y);
doc.text(`Rs. ${order.totalAmount}`, 470, y);

y += 45;

// ================= PAYMENT DETAILS =================

doc
  .font("Helvetica-Bold")
  .fontSize(11)
  .text("Payment Details", 40, y);

y += 20;

doc
  .font("Helvetica")
  .fontSize(10);

doc.text(
  `Payment Method : ${order.paymentMethod}`,
  40,
  y
);

y += 18;

doc.text(
  `Payment Status : ${order.paymentStatus}`,
  40,
  y
);

y += 18;

doc.text(
  `Order Status : ${order.orderStatus}`,
  40,
  y
);

y += 45;

// ================= DECLARATION =================

doc
  .font("Helvetica-Bold")
  .fontSize(11)
  .text("Declaration", 40, y);

y += 18;

doc
  .font("Helvetica")
  .fontSize(9)
  .text(
    "We declare that this invoice shows the actual price of the goods described and all particulars are true and correct.",
    40,
    y,
    {
      width: 500,
    }
  );

y += 50;

doc
  .fontSize(9)
  .fillColor("gray")
  .text(
    "This is a computer generated invoice. No signature is required.",
    40,
    y,
    {
      align: "center",
    }
  );

doc.end();
  } catch (error) {

  console.error("INVOICE ERROR:");
  console.error(error);

  if (!res.headersSent) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
};