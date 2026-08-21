import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(

  {

    orderId: {
      type: String,
      unique: true,
      required: true,
    },


    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },


  
    // ---guest order
    isGuestOrder: {
      type: Boolean,
      default: false,
    },

    // -------------
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Paid",
        "Failed",
      ],
      default: "Pending",
    },

    couponCode: {
      type: String,
      default: "",
    },
    
    discount: {
      type: Number,
      default: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["ONLINE", "COD"],
      default: "ONLINE",
    },

    refundStatus: {
      type: String,
      enum: [
        "Not Required",
        "Pending",
        "Processed",
      ],
      default: "Not Required",
    },

 shippingAddress: {
  fullName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },

  state: {
    type: String,
    required: true,
  },

  pincode: {
    type: String,
    required: true,
  },
},

billingAddress: {
  fullName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },

  state: {
    type: String,
    required: true,
  },

  pincode: {
    type: String,
    required: true,
  },
},

// --------ShipRocket

trackingNumber: {
  type: String,
  default: "",
},

shiprocketOrderId: {
  type: String,
  default: "",
},

shiprocketShipmentId: {
  type: String,
  default: "",
},

awbCode: {
  type: String,
  default: "",
},

  // ----------------------Return/Replace

  shiprocketReturnOrderId: {
    type: String,
    default: "",
  },
  
  shiprocketReturnShipmentId: {
    type: String,
    default: "",
  },
  
  returnAwbCode: {
    type: String,
    default: "",
  },
  
  returnType: {
    type: String,
    enum: [
      "NONE",
      "RETURN",
      "REPLACEMENT",
    ],
    default: "NONE",
  },



returnStatus: {
  type: String,
  enum: [
    "Not Requested",
    "Requested",
    "Pickup Scheduled",
    "Picked Up",
    "Refund Processing",
    "Refunded",
    "Rejected",
  ],
  default: "Not Requested",
},

replaceStatus: {
  type: String,
  enum: [
    "Not Requested",
    "Requested",
    "Pickup Scheduled",
    "Picked Up",
    "Replacement Processing",
    "Replacement Shipped",
    "Completed",
    "Rejected",
  ],
  default: "Not Requested",
},



    razorpayOrderId: String,
    razorpayPaymentId: String,


reviewTokens: [
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    token: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    used: {
      type: Boolean,
      default: false,
    },
  },
],

reviewEmailSentAt: {
  type: Date,
  default: null,
},


  },

  {
    timestamps: true,
  }  
);
export default mongoose.model("Order", orderSchema);
