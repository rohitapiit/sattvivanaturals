import React, { useEffect, useMemo, useState } from "react";

const API =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AbandonedCartsPage = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const loadCarts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API}/abandoned-carts`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to load abandoned carts"
        );
      }

      setCarts(data?.carts || []);
    } catch (err) {
      console.error("Abandoned carts error:", err);
      setError(err.message || "Unable to load abandoned carts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCarts();
  }, []);

  const filteredCarts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return carts;

    return carts.filter((cart) => {
      const customer = cart.customer || {};

      const values = [
        customer.name,
        customer.email,
        customer.phone,
        ...(cart.items || []).map(
          (item) => item.product?.title
        ),
      ];

      return values.some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [carts, search]);

  const totalRevenue = carts.reduce(
    (sum, cart) => sum + Number(cart.totalAmount || 0),
    0
  );

  const totalItems = carts.reduce(
    (sum, cart) => sum + Number(cart.itemCount || 0),
    0
  );

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Abandoned Carts
            </h1>

            <p className="text-gray-500 mt-1">
              Customers who added products to their cart but did not
              complete their purchase.
            </p>
          </div>

          <button
            onClick={loadCarts}
            className="px-5 py-3 rounded-xl bg-black text-white hover:bg-gray-800"
          >
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          <div className="bg-white rounded-2xl border p-6">
            <p className="text-sm text-gray-500">
              Abandoned Carts
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {carts.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl border p-6">
            <p className="text-sm text-gray-500">
              Potential Revenue
            </p>

            <h2 className="text-3xl font-bold mt-2 text-green-600">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </h2>
          </div>

          <div className="bg-white rounded-2xl border p-6">
            <p className="text-sm text-gray-500">
              Products Left
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {totalItems}
            </h2>
          </div>

        </div>

        {/* Search */}
        <div className="bg-white border rounded-2xl p-4 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer, email, phone or product..."
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl border p-10 text-center">
            Loading abandoned carts...
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredCarts.length === 0 && (
          <div className="bg-white rounded-2xl border p-12 text-center">
            <h3 className="text-xl font-semibold">
              No abandoned carts found
            </h3>

            <p className="text-gray-500 mt-2">
              When logged-in customers leave products in their cart,
              they will appear here.
            </p>
          </div>
        )}

        {/* Cart list */}
        {!loading && filteredCarts.length > 0 && (
          <div className="space-y-5">

            {filteredCarts.map((cart) => {
              const customer = cart.customer || {};

              return (
                <div
                  key={cart._id}
                  className="bg-white border rounded-2xl overflow-hidden"
                >

                  {/* Customer */}
                  <div className="p-6 border-b">

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                      <div>
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center font-bold">
                            {(customer.name || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <h3 className="font-bold text-lg">
                              {customer.name ||
                                "Unknown Customer"}
                            </h3>

                            <span className="inline-block mt-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                              Abandoned
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 text-sm text-gray-600 space-y-1">
                          <p>
                            Email:{" "}
                            {customer.email || "Not available"}
                          </p>

                          <p>
                            Phone:{" "}
                            {customer.phone || "Not available"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">

                        <div>
                          <p className="text-xs text-gray-500">
                            Cart Value
                          </p>

                          <p className="text-xl font-bold text-green-600">
                            ₹
                            {Number(
                              cart.totalAmount || 0
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">
                            Items
                          </p>

                          <p className="text-xl font-bold">
                            {cart.itemCount || 0}
                          </p>
                        </div>

                      </div>

                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="px-6 py-4 bg-gray-50 border-b text-sm text-gray-600 grid md:grid-cols-3 gap-3">

                    <div>
                      <strong>First Added:</strong>{" "}
                      {formatDate(cart.firstAddedAt)}
                    </div>

                    <div>
                      <strong>Last Activity:</strong>{" "}
                      {formatDate(cart.lastActivityAt)}
                    </div>

                    <div>
                      <strong>Abandoned:</strong>{" "}
                      {formatDate(cart.abandonedAt)}
                    </div>

                  </div>

                  {/* Products */}
                  <div className="p-6">

                    <h4 className="font-semibold mb-4">
                      Products in Cart
                    </h4>

                    <div className="space-y-3">

                      {(cart.items || []).map((item) => {
                        const product = item.product || {};

                        return (
                          <div
                            key={item._id}
                            className="flex items-center gap-4 border rounded-xl p-4"
                          >

                            <img
                              src={
                                product.images?.[0] ||
                                "/images/logo.png"
                              }
                              alt={
                                product.title ||
                                "Product"
                              }
                              className="w-16 h-16 rounded-lg object-cover border"
                            />

                            <div className="flex-1">
                              <p className="font-semibold">
                                {product.title ||
                                  "Product unavailable"}
                              </p>

                              <p className="text-sm text-gray-500">
                                Quantity:{" "}
                                {item.quantity || 0}
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="font-semibold">
                                ₹
                                {Number(
                                  item.price || 0
                                ).toLocaleString("en-IN")}
                              </p>

                              <p className="text-sm text-gray-500">
                                Total: ₹
                                {(
                                  Number(
                                    item.price || 0
                                  ) *
                                  Number(
                                    item.quantity || 0
                                  )
                                ).toLocaleString("en-IN")}
                              </p>
                            </div>

                          </div>
                        );
                      })}

                    </div>
                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
};

export default AbandonedCartsPage;