import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

const API = import.meta.env.VITE_API_URL;

const ORDER_STATUS_OPTIONS = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const STATUS_BADGE_CLASSES = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-indigo-100 text-indigo-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
  "Return Requested": "bg-orange-100 text-orange-700",
  "Replacement Requested": "bg-purple-100 text-purple-700",
};

const getAuthHeaders = (extra = {}) => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    ...extra,
  };
};

const StatCard = ({ label, value, colorClass }) => (
  <div className="bg-white shadow rounded-xl p-6 border">
    <p className="text-gray-500">{label}</p>
    <h2 className={`text-3xl font-bold ${colorClass}`}>{value}</h2>
  </div>
);

const TrackingEditor = ({ orderId, value, onChange, onSave }) => (
  <div className="flex items-center gap-2 mt-3">
    <input
      type="text"
      placeholder="Tracking Number"
      value={value || ""}
      onChange={(e) => onChange(orderId, e.target.value)}
      className="border rounded px-3 py-2"
    />
    <button
      onClick={() => onSave(orderId)}
      className="bg-blue-600 text-white px-3 py-2 rounded"
    >
      Save
    </button>
  </div>
);

const OrderItemRow = ({ item }) => (
  <div className="flex items-center gap-3 border-b py-3 last:border-b-0">
    <img
      src={item.product?.images?.[0] || "/no-image.png"}
      alt={item.product?.title || "Product"}
      className="w-14 h-14 rounded object-cover"
    />
    <div className="flex-1">
      <p className="font-medium">{item.product?.title}</p>
      <p>₹{item.price}</p>
    </div>
    <p>Qty: {item.quantity}</p>
  </div>
);

const AdminOrdersPage = () => {
  const [stats, setStats] = useState({ totalOrders: 0, revenue: 0 });
  const [orders, setOrders] = useState([]);
  const [trackingInputs, setTrackingInputs] = useState({});
  const [editingTrackingFor, setEditingTrackingFor] = useState({});
  const [products, setProducts] = useState([]);
  const [showInventoryNotifications, setShowInventoryNotifications] = useState(false);
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API}/orders`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
        setStats({
          totalOrders: data.orders.length,
          revenue: data.orders.reduce(
            (sum, order) => sum + order.totalAmount,
            0
          ),
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders");
    }
  };

  const fetchProducts = async () => {
  try {
    const response = await fetch(`${API}/products`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (data.success) {
      setProducts(data.products);
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to load products");
  }
};

useEffect(() => {
  fetchOrders();
  fetchProducts();
}, []);

  

  const updateStatus = async (orderId, status) => {
    try {
      const response = await fetch(`${API}/orders/${orderId}/status`, {
        method: "PUT",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ status }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success("Order status updated");
        fetchOrders();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order status");
    }
  };

  const updateTracking = async (orderId) => {
    const trackingNumber = trackingInputs[orderId];
    if (!trackingNumber?.trim()) {
      toast.error("Please enter a tracking number");
      return;
    }

    try {
      const response = await fetch(`${API}/orders/${orderId}/tracking`, {
        method: "PUT",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ trackingNumber }),
      });
      const data = await response.json();

      if (data.success) {
        setTrackingInputs((prev) => ({ ...prev, [orderId]: undefined }));
        setEditingTrackingFor((prev) => ({ ...prev, [orderId]: false }));
        toast.success("Tracking number saved");
        fetchOrders();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save tracking number");
    }
  };

  const handleTrackingChange = (orderId, value) => {
    setTrackingInputs((prev) => ({ ...prev, [orderId]: value }));
  };

  const filteredOrders = orders.filter((order) => {
    const q = search.toLowerCase();
    return (
      (order.user?.name ||
        order.shippingAddress?.fullName ||
        "")
        .toLowerCase()
        .includes(q) ||
      order.orderId.toLowerCase().includes(q)
    );
  });

  const deliveredCount = orders.filter(
    (o) => o.orderStatus === "Delivered"
  ).length;
  const cancelledCount = orders.filter(
    (o) => o.orderStatus === "Cancelled"
  ).length;
  const inventoryNotifications = products.filter(
  (product) => product.stock <= 5
);
  
  const getDisplayStatus = (order) => {
    if (order.returnStatus === "Requested") {
      return "Return Requested";
    }
  
    if (order.replaceStatus === "Requested") {
      return "Replacement Requested";
    }
  
    return order.orderStatus;
  };
  
  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Orders Dashboard</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Customer Name or Order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      <div className="grid md:grid-cols-4 gap-5 mb-8">
        <StatCard
          label="Total Orders"
          value={stats.totalOrders}
          colorClass="text-blue-600"
        />
        <StatCard
          label="Revenue"
          value={`₹${stats.revenue}`}
          colorClass="text-green-600"
        />
        <StatCard
          label="Delivered Orders"
          value={deliveredCount}
          colorClass="text-purple-600"
        />
        <StatCard
          label="Cancelled Orders"
          value={cancelledCount}
          colorClass="text-red-600"
        />
      </div>
     <div className="bg-white border border-red-200 rounded-xl shadow-sm mb-8">

  <button
    onClick={() =>
      setShowInventoryNotifications(!showInventoryNotifications)
    }
    className="w-full flex justify-between items-center p-5"
  >
    <h2 className="text-lg font-bold">
      🔔 Inventory Notifications ({inventoryNotifications.length})
    </h2>

    <span className="text-2xl">
      {showInventoryNotifications ? "▲" : "▼"}
    </span>
  </button>

  {showInventoryNotifications && (
    <div className="px-5 pb-5 space-y-3">
      {inventoryNotifications.map((product) => (
        <div
          key={product._id}
          className={`p-4 rounded-lg border ${
            product.stock === 0
              ? "bg-red-50 border-red-200"
              : "bg-orange-50 border-orange-200"
          }`}
        >
          <p className="font-semibold">
            {product.title}
          </p>

          {product.stock === 0 ? (
            <p className="text-red-600 text-sm">
              🔴 Out of Stock
            </p>
          ) : (
            <p className="text-orange-600 text-sm">
              🟠 Only {product.stock} left
            </p>
          )}
        </div>
      ))}
    </div>
  )}

</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow-lg rounded-xl p-6 mb-6 border"
          >
            <div>
              <p className="text-xs text-gray-500">Order ID</p>
              <h3 className="font-semibold text-sm break-all">
                {order.orderId}
              </h3>
            </div>

            <p>
  Customer:{" "}
  {order.user?.name || order.shippingAddress?.fullName}
</p>
<p>
  Email:{" "}
  {order.user?.email || order.shippingAddress?.email}
</p>

            <p>
              Order Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>

            <div className="mt-3 p-4 bg-green-50 border border-green-100 rounded-lg">
              <h4 className="font-semibold mb-2">Shipping Address</h4>
              <p>
                <strong>Payment:</strong>{" "}
                <span className="text-green-600 font-semibold">
                  {order.paymentStatus}
                </span>
              </p>
              <p>
                <strong>Name:</strong> {order.shippingAddress?.fullName}
              </p>
              <p>
                <strong>Phone:</strong> {order.shippingAddress?.phone}
              </p>
              <p>
                <strong>Address:</strong> {order.shippingAddress?.address}
              </p>
              <p>
                <strong>City:</strong> {order.shippingAddress?.city}
              </p>
              <p>
                <strong>State:</strong> {order.shippingAddress?.state}
              </p>
              <p>
                <strong>Pincode:</strong> {order.shippingAddress?.pincode}
              </p>
            </div>

            <p className="text-lg font-bold text-green-600 mt-3">
              Total: ₹{order.totalAmount}
            </p>

            <div className="mt-2">
            <p
  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
    STATUS_BADGE_CLASSES[getDisplayStatus(order)] ||
    "bg-gray-100 text-gray-700"
  }`}
>
  {getDisplayStatus(order)}
</p>

{order.returnStatus !== "Not Requested" && (
  <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
    <p className="font-semibold text-orange-700">
      Return Request
    </p>

    <p className="text-sm mt-1">
      Status: {order.returnStatus}
    </p>

    {order.shiprocketReturnOrderId && (
      <p className="text-sm">
        Shiprocket Return Order ID:{" "}
        {order.shiprocketReturnOrderId}
      </p>
    )}

    {order.shiprocketReturnShipmentId && (
      <p className="text-sm">
        Return Shipment ID:{" "}
        {order.shiprocketReturnShipmentId}
      </p>
    )}
  </div>
)}

{order.replaceStatus !== "Not Requested" && (
  <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
    <p className="font-semibold text-purple-700">
      Replacement Request
    </p>

    <p className="text-sm mt-1">
      Status: {order.replaceStatus}
    </p>

    {order.shiprocketReturnOrderId && (
      <p className="text-sm">
        Shiprocket Return Order ID:{" "}
        {order.shiprocketReturnOrderId}
      </p>
    )}

    {order.shiprocketReturnShipmentId && (
      <p className="text-sm">
        Return Shipment ID:{" "}
        {order.shiprocketReturnShipmentId}
      </p>
    )}
  </div>
)}

              <label className="block mt-2">Status:</label>

              {order.trackingNumber && !editingTrackingFor[order._id] ? (
                <div className="mt-3">
                  <p className="text-blue-600 font-medium mb-2">
                    Current Tracking: {order.trackingNumber}
                  </p>
                  <button
                    onClick={() => {
                      setEditingTrackingFor((prev) => ({
                        ...prev,
                        [order._id]: true,
                      }));
                      handleTrackingChange(order._id, order.trackingNumber);
                    }}
                    className="bg-orange-500 text-white px-3 py-2 rounded"
                  >
                    Update Tracking
                  </button>
                </div>
              ) : null}

              {(!order.trackingNumber || editingTrackingFor[order._id]) && (
                <TrackingEditor
                  orderId={order._id}
                  value={trackingInputs[order._id]}
                  onChange={handleTrackingChange}
                  onSave={updateTracking}
                />
              )}

              <select
                value={order.orderStatus}
                onChange={(e) => updateStatus(order._id, e.target.value)}
                className="border rounded-lg px-3 py-2 mt-2"
              >
                {ORDER_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <h4 className="font-semibold mt-4 mb-2">Ordered Products</h4>
            <div className="mt-3">
              {order.items.map((item) => (
                <OrderItemRow key={item._id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrdersPage;