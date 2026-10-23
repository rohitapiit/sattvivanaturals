import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const API = import.meta.env.VITE_API_URL;

const getAuthHeaders = (extra = {}) => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
    ...extra,
  };
};

const ReviewEmailPage = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingReview, setSendingReview] = useState(null);

  // =========================
  // FETCH ALL ORDERS
  // =========================

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API}/orders`, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load orders."
        );
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error("FETCH REVIEW ORDERS ERROR:", error);

      toast.error(
        error.message || "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================
  // SEND REVIEW LINK
  // =========================

  const sendReviewLink = async (orderId) => {
    try {
      setSendingReview(orderId);

      const response = await fetch(
        `${API}/orders/${orderId}/send-review`,
        {
          method: "POST",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to send review link."
        );
      }

      toast.success(
        "Review link sent successfully."
      );

      // Refresh orders so reviewEmailSentAt
      // is reflected immediately
      await fetchOrders();

    } catch (error) {
      console.error(
        "SEND REVIEW LINK ERROR:",
        error
      );

      toast.error(
        error.message ||
          "Failed to send review link."
      );
    } finally {
      setSendingReview(null);
    }
  };

  // =========================
  // SEARCH
  // =========================

  const filteredOrders = orders.filter((order) => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return true;
    }

    const customerName =
      order.shippingAddress?.fullName ||
      order.user?.name ||
      "";

    const customerEmail =
      order.shippingAddress?.email ||
      order.user?.email ||
      "";

    const orderId =
      order.orderId || "";

    return (
      customerName
        .toLowerCase()
        .includes(query) ||
      customerEmail
        .toLowerCase()
        .includes(query) ||
      orderId
        .toLowerCase()
        .includes(query)
    );
  });

  // =========================
  // COUNTS
  // =========================

  const deliveredOrders = orders.filter(
    (order) =>
      order.orderStatus === "Delivered"
  );

  const pendingReviewEmails =
    deliveredOrders.filter(
      (order) =>
        !order.reviewEmailSentAt
    );

  const sentReviewEmails =
    deliveredOrders.filter(
      (order) =>
        order.reviewEmailSentAt
    );

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-700 mx-auto"></div>

          <p className="mt-4 text-gray-600">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">

      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Review Email Management
            </h1>

            <p className="text-gray-500 mt-1">
              Send review links to customers after
              their orders are delivered.
            </p>
          </div>

          <button
            onClick={fetchOrders}
            disabled={loading}
            className="bg-gray-800 text-white px-5 py-2.5 rounded-lg hover:bg-gray-900 transition disabled:opacity-50"
          >
            ↻ Refresh
          </button>

        </div>

        {/* ================= STATS ================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          {/* Total Orders */}

          <div className="bg-white border rounded-xl shadow-sm p-5">

            <p className="text-gray-500 text-sm">
              Total Orders
            </p>

            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              {orders.length}
            </h2>

          </div>

          {/* Delivered */}

          <div className="bg-white border rounded-xl shadow-sm p-5">

            <p className="text-gray-500 text-sm">
              Delivered Orders
            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {deliveredOrders.length}
            </h2>

          </div>

          {/* Pending */}

          <div className="bg-white border rounded-xl shadow-sm p-5">

            <p className="text-gray-500 text-sm">
              Review Pending
            </p>

            <h2 className="text-3xl font-bold text-orange-600 mt-2">
              {pendingReviewEmails.length}
            </h2>

          </div>

          {/* Sent */}

          <div className="bg-white border rounded-xl shadow-sm p-5">

            <p className="text-gray-500 text-sm">
              Review Links Sent
            </p>

            <h2 className="text-3xl font-bold text-purple-600 mt-2">
              {sentReviewEmails.length}
            </h2>

          </div>

        </div>

        {/* ================= SEARCH ================= */}

        <div className="bg-white border rounded-xl shadow-sm p-5 mb-8">

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Orders
          </label>

          <input
            type="text"
            placeholder="Search by customer name, email or order ID..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
          />

        </div>

        {/* ================= NO ORDERS ================= */}

        {filteredOrders.length === 0 ? (

          <div className="bg-white border rounded-xl shadow-sm p-10 text-center">

            <div className="text-5xl mb-4">
              📦
            </div>

            <h2 className="text-xl font-semibold text-gray-700">
              No orders found
            </h2>

            <p className="text-gray-500 mt-2">
              {search
                ? "No orders match your search."
                : "There are currently no orders."
              }
            </p>

          </div>

        ) : (

          /* ================= ORDERS ================= */

          <div className="space-y-5">

            {filteredOrders.map((order) => {

              const customerName =
                order.shippingAddress?.fullName ||
                order.user?.name ||
                "Customer";

              const customerEmail =
                order.shippingAddress?.email ||
                order.user?.email ||
                "No email";

              const isDelivered =
                order.orderStatus ===
                "Delivered";

              const reviewSent =
                Boolean(
                  order.reviewEmailSentAt
                );

              const isSending =
                sendingReview ===
                order._id;

              return (

                <div
                  key={order._id}
                  className="bg-white border rounded-xl shadow-sm p-6"
                >

                  {/* ================= TOP ================= */}

                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                    <div className="flex-1">

                      {/* Order ID */}

                      <div className="mb-3">

                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Order ID
                        </p>

                        <h2 className="font-bold text-lg text-gray-800">
                          {order.orderId}
                        </h2>

                      </div>

                      {/* Customer */}

                      <div className="grid sm:grid-cols-2 gap-3">

                        <div>

                          <p className="text-xs text-gray-500">
                            Customer
                          </p>

                          <p className="font-medium text-gray-800">
                            {customerName}
                          </p>

                        </div>

                        <div>

                          <p className="text-xs text-gray-500">
                            Email
                          </p>

                          <p className="font-medium text-gray-800 break-all">
                            {customerEmail}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* ================= STATUS ================= */}

                    <div className="flex flex-col items-start lg:items-end gap-3">

                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          isDelivered
                            ? "bg-green-100 text-green-700"
                            : order.orderStatus ===
                              "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.orderStatus}
                      </span>

                      {/* REVIEW ACTION */}

                      {isDelivered && !reviewSent && (

                        <button
                          onClick={() =>
                            sendReviewLink(
                              order._id
                            )
                          }
                          disabled={isSending}
                          className="bg-green-700 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {isSending
                            ? "Sending..."
                            : "Send Review Link"}
                        </button>

                      )}

                      {isDelivered && reviewSent && (

                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 rounded-lg font-semibold">
                          ✓ Review Link Sent
                        </div>

                      )}

                      {!isDelivered && (

                        <div className="text-sm text-gray-400">
                          Review link available after delivery
                        </div>

                      )}

                    </div>

                  </div>

                  {/* ================= DETAILS ================= */}

                  <div className="border-t mt-5 pt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                    <div>

                      <p className="text-xs text-gray-500">
                        Order Date
                      </p>

                      <p className="font-medium">
                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleDateString()
                          : "—"}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-gray-500">
                        Total Amount
                      </p>

                      <p className="font-medium text-green-700">
                        ₹{order.totalAmount}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-gray-500">
                        Payment Method
                      </p>

                      <p className="font-medium">
                        {order.paymentMethod ||
                          "—"}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-gray-500">
                        Review Email
                      </p>

                      {reviewSent ? (

                        <p className="font-medium text-green-600">
                          Sent on{" "}
                          {new Date(
                            order.reviewEmailSentAt
                          ).toLocaleDateString()}
                        </p>

                      ) : (

                        <p className="font-medium text-orange-600">
                          Not Sent
                        </p>

                      )}

                    </div>

                  </div>

                  {/* ================= PRODUCTS ================= */}

                  {order.items?.length > 0 && (

                    <div className="border-t mt-5 pt-5">

                      <p className="font-semibold text-gray-700 mb-3">
                        Products
                      </p>

                      <div className="space-y-2">

                        {order.items.map(
                          (item) => (

                            <div
                              key={item._id}
                              className="flex items-center gap-3 bg-gray-50 rounded-lg p-3"
                            >

                              <img
                                src={
                                  item.product
                                    ?.images?.[0] ||
                                  "/no-image.png"
                                }
                                alt={
                                  item.product
                                    ?.title ||
                                  "Product"
                                }
                                className="w-12 h-12 rounded-lg object-cover border"
                              />

                              <div className="flex-1">

                                <p className="font-medium text-gray-800">
                                  {item.product
                                    ?.title ||
                                    item.product
                                      ?.name ||
                                    "Product"}
                                </p>

                                <p className="text-sm text-gray-500">
                                  Qty:{" "}
                                  {item.quantity}
                                  {" × "}
                                  ₹{item.price}
                                </p>

                              </div>

                            </div>

                          )
                        )}

                      </div>

                    </div>

                  )}

                </div>

              );

            })}

          </div>

        )}

      </div>

    </div>
  );
};

export default ReviewEmailPage;