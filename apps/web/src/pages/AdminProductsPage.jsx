import React, { useEffect, useState } from "react";
const API = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const CropImageDialog = ({ image, onCancel, onSave }) => {
  const [crop, setCrop] = useState({ x: 10, y: 10, width: 80, height: 80 });
  const [saving, setSaving] = useState(false);

  const updateCrop = (field, value) => {
    const nextValue = Math.max(0, Math.min(100, Number(value)));
    setCrop((current) => {
      const next = { ...current, [field]: nextValue };
      if (field === "x") next.width = Math.min(next.width, 100 - next.x);
      if (field === "y") next.height = Math.min(next.height, 100 - next.y);
      if (field === "width") next.width = Math.min(next.width, 100 - next.x);
      if (field === "height") next.height = Math.min(next.height, 100 - next.y);
      return next;
    });
  };

  const createCrop = async () => {
    setSaving(true);
    try {
      const source = new Image();
      source.crossOrigin = "anonymous";
      source.src = image;
      await new Promise((resolve, reject) => {
        source.onload = resolve;
        source.onerror = () => reject(new Error("The image could not be loaded for cropping."));
      });

      const sourceX = Math.round((crop.x / 100) * source.naturalWidth);
      const sourceY = Math.round((crop.y / 100) * source.naturalHeight);
      const sourceWidth = Math.round((crop.width / 100) * source.naturalWidth);
      const sourceHeight = Math.round((crop.height / 100) * source.naturalHeight);
      const canvas = document.createElement("canvas");
      canvas.width = sourceWidth;
      canvas.height = sourceHeight;
      canvas.getContext("2d").drawImage(source, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight);

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
      if (!blob) throw new Error("Could not create the cropped image.");
      onSave(blob);
    } catch (error) {
      console.error("IMAGE CROP ERROR:", error);
      alert("Unable to crop this image. Please try a different image or re-upload it.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold">Crop product image</h2>
          <button type="button" onClick={onCancel} className="text-sm font-medium text-gray-600 hover:text-gray-900">Close</button>
        </div>
        <div className="relative mx-auto aspect-square max-h-[440px] max-w-[600px] overflow-hidden bg-gray-100">
          <img src={image} alt="Crop source" className="h-full w-full object-contain" />
          <div
            className="pointer-events-none absolute border-2 border-white bg-black/20 shadow-[0_0_0_9999px_rgba(0,0,0,.45)]"
            style={{ left: `${crop.x}%`, top: `${crop.y}%`, width: `${crop.width}%`, height: `${crop.height}%` }}
          />
        </div>
        <p className="mt-4 text-sm text-gray-600">Set the crop area, then save the cropped image. The original remains unchanged until the product is updated.</p>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[["x", "Left"], ["y", "Top"], ["width", "Width"], ["height", "Height"]].map(([field, label]) => (
            <label key={field} className="text-sm font-medium text-gray-700">
              {label} (%)
              <input type="number" min="0" max="100" value={crop[field]} onChange={(event) => updateCrop(field, event.target.value)} className="mt-1 w-full rounded border p-2" />
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onCancel} disabled={saving} className="rounded border px-4 py-2">Cancel</button>
          <button type="button" onClick={createCrop} disabled={saving || crop.width === 0 || crop.height === 0} className="rounded bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50">
            {saving ? "Cropping..." : "Crop & replace image"}
          </button>
        </div>
      </div>
    </div>
  );
};




const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [croppingImage, setCroppingImage] = useState(null);

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

const removeProductImage = (imageIndex) => {
  setFormData((prev) => ({
    ...prev,
    images: prev.images.filter((_, index) => index !== imageIndex),
  }));
};

const uploadCroppedImage = async (blob, imageIndex) => {
  try {
    setUploading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Your session has expired. Please login again.");
      window.location.href = "/login";
      return;
    }

    const imageData = new FormData();
    imageData.append("image", new File([blob], "cropped-product-image.jpg", { type: "image/jpeg" }));
    const response = await fetch(`${API}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: imageData,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.success || !data.imageUrl) {
      throw new Error(data.message || "Cropped image upload failed.");
    }
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((image, index) => index === imageIndex ? data.imageUrl : image),
    }));
    setCroppingImage(null);
  } catch (error) {
    console.error("CROPPED IMAGE UPLOAD ERROR:", error);
    alert(error.message || "Failed to upload the cropped image.");
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
      {croppingImage && (
        <CropImageDialog
          image={croppingImage.url}
          onCancel={() => setCroppingImage(null)}
          onSave={(blob) => uploadCroppedImage(blob, croppingImage.index)}
        />
      )}
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
    <input
      type="text"
      value={variant.size}
      onChange={(e) => {
        const updated = [...formData.variants];
        updated[index].size = e.target.value;
        setFormData({
          ...formData,
          variants: updated,
        });
      }}
      placeholder="Weight / Size (e.g. 750 g, 1.5 kg, 2 L)"
      aria-label="Weight or size"
      className="border p-2 rounded"
    />

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

      <div key={`${image}-${index}`} className="relative">
        <img
          src={image}
          alt={`Product image ${index + 1}`}
          className="w-28 h-28 object-cover rounded-lg"
        />
        <button
          type="button"
          onClick={() => removeProductImage(index)}
          className="absolute -top-2 -right-2 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white shadow hover:bg-red-700"
          aria-label={`Remove product image ${index + 1}`}
        >
          ×
        </button>
        <button
          type="button"
          onClick={() => setCroppingImage({ url: image, index })}
          className="absolute bottom-1 left-1 rounded bg-black/75 px-2 py-1 text-xs font-medium text-white hover:bg-black"
        >
          Crop
        </button>
      </div>

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
