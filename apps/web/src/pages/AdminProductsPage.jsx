import React, { useEffect, useState } from "react";
const API = import.meta.env.VITE_API_URL || "http://localhost:5001/api";




const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
  title: "",
  description: "",
  category: "",
  subcategory: "",
  price: "",
  cutPrice: "",
  stock: "",
  variants: [
  {
    size: "",
    price: "",
    cutPrice: "",
    stock: "",
  },
],

  images: [],
  uses: [],
  keyBenefits: [],
  ingredients: "",
  nutritionalInformation: "",
});

const categories = {
  Oils: [
    "Cold Press Oil",
    "Wood Press Oil"
  ],

  "Dry Fruits": [
    "Almond",
    "Cashew",
    "Walnut",
    "Raisin"
  ],

  Spices: [
    "Turmeric",
    "Red Chilli",
    "Coriander",
    "Jeera"
  ],

  "Health Punch": [
    "Peanut Butter"
  ],


};

const handleCategoryChange = (e) => {
  setFormData((prev) => ({
    ...prev,
    category: e.target.value,
    subcategory: "",
  }));
};
const [uploading, setUploading] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${API}/products`,
      );

      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const emptyForm = () => ({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    cutPrice: "",
    stock: "",
    variants: [
      {
        size: "",
        price: "",
        cutPrice: "",
        stock: "",
      },
    ],
    images: [],
    uses: [],
    keyBenefits: [],
    ingredients: "",
    nutritionalInformation: "",
  });

  const saveProduct = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter a product title.");
      return;
    }

    if (!formData.category) {
      alert("Please select a category.");
      return;
    }

    if (!formData.subcategory) {
      alert("Please select a subcategory.");
      return;
    }

    const wasEditing = Boolean(editingId);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Your session has expired. Please login again.");
        window.location.href = "/login";
        return;
      }

      const url = wasEditing
        ? `${API}/products/${editingId}`
        : `${API}/products`;

      const method = wasEditing ? "PUT" : "POST";

      const variants = (formData.variants || [])
        .filter(
          (item) =>
            item.size &&
            item.price !== "" &&
            item.stock !== ""
        )
        .map((item) => ({
          ...item,
          price: Number(item.price),
          cutPrice:
            item.cutPrice === "" || item.cutPrice === null || item.cutPrice === undefined
              ? null
              : Number(item.cutPrice),
          stock: Number(item.stock),
        }));

      const productData = {
        ...formData,
        variants,
      };

      if (variants.length > 0) {
        productData.price = variants[0].price;
        productData.cutPrice = variants[0].cutPrice;
        productData.stock = variants.reduce(
          (total, variant) => total + variant.stock,
          0
        );
      } else {
        productData.price = Number(formData.price || 0);
        productData.cutPrice =
          formData.cutPrice === "" || formData.cutPrice === null
            ? null
            : Number(formData.cutPrice);
        productData.stock = Number(formData.stock || 0);
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        localStorage.removeItem("token");
        alert("Your session has expired. Please login again.");
        window.location.href = "/login";
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || `Product save failed (${response.status})`
        );
      }

      await fetchProducts();
      setEditingId(null);
      setFormData(emptyForm());

      alert(
        wasEditing
          ? "Product Updated Successfully"
          : "Product Added Successfully"
      );
    } catch (error) {
      console.error("PRODUCT SAVE ERROR:", error);
      alert(error.message || "Failed to save product.");
    }
  };

  const startEditingProduct = (product) => {
    setEditingId(product._id);

    setFormData({
      title: product.title || "",
      description: product.description || "",
      category: product.category || "",
      subcategory: product.subcategory || "",
      price: product.price ?? "",
      cutPrice: product.cutPrice ?? "",
      stock: product.stock ?? "",
      variants:
        Array.isArray(product.variants) && product.variants.length > 0
          ? product.variants.map((variant) => ({
              size: variant.size || "",
              price: variant.price ?? "",
              cutPrice: variant.cutPrice ?? "",
              stock: variant.stock ?? "",
              ...(variant.sku ? { sku: variant.sku } : {}),
            }))
          : [
              {
                size: "",
                price: product.price ?? "",
                cutPrice: product.cutPrice ?? "",
                stock: product.stock ?? "",
              },
            ],
      images: Array.isArray(product.images) ? product.images : [],
      uses: Array.isArray(product.uses)
        ? product.uses.map((use) => ({
            image: use?.image || "",
            title: use?.title || "",
            description: use?.description || "",
          }))
        : [],
      keyBenefits: Array.isArray(product.keyBenefits)
        ? product.keyBenefits
        : [],
      ingredients: product.ingredients || "",
      nutritionalInformation: product.nutritionalInformation || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormData(emptyForm());
  };


  useEffect(() => {
    fetchProducts();
  }, []);

  
  const deleteProduct = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API}/products/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      fetchProducts();
    }
  } catch (error) {
    console.error(error);
  }
};

const uploadImages = async (files) => {
  if (!files || files.length === 0) return;

  try {
    setUploading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Your session has expired. Please login again.");
      window.location.href = "/login";
      return;
    }

    const uploadedImages = [];

    for (const file of Array.from(files)) {
      const imageData = new FormData();
      imageData.append("image", file);

      const response = await fetch(`${API}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: imageData,
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        localStorage.removeItem("token");
        alert("Your session has expired. Please login again.");
        window.location.href = "/login";
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || `Image upload failed (${response.status})`
        );
      }

      if (data.imageUrl) {
        uploadedImages.push(data.imageUrl);
      }
    }

    if (uploadedImages.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));
    }
  } catch (error) {
    console.error("PRODUCT IMAGE UPLOAD ERROR:", error);
    alert(error.message || "Failed to upload product image.");
  } finally {
    setUploading(false);
  }
};

const uploadUseImage = async (file, index) => {
  if (!file) return;

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Your session has expired. Please login again.");
      window.location.href = "/login";
      return;
    }

    const imageData = new FormData();
    imageData.append("image", file);

    const response = await fetch(`${API}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: imageData,
    });

    const data = await response.json().catch(() => ({}));

    if (response.status === 401) {
      localStorage.removeItem("token");
      alert("Your session has expired. Please login again.");
      window.location.href = "/login";
      return;
    }

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || `Image upload failed (${response.status})`
      );
    }

    if (data.imageUrl) {
      setFormData((prev) => {
        const updatedUses = [...(prev.uses || [])];

        updatedUses[index] = {
          ...updatedUses[index],
          image: data.imageUrl,
        };

        return {
          ...prev,
          uses: updatedUses,
        };
      });
    }
  } catch (error) {
    console.error("USE IMAGE UPLOAD ERROR:", error);
    alert(error.message || "Failed to upload image.");
  }
};

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">
        Admin Products Dashboard
      </h1>

      <form
  onSubmit={saveProduct}
  className="border rounded-lg p-4 mb-6 space-y-3"
>
  <input
    placeholder="Title"
    value={formData.title}
    onChange={(e) =>
      setFormData({
        ...formData,
        title: e.target.value,
      })
    }
    className="border p-2 w-full"
  />

  <input
    placeholder="Description"
    value={formData.description}
    onChange={(e) =>
      setFormData({
        ...formData,
        description: e.target.value,
      })
    }
    className="border p-2 w-full"
  />

  <select
  name="category"
  value={formData.category}
  onChange={handleCategoryChange}
  className="border p-2 w-full"
>
  <option value="">Select Category</option>

  {Object.keys(categories).map((cat) => (
    <option key={cat} value={cat}>
      {cat}
    </option>
  ))}
</select>


<select
  value={formData.subcategory}
  disabled={!formData.category}
  onChange={(e) =>
    setFormData({
      ...formData,
      subcategory: e.target.value,
    })
  }
  className="border p-2 w-full"
>
  <option value="">
    {formData.category
      ? "Select Subcategory"
      : "Select Category First"}
  </option>

  {formData.category &&
    categories[formData.category].map((sub) => (
      <option key={sub} value={sub}>
        {sub}
      </option>
    ))}
</select>

<h3 className="text-lg font-semibold mt-6 mb-3">
  Available Sizes
</h3>

{formData.variants.map((variant, index) => (
  <div
    key={index}
    className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-3"
  >
    <select
      value={variant.size}
      onChange={(e) => {
        const updated = [...formData.variants];
        updated[index].size = e.target.value;
        setFormData({
          ...formData,
          variants: updated,
        });
      }}
      className="border p-2 rounded"
    >
      <option value="">Select Size</option>

      <option>250 g</option>
      <option>500 g</option>
      <option>1 kg</option>
      <option>2 kg</option>

      <option>250 ml</option>
      <option>500 ml</option>
      <option>1 L</option>
      <option>2 L</option>
      <option>5 L</option>
    </select>

    <input
      type="number"
      placeholder="Original Price"
      value={variant.price}
      onChange={(e) => {
        const updated = [...formData.variants];
        updated[index].price = e.target.value;
        setFormData({
          ...formData,
          variants: updated,
        });
      }}
      className="border p-2 rounded"
    />

    <input
      type="number"
      min="0"
      step="0.01"
      placeholder="Cut Price"
      value={variant.cutPrice ?? ""}
      onChange={(e) => {
        const updated = [...formData.variants];
        updated[index].cutPrice = e.target.value;
        setFormData({
          ...formData,
          variants: updated,
        });
      }}
      className="border p-2 rounded"
    />

    <input
      type="number"
      placeholder="Stock"
      value={variant.stock}
      onChange={(e) => {
        const updated = [...formData.variants];
        updated[index].stock = e.target.value;
        setFormData({
          ...formData,
          variants: updated,
        });
      }}
      className="border p-2 rounded"
    />

    <button
      type="button"
      onClick={() => {
        const updated =
          formData.variants.filter(
            (_, i) => i !== index
          );

        setFormData({
          ...formData,
          variants:
            updated.length
              ? updated
              : [
                  {
                    size: "",
                    price: "",
                    cutPrice: "",
                    stock: "",
                  },
                ],
        });
      }}
      className="bg-red-500 text-white rounded px-3"
    >
      ✕
    </button>
  </div>
))}

<button
  type="button"
  onClick={() =>
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        {
          size: "",
          price: "",
          cutPrice: "",
          stock: "",
        },
      ],
    })
  }
  className="bg-green-600 text-white px-4 py-2 rounded"
>
  + Add Size
</button>

  {/* <input
    placeholder="Price"
    type="number"
    value={formData.price}
    onChange={(e) =>
      setFormData({
        ...formData,
        price: e.target.value,
      })
    }
    className="border p-2 w-full"
  />

  <input
    placeholder="Stock"
    type="number"
    value={formData.stock}
    onChange={(e) =>
      setFormData({
        ...formData,
        stock: e.target.value,
      })
    }
    className="border p-2 w-full"
  />

  <input
    placeholder="SKU"
    value={formData.sku}
    onChange={(e) =>
      setFormData({
        ...formData,
        sku: e.target.value,
      })
    }
    className="border p-2 w-full"
  /> */}

  <textarea
  placeholder="Ingredients"
  value={formData.ingredients}
  onChange={(e) =>
    setFormData({
      ...formData,
      ingredients: e.target.value,
    })
  }
  className="border p-2 w-full"
/>

<textarea
  placeholder="Nutritional Information"
  value={formData.nutritionalInformation}
  onChange={(e) =>
    setFormData({
      ...formData,
      nutritionalInformation:
        e.target.value,
    })
  }
  className="border p-2 w-full"
/>

<textarea
  placeholder="Key Benefits (one per line)"
  value={formData.keyBenefits.join("\n")}
  onChange={(e) =>
    setFormData({
      ...formData,
      keyBenefits:
        e.target.value
          .split("\n")
          .filter(item => item.trim() !== ""),
    })
  }
  className="border p-2 w-full h-32"
/>

 <input
  type="file"
  multiple
  accept="image/*"
  onChange={(e) =>
    uploadImages(e.target.files)
  }
/>
{uploading && (
  <p>Uploading image...</p>
)}

{
formData.images?.length > 0&& (

<div className="flex gap-3 flex-wrap mt-4">

  {formData.images?.map(
    (image, index) => (

      <img
        key={index}
        src={image}
        alt=""
        className="w-28 h-28 object-cover rounded-lg"
      />

    )
  )}

</div>

)
}
<button
  type="button"
  onClick={() =>
    setFormData(prev => ({
      ...prev,
      uses: [
        ...prev.uses,
        {
          image: "",
          title: "",
          description: "",
        },
      ],
    }))
  }
  className="bg-purple-600 text-white px-4 py-2 rounded mr-5"
>
  Add Use
</button>
{formData.uses?.map((use, index) => (
  <div
    key={index}
    className="border p-4 rounded-lg mt-4 space-y-3"
  >
   <input
  placeholder="Use Title"
  value={use.title || ""}
  onChange={(e) => {
    setFormData(prev => {

      const updatedUses = [...prev.uses];

      updatedUses[index] = {
        ...updatedUses[index],
        title: e.target.value,
      };

      return {
        ...prev,
        uses: updatedUses,
      };

    });
  }}
  className="border p-2 w-full"
/>
    <input
  placeholder="Use Description"
  value={use.description || ""}
  onChange={(e) => {
    setFormData(prev => {

      const updatedUses = [...prev.uses];

      updatedUses[index] = {
        ...updatedUses[index],
        description: e.target.value,
      };

      return {
        ...prev,
        uses: updatedUses,
      };

    });
  }}
  className="border p-2 w-full"
/>
    <input
  type="file"
  accept="image/*"
  onChange={(e) =>
    uploadUseImage(
      e.target.files[0],
      index
    )
  }
/>
{
use.image && (

<img
  src={use.image}
  alt=""
  className="w-32 h-32 object-cover rounded-lg"
/>

)
}
  </div>
))}
  <button
    type="submit"
    disabled={uploading}
    className="bg-green-600 disabled:opacity-50 text-white px-4 py-2 rounded"
  >
    {editingId ? "Update Product" : "Add Product"}
  </button>

  {editingId && (
    <button
      type="button"
      onClick={cancelEditing}
      className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
    >
      Cancel Edit
    </button>
  )}
</form>

      <div className="space-y-4">
        {products.map(product => (
          <div
            key={product._id}
            className="border rounded-lg p-4"
          >
            <h3 className="font-bold">
              {product.title}
            </h3>

            <p>
  Price:
  ₹
  {product.variants?.length
    ? product.variants[0].price
    : product.price}
  {(product.variants?.length
    ? product.variants[0].cutPrice
    : product.cutPrice) ? (
      <>
        {" "}
        <span className="line-through text-gray-400">
          ₹{product.variants?.length
            ? product.variants[0].cutPrice
            : product.cutPrice}
        </span>
      </>
    ) : null}
</p>

            <p>
  Stock:
  {product.variants?.length
    ? product.variants[0].stock
    : product.stock}
</p>
            <p>
              Category: {product.category}
            </p>

            <button
              type="button"
              onClick={() => startEditingProduct(product)}
              className="bg-blue-500 text-white px-3 py-1 rounded mt-2 mr-2"
            >
              Edit
            </button>

            <button
  onClick={() => deleteProduct(product._id)}
  className="bg-red-500 text-white px-3 py-1 rounded mt-2"
>
  Delete
</button>
          </div>

          
        ))}
      </div>
    </div>
  );
};

export default AdminProductsPage;