import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ReviewDialog from "@/components/ReviewDialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const API = import.meta.env.VITE_API_URL;



const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCancelDialog, setShowCancelDialog] = useState(false);

const [selectedOrderId, setSelectedOrderId] = useState(null);

const [cancelLoading, setCancelLoading] = useState(null);

const [showReturnDialog, setShowReturnDialog] = useState(false);
const [showReplaceDialog, setShowReplaceDialog] = useState(false);

const [selectedReturnOrderId, setSelectedReturnOrderId] = useState(null);
const [selectedReplaceOrderId, setSelectedReplaceOrderId] = useState(null);

const [returnLoading, setReturnLoading] = useState(false);
const [replaceLoading, setReplaceLoading] = useState(false);

const [showReviewDialog, setShowReviewDialog] = useState(false);
const [editingReview, setEditingReview] = useState(null);

const [selectedProduct, setSelectedProduct] = useState(null);

const [selectedOrder, setSelectedOrder] = useState(null);

const [rating, setRating] = useState(0);

const [review, setReview] = useState("");

const [reviewLoading, setReviewLoading] = useState(false);

const [reviewImages, setReviewImages] = useState([]);



  useEffect(() => {
    fetchOrders();
  }, []);

  // ================= FETCH ORDERS =================
  const fetchOrders = async () => {
    try {
      setLoading(true);
  
      const token = localStorage.getItem("token");
  
      console.log("API URL:", API);
      console.log("Token:", token);
  
      const response = await fetch(
        `${API}/orders/my-orders`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Orders response status:", response.status);
  
      const data = await response.json();
  
      console.log("ORDERS API DATA:", data);
  
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        toast.error(data.message || "Failed to load orders");
        setOrders([]);
      }
  
    } catch (error) {
      console.error("FETCH ORDERS ERROR:", error);
  
      toast.error("Unable to load order history");
  
      setOrders([]);
  
    } finally {
      setLoading(false);
    }
  };

  // ================= CANCEL ORDER =================
  const confirmCancelOrder = async (orderId) => {
    if (!orderId) {
      toast.error("Order ID not found");
      return;
    }
  
    if (cancelLoading === orderId) return;
  
    setCancelLoading(orderId);
  
    try {
      const token = localStorage.getItem("token");
  
      const response = await fetch(
        `${API}/orders/${orderId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const data = await response.json();
  
      console.log("CANCEL RESPONSE:", data);
  
      if (data.success) {
        toast.success(
          data.message || "Order Cancelled Successfully"
        );
  
        await fetchOrders();
  
        setShowCancelDialog(false);
        setSelectedOrderId(null);
      } else {
        toast.error(
          data.message || "Unable to cancel order"
        );
      }
    } catch (error) {
      console.error("CANCEL ORDER ERROR:", error);
  
      toast.error("Something went wrong");
    } finally {
      setCancelLoading(null);
    }
  };
  // ================= RETURN ORDER =================
  const returnOrder = async (orderId) => {
    if (returnLoading) return;
  
    setReturnLoading(true);
  
    try {
      const token = localStorage.getItem("token");
  
      const response = await fetch(
        `${API}/orders/${orderId}/return`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const data = await response.json();
  
      if (data.success) {
        toast.success("Return Request Submitted");
  
        setShowReturnDialog(false);
        setSelectedReturnOrderId(null);
  
        await fetchOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
  
      toast.error("Something went wrong");
    } finally {
      setReturnLoading(false);
    }
  };

  // ================= REPLACE ORDER =================
  const replaceOrder = async (orderId) => {
    if (replaceLoading) return;
  
    setReplaceLoading(true);
  
    try {
      const token = localStorage.getItem("token");
  
      const response = await fetch(
        `${API}/orders/${orderId}/replace`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const data = await response.json();
  
      if (data.success) {
        toast.success("Replacement Request Submitted");
  
        setShowReplaceDialog(false);
        setSelectedReplaceOrderId(null);
  
        await fetchOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
  
      toast.error("Something went wrong");
    } finally {
      setReplaceLoading(false);
    }
  };

  // ================= DOWNLOAD INVOICE =================
  const downloadInvoice = async (orderId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API}/orders/${orderId}/invoice`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download invoice");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice-${orderId}.pdf`;

      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error("Failed to download invoice");
    }
  };

//   const submitReview = async () => {
//   try {
//     setReviewLoading(true);

//     const token = localStorage.getItem("token");

//     const response = await fetch(`${API}/reviews`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         productId: selectedProduct._id,
//         orderId: selectedOrder,
//         rating,
//         review,
//       }),
//     });

//     const data = await response.json();

//     if (data.success) {
//       toast.success("Review Submitted");

//       setShowReviewDialog(false);

//       setReview("");

//       setRating(5);
//     } else {
//       toast.error(data.message);
//     }
//   } catch (error) {
//     console.error(error);

//     toast.error("Something went wrong");
//   } finally {
//     setReviewLoading(false);
//   }
// };


const submitReview = async () => {
  try {
    setReviewLoading(true);

    const token = localStorage.getItem("token");

    // 1. Upload review images to Cloudinary
    let imageUrls = [];

    if (reviewImages.length > 0) {
      const formData = new FormData();

      reviewImages.forEach((file) => {
        formData.append("images", file);
      });

      const uploadResponse = await fetch(`${API}/review-upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadData.success) {
        toast.error(uploadData.message || "Image upload failed");
        return;
      }

      imageUrls = uploadData.imageUrls;
    }

    // 2. Submit review with image URLs
    const response = await fetch(`${API}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: selectedProduct._id,
        orderId: selectedOrder,
        rating,
        review,
        images: imageUrls,
      }),
    });

    const data = await response.json();

    if (data.success) {
      toast.success("Review Submitted");

      setShowReviewDialog(false);

      // Reset form
      setReview("");
      setRating(0);
      setReviewImages([]);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  } finally {
    setReviewLoading(false);
  }
};


const updateReview = async () => {
  try {
    setReviewLoading(true);

    const token = localStorage.getItem("token");

    // New images only
    const newFiles = reviewImages.filter(
      (image) => image instanceof File
    );

    let newImageUrls = [];

    // Upload newly added images
    if (newFiles.length > 0) {
      const formData = new FormData();

      newFiles.forEach((file) => {
        formData.append("images", file);
      });

      const uploadResponse = await fetch(
        `${API}/review-upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const uploadData = await uploadResponse.json();

      if (!uploadData.success) {
        toast.error(
          uploadData.message || "Image upload failed"
        );
        return;
      }

      newImageUrls = uploadData.imageUrls || [];
    }

    // Existing Cloudinary URLs that user did not remove
    const existingImageUrls = reviewImages.filter(
      (image) => typeof image === "string"
    );

    const allImages = [
      ...existingImageUrls,
      ...newImageUrls,
    ];

    const response = await fetch(
      `${API}/reviews/${editingReview._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating,
          review,
          images: allImages,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      toast.success("Review updated successfully");

      setShowReviewDialog(false);
      setEditingReview(null);

      setRating(0);
      setReview("");
      setReviewImages([]);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error("UPDATE REVIEW ERROR:", error);

    toast.error("Something went wrong");
  } finally {
    setReviewLoading(false);
  }
};




  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {/* Loading */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border rounded-lg p-6 animate-pulse"
            >
              <div className="h-5 w-40 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 w-56 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-28 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl border shadow-sm p-5 mb-5 flex flex-col lg:flex-row gap-6"
          >
            {/* Products */}
            <div className="lg:w-[30%]">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 mb-4"
                >
<div className="flex flex-col">
                                  
                  <img
                    src={item.product?.images?.[0] || "/no-image.png"}
                    alt={item.product?.title}
                    className="w-24 h-24 object-cover rounded-lg border"
                  />

                  {order.orderStatus === "Delivered" && (
  <button
onClick={() => {
  setEditingReview(null);

  setSelectedProduct(item.product);
  setSelectedOrder(order._id);

  setRating(0);
  setReview("");
  setReviewImages([]);

  setShowReviewDialog(true);
}}
    className="mt-3 border border-green-600 text-green-600 px-3 py-2 rounded-lg hover:bg-green-50"
  >
    ⭐ Add Review
  </button>
)}

</div>
                  <div>
                    <h3 className="font-semibold">
                      {item.product?.title || "Product Deleted"}
                    </h3>

                    <p>₹{item.price}</p>
                    <p>Qty: {item.quantity}</p>
                  </div>
                </div>

              ))}
            </div>

            {/* Order Details */}
            <div className="lg:w-[25%]">
              <h3 className="font-bold">Order ID</h3>

              <p className="text-xs break-all">{order.orderId}</p>

              <p className="mt-3">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </p>

              <p>
                Payment:
                <span className="text-green-600 font-semibold ml-2">
                  {order.paymentStatus}
                </span>
              </p>

              <p>
                Status:
                <span className="text-orange-600 font-semibold ml-2">
                  {order.orderStatus}
                </span>
              </p>

              <p className="text-green-700 font-bold text-lg mt-2">
                ₹{order.totalAmount}
              </p>
            </div>


            {/* Shipping Address */}
            <div className="lg:w-[25%]">
              <h3 className="font-semibold mb-2">
                Shipping Address
              </h3>

              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.state}
              </p>
              <p>{order.shippingAddress.pincode}</p>
            </div>

            {/* Action Buttons */}
            <div className="lg:w-[20%] flex flex-col gap-3">

              
              <button
                onClick={() => downloadInvoice(order._id)}
                className="border border-green-600 text-green-600 rounded-lg py-2 hover:bg-green-50"
              >
                Download Invoice
              </button>

              {["Pending", "Confirmed"].includes(order.orderStatus) && (
  <button
    onClick={() => {
      setSelectedOrderId(order._id);
      setShowCancelDialog(true);
    }}
    disabled={cancelLoading === order._id}
    className={`rounded-lg py-2 text-white transition ${
      cancelLoading === order._id
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-red-600 hover:bg-red-700"
    }`}
  >
    {cancelLoading === order._id
      ? "Cancelling..."
      : "Cancel Order"}
  </button>
)}

              {order.orderStatus === "Delivered" && (
  <>
    {order.returnStatus ===
      "Not Requested" &&
      order.replaceStatus ===
        "Not Requested" && (
        <>
          <button
            onClick={() => {
              setSelectedReturnOrderId(
                order._id
              );

              setShowReturnDialog(true);
            }}
            className="border border-yellow-500 text-yellow-600 rounded-lg py-2 hover:bg-yellow-50"
          >
            Return Order
          </button>

          <button
            onClick={() => {
              setSelectedReplaceOrderId(
                order._id
              );

              setShowReplaceDialog(true);
            }}
            className="border border-blue-600 text-blue-600 rounded-lg py-2 hover:bg-blue-50"
          >
            Replace Order
          </button>
        </>
      )}

    {order.returnStatus ===
      "Requested" && (
      <p className="text-yellow-600 font-semibold">
        Return Requested
      </p>
    )}

    {order.replaceStatus ===
      "Requested" && (
      <p className="text-blue-600 font-semibold">
        Replacement Requested
      </p>
    )}
  </>
)}
            </div>
          </div>
        ))
      )}

<AlertDialog
  open={showCancelDialog}
  onOpenChange={setShowCancelDialog}
>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>
        Cancel Order?
      </AlertDialogTitle>

      <AlertDialogDescription>
        Are you sure you want to cancel this order?

        <br />
        <br />

        • This action cannot be undone.

        <br />

        • If this is a prepaid order, your refund will be initiated after verification.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel>
        Keep Order
      </AlertDialogCancel>

      <AlertDialogAction
        disabled={cancelLoading === selectedOrderId}
        className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
        onClick={async () => {
          await confirmCancelOrder(selectedOrderId);
        }}
      >
        {cancelLoading === selectedOrderId
          ? "Cancelling..."
          : "Yes, Cancel Order"}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>


{/* ================= RETURN ORDER POPUP ================= */}

<AlertDialog
  open={showReturnDialog}
  onOpenChange={setShowReturnDialog}
>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>
        Return this order?
      </AlertDialogTitle>

      <AlertDialogDescription>
        Are you sure you want to return this order?

        <br />
        <br />

        The refund will be processed after the item has been
        successfully picked up and verified by our team.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel disabled={returnLoading}>
        Keep Order
      </AlertDialogCancel>

      <AlertDialogAction
        disabled={returnLoading}
        className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50"
        onClick={(e) => {
          e.preventDefault();

          returnOrder(selectedReturnOrderId);
        }}
      >
        {returnLoading
          ? "Processing..."
          : "Yes, Return Order"}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>


{/* ================= REPLACE ORDER POPUP ================= */}

<AlertDialog
  open={showReplaceDialog}
  onOpenChange={setShowReplaceDialog}
>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>
        Replace this item?
      </AlertDialogTitle>

      <AlertDialogDescription>
        Are you sure you want to request a replacement for
        this item?

        <br />
        <br />

        Our team will review your replacement request and
        contact you regarding the pickup and replacement process.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel disabled={replaceLoading}>
        Keep Item
      </AlertDialogCancel>

      <AlertDialogAction
        disabled={replaceLoading}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        onClick={(e) => {
          e.preventDefault();

          replaceOrder(selectedReplaceOrderId);
        }}
      >
        {replaceLoading
          ? "Processing..."
          : "Yes, Replace Item"}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>


<ReviewDialog
  open={showReviewDialog}
  onOpenChange={setShowReviewDialog}
  product={selectedProduct}
  orderId={selectedOrder}
  editingReview={editingReview}
  onSuccess={() => {
    setEditingReview(null);
  }}
/>

{/* THIS IS YOUR MAIN PAGE CLOSING DIV */}
</div>

);
};

export default MyOrdersPage;