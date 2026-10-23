import React, { useCallback, useEffect, useMemo, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const AdminProductOrderPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/products`);
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Could not load products");
      setProducts((data.products || []).map((product) => ({
        ...product,
        displayOrder: Number.isFinite(Number(product.displayOrder)) ? Number(product.displayOrder) : 9999,
      })));
    } catch (error) {
      setMessage(error.message || "Could not load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const visibleProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return [...products]
      .filter((product) => !term || `${product.title} ${product.category} ${product.subcategory || ""}`.toLowerCase().includes(term))
      .sort((a, b) => Number(a.displayOrder) - Number(b.displayOrder) || String(a.title).localeCompare(String(b.title)));
  }, [products, search]);

  const changeOrder = (id, value) => {
    const parsed = value === "" ? "" : Math.max(1, Math.floor(Number(value) || 1));
    setProducts((current) => current.map((product) => product._id === id ? { ...product, displayOrder: parsed } : product));
  };

  const saveOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Your session has expired. Please log in again.");
      window.location.href = "/login";
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      // Persist only changed ordering values; all required product fields are included for the existing update API.
      for (const product of products) {
        const payload = {
          title: product.title,
          description: product.description || "",
          category: product.category,
          subcategory: product.subcategory,
          price: product.price,
          cutPrice: product.cutPrice ?? null,
          stock: product.stock ?? 0,
          variants: product.variants || [],
          images: product.images || [],
          uses: product.uses || [],
          keyBenefits: product.keyBenefits || [],
          ingredients: product.ingredients || "",
          nutritionalInformation: product.nutritionalInformation || "",
          labReports: product.labReports || [],
          isActive: product.isActive !== false,
          displayOrder: Math.max(1, Number(product.displayOrder) || 9999),
        };
        const response = await fetch(`${API}/products/${product._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.success) throw new Error(data.message || `Failed to save ${product.title}`);
      }
      setMessage("Product order saved. The storefront will now follow these numbers.");
      await fetchProducts();
    } catch (error) {
      setMessage(`Could not save all product positions: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Storefront settings</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">Product Order Maintenance</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">Enter a number for each product. Number 1 appears first, number 2 appears second, and so on across product listings and homepage product sections.</p>
        </div>
        <button type="button" onClick={saveOrder} disabled={saving || loading || products.length === 0} className="rounded-lg bg-emerald-800 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50">
          {saving ? "Saving order…" : "Save product order"}
        </button>
      </div>

      <label className="mb-4 block">
        <span className="mb-1 block text-sm font-semibold text-gray-700">Find product</span>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by product name or category" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100" />
      </label>

      {message && <p role="status" className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">{message}</p>}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="grid grid-cols-[minmax(0,1fr)_105px] gap-3 border-b bg-gray-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500 sm:grid-cols-[minmax(0,1fr)_150px]">
          <span>Product</span><span>Position</span>
        </div>
        {loading ? <p className="p-6 text-sm text-gray-500">Loading products…</p> : visibleProducts.length === 0 ? <p className="p-6 text-sm text-gray-500">No products found.</p> : visibleProducts.map((product) => (
          <div key={product._id} className="grid grid-cols-[minmax(0,1fr)_105px] items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_150px]">
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border bg-white">
                <img src={product.images?.[0] || "/images/logo.png"} alt={product.title} className="h-full w-full object-contain p-1" />
              </div>
              <div className="min-w-0"><p className="truncate text-sm font-semibold text-gray-900">{product.title}</p><p className="mt-0.5 text-xs text-gray-500">{product.category}{product.subcategory ? ` · ${product.subcategory}` : ""}</p></div>
            </div>
            <label className="block"><span className="sr-only">Display order for {product.title}</span><input type="number" min="1" step="1" value={product.displayOrder} onChange={(event) => changeOrder(product._id, event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-center font-semibold text-gray-900 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-100" /></label>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-gray-500">Tip: give each product a unique number for predictable ordering. Existing products without an order are assigned 9999.</p>
    </main>
  );
};

export default AdminProductOrderPage;
