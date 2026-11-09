
const STORE_API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5001/api"
).replace(/\/+$/, "");

export async function sendCustomerMessage(message, history = []) {
  const response = await fetch(`${STORE_API_URL}/customer/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, history }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    throw new Error(
      data.response ||
        data.message ||
        "Unable to connect to the assistant."
    );
  }

  return data;
}

export async function fetchMyOrders() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to view your orders.");
  }

  const response = await fetch(`${STORE_API_URL}/orders/my-orders`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    throw new Error("Your session has expired. Please log in again.");
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to retrieve your orders.");
  }

  return Array.isArray(data.orders) ? data.orders : [];
}
