import axios from "axios";

export const getShiprocketToken = async () => {
  try {
    console.log("SHIPROCKET LOGIN STARTED");

    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      }
    );

   

    console.log(
      "SHIPROCKET CONNECTED:",
      !!response.data.token
    );

    return response.data.token;
  } catch (error) {
    console.error(
      "SHIPROCKET LOGIN ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const createShiprocketOrder = async (
  order,
  user
) => {
  try {
    console.log("CREATING SHIPROCKET ORDER");

    const token = await getShiprocketToken();

    const shipping = order.shippingAddress;

    const orderItems = order.items.map((item) => ({
      name:
        item.product?.title ||
        "SattViva Product",

      sku:
        item.product?._id?.toString() ||
        item.product?.toString(),

      units: item.quantity,

      selling_price: item.price,
    }));

    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      {
        order_id: order._id.toString(),

        order_date: new Date(
          order.createdAt
        )
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),

       

        billing_customer_name:
          shipping.fullName,

        billing_last_name: "",

        billing_address:
          shipping.address,

        billing_city:
          shipping.city,

        billing_pincode:
          shipping.pincode,

        billing_state:
          shipping.state,

        billing_country: "India",

        billing_email:
          shipping.email || user.email,

        billing_phone:
          shipping.phone,

        shipping_is_billing: true,

        order_items: orderItems,

        payment_method:
          order.paymentMethod === "COD"
            ? "COD"
            : "Prepaid",

        sub_total:
          order.totalAmount,

        length: 10,
        breadth: 10,
        height: 10,
        weight: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      "RAW SHIPROCKET RESPONSE:",
      response.data
    );
    
    if (
      !response.data?.order_id ||
      !response.data?.shipment_id
    ) {
      throw new Error(
        response.data?.message ||
        "Shiprocket order creation failed"
      );
    }
    
    console.log(
      "SHIPROCKET ORDER CREATED:",
      response.data
    );
    
    return response.data;
    
    } catch (error) {
    
      console.error(
        "SHIPROCKET CREATE ORDER ERROR:",
        error.response?.data ||
        error.message
      );
    
      throw error;
    }
};


// --------------------Cancel



export const cancelShiprocketOrder = async (
  shiprocketOrderId
) => {
  try {
    console.log(
      "CANCELLING SHIPROCKET ORDER:",
      shiprocketOrderId
    );

    const token =
      await getShiprocketToken();

    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/cancel",
      {
        ids: [
          Number(shiprocketOrderId)
        ],
      },
      {
        headers: {
          Authorization:
            `Bearer ${token}`,

          "Content-Type":
            "application/json",
        },
      }
    );

    console.log(
      "SHIPROCKET CANCEL SUCCESS:",
      response.status
    );

    return true;

  } catch (error) {

    console.error(
      "SHIPROCKET CANCEL ERROR:",
      error.response?.data ||
      error.message
    );

    throw error;
  }
};


// -----------Cancel ShipROcket and Replace

export const createShiprocketReturnOrder = async (
  order,
  user,
  returnType = "RETURN"
) => {
  try {
    console.log(
      "CREATING SHIPROCKET RETURN ORDER:",
      order._id
    );

    const token = await getShiprocketToken();

    const shipping = order.shippingAddress;

    const orderItems = order.items.map((item) => ({
      name:
        item.product?.title ||
        "SattViva Product",

      sku:
        item.product?._id?.toString() ||
        item.product?.toString(),

      units: item.quantity,

      selling_price: item.price,
    }));

    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/return",
      {
        order_id:
          `${order._id}-${returnType}-${Date.now()}`,

        order_date: new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),

        pickup_customer_name:
          shipping.fullName,

        pickup_last_name: "",

        pickup_address:
          shipping.address,

        pickup_city:
          shipping.city,

        pickup_state:
          shipping.state,

        pickup_country: "India",

        pickup_pincode:
          shipping.pincode,

        pickup_email:
          shipping.email || user.email,

        pickup_phone:
          shipping.phone,

        shipping_customer_name:
          "SattViva Naturals",

        shipping_last_name: "",

        shipping_address:
          process.env.SHIPROCKET_RETURN_ADDRESS,

        shipping_city:
          process.env.SHIPROCKET_RETURN_CITY,

        shipping_state:
          process.env.SHIPROCKET_RETURN_STATE,

        shipping_country: "India",

        shipping_pincode:
          process.env.SHIPROCKET_RETURN_PINCODE,

        shipping_email:
          process.env.SHIPROCKET_RETURN_EMAIL,

        shipping_phone:
          process.env.SHIPROCKET_RETURN_PHONE,

        order_items: orderItems,

        payment_method: "Prepaid",

        sub_total:
          order.totalAmount,

        length: 10,

        breadth: 10,

        height: 10,

        weight: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,

          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      "RAW SHIPROCKET RETURN RESPONSE:",
      response.data
    );

    if (
      !response.data?.order_id ||
      !response.data?.shipment_id
    ) {
      throw new Error(
        response.data?.message ||
        "Shiprocket return order creation failed"
      );
    }

    return response.data;

  } catch (error) {

    console.error(
      "SHIPROCKET RETURN ERROR:",
      error.response?.data ||
      error.message
    );

    throw error;
  }
};