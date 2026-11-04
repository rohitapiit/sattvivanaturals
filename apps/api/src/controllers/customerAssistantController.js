
import axios from "axios";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

const normalizePhone = (value) => {
  let digits = String(value || "").replace(/\D/g, "");

  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  }

  return digits;
};

const safeRegex = (value) =>
  String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

async function searchProducts({ query, category, limit = 10 } = {}) {
  const filters = { isActive: { $ne: false } };

  if (query?.trim()) {
    const regex = new RegExp(safeRegex(query.trim()), "i");

    filters.$or = [
      { title: regex },
      { description: regex },
      { category: regex },
      { subcategory: regex },
      { ingredients: regex },
      { "variants.size": regex },
    ];
  }

  if (category?.trim()) {
    filters.category = new RegExp(safeRegex(category.trim()), "i");
  }

  const products = await Product.find(filters)
    .select(
      "title description category subcategory price cutPrice stock keyBenefits variants ingredients images"
    )
    .sort({ displayOrder: 1, createdAt: -1 })
    .limit(Math.min(Math.max(Number(limit) || 10, 1), 20))
    .lean();

  return products.map((product) => ({
    id: String(product._id),
    title: product.title,
    description: product.description,
    category: product.category,
    subcategory: product.subcategory,
    price: product.price,
    cutPrice: product.cutPrice,
    stock: product.stock ?? 0,
    keyBenefits: product.keyBenefits || [],
    variants: product.variants || [],
    ingredients: product.ingredients || "",
    images: product.images || [],
  }));
}

async function getProductDetails({ product_id }) {
  if (!mongoose.isValidObjectId(product_id)) {
    return null;
  }

  const product = await Product.findOne({
    _id: product_id,
    isActive: { $ne: false },
  })
    .select(
      "title description category subcategory price cutPrice stock keyBenefits variants uses nutritionalInformation ingredients labReports images"
    )
    .lean();

  if (!product) return null;

  return {
    id: String(product._id),
    title: product.title,
    description: product.description,
    category: product.category,
    subcategory: product.subcategory,
    price: product.price,
    cutPrice: product.cutPrice,
    stock: product.stock ?? 0,
    keyBenefits: product.keyBenefits || [],
    variants: product.variants || [],
    uses: product.uses || [],
    nutritionalInformation: product.nutritionalInformation || "",
    ingredients: product.ingredients || "",
    labReports: product.labReports || [],
    images: product.images || [],
  };
}

async function getCustomerOrderStatus({ order_id, phone_number }) {
  const normalizedOrderId = String(order_id || "").trim().toUpperCase();
  const normalizedPhone = normalizePhone(phone_number);

  if (!normalizedOrderId || normalizedPhone.length < 10) {
    return {
      verified: false,
      message: "Please provide your order ID and the phone number used during checkout.",
    };
  }

  const order = await Order.findOne({ orderId: normalizedOrderId })
    .select(
      "orderId orderStatus paymentStatus totalAmount createdAt trackingNumber awbCode returnStatus replaceStatus shippingAddress.phone billingAddress.phone"
    )
    .lean();

  const shippingPhone = normalizePhone(order?.shippingAddress?.phone);
  const billingPhone = normalizePhone(order?.billingAddress?.phone);

  if (
    !order ||
    (normalizedPhone !== shippingPhone &&
      normalizedPhone !== billingPhone)
  ) {
    return {
      verified: false,
      message:
        "We couldn't verify this order. Please check your order ID and phone number.",
    };
  }

  return {
    verified: true,
    order_id: order.orderId,
    order_status: order.orderStatus,
    payment_status: order.paymentStatus,
    total_amount: order.totalAmount,
    order_date: order.createdAt,
    tracking_number: order.trackingNumber,
    awb_code: order.awbCode,
    return_status: order.returnStatus,
    replace_status: order.replaceStatus,
  };
}

const customerTools = [
  {
    type: "function",
    function: {
      name: "search_products",
      description:
        "Search active Sattviva products. Use this for product lists, prices, categories, ingredients, benefits and availability. Use an empty query to list products.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string" },
          category: { type: "string" },
          limit: { type: "integer" },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_product_details",
      description:
        "Get detailed information about one specific product using its MongoDB product ID.",
      parameters: {
        type: "object",
        properties: {
          product_id: { type: "string" },
        },
        required: ["product_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_customer_order_status",
      description:
        "Verify an order using both order ID and checkout phone number before returning its status.",
      parameters: {
        type: "object",
        properties: {
          order_id: { type: "string" },
          phone_number: { type: "string" },
        },
        required: ["order_id", "phone_number"],
      },
    },
  },
];

async function executeTool(name, args) {
  if (name === "search_products") return searchProducts(args);
  if (name === "get_product_details") return getProductDetails(args);
  if (name === "get_customer_order_status") {
    return getCustomerOrderStatus(args);
  }

  return { error: "Unsupported customer request." };
}

export const customerChat = async (req, res) => {
  try {
    const message = req.body?.message;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        response: "Please enter a message so I can help you.",
        products: [],
        order: null,
      });
    }

    if (message.length > 4000) {
      return res.status(400).json({
        success: false,
        response: "Please shorten your message and try again.",
        products: [],
        order: null,
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({
        success: false,
        response: "The customer assistant is not configured right now.",
        products: [],
        order: null,
      });
    }

    const messages = [
      {
        role: "system",
        content: `
You are the Sattviva Naturals customer assistant.

Help customers with Sattviva products, prices, ingredients, benefits,
availability and their own order status.

Rules:
1. Use tools whenever current product or order information is needed.
2. Never invent products, prices, stock or order information.
3. Never claim a product is available unless the database supports it.
4. Order details may only be shared after both order ID and checkout
   phone number have been verified by the order tool.
5. Never reveal another customer's information, addresses or phone numbers.
6. Never reveal business analytics, revenue, sales statistics or admin data.
7. If a customer asks to see products, search the product database.
8. Currency is Indian Rupees (INR).
9. Keep replies concise, friendly and helpful.
        `.trim(),
      },
      { role: "user", content: message.trim() },
    ];

    const headers = {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    };

    const firstResponse = await axios.post(
      GROQ_URL,
      {
        model: GROQ_MODEL,
        messages,
        tools: customerTools,
        tool_choice: "auto",
        temperature: 0.2,
      },
      { headers, timeout: 45000 }
    );

    const assistantMessage = firstResponse.data?.choices?.[0]?.message;

    if (!assistantMessage) {
      throw new Error("The AI assistant returned an empty response.");
    }

    const products = [];
    let verifiedOrder = null;

    if (!assistantMessage.tool_calls?.length) {
      return res.json({
        success: true,
        response:
          assistantMessage.content || "How can I help you with Sattviva?",
        products,
        order: verifiedOrder,
      });
    }

    messages.push(assistantMessage);

    for (const toolCall of assistantMessage.tool_calls) {
      const toolName = toolCall.function?.name;

      let result;

      try {
        const args = JSON.parse(toolCall.function?.arguments || "{}");

        if (!args || typeof args !== "object" || Array.isArray(args)) {
          throw new Error("Invalid tool arguments.");
        }

        result = await executeTool(toolName, args);

        if (toolName === "search_products" && Array.isArray(result)) {
          products.push(...result);
        }

        if (
          toolName === "get_product_details" &&
          result?.id
        ) {
          products.push(result);
        }

        if (
          toolName === "get_customer_order_status" &&
          result?.verified === true
        ) {
          verifiedOrder = result;
        }
      } catch (error) {
        console.error("Customer assistant tool failed:", toolName);
        result = {
          error: "We could not complete this request. Please try again.",
        };
      }

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      });
    }

    const finalResponse = await axios.post(
      GROQ_URL,
      {
        model: GROQ_MODEL,
        messages,
        tools: customerTools,
        tool_choice: "none",
        temperature: 0.2,
      },
      { headers, timeout: 45000 }
    );

    const answer =
      finalResponse.data?.choices?.[0]?.message?.content;

    return res.json({
      success: true,
      response: answer || "I could not prepare a response. Please try again.",
      products,
      order: verifiedOrder,
    });
  } catch (error) {
    console.error(
      "CUSTOMER CHAT ERROR:",
      error.response?.status || error.code || error.message
    );

    return res.status(500).json({
      success: false,
      response:
        "Sorry, something went wrong while processing your request. Please try again.",
      products: [],
      order: null,
    });
  }
};
