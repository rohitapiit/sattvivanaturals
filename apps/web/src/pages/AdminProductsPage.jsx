import React, { useEffect, useState } from "react";
const API = import.meta.env.VITE_API_URL;




const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
  title: "",
  description: "",
  category: "",
  subcategory: "",
  price: "",
  stock: "",
  variants: [
  {
    size: "",
    price: "",
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

  const saveProduct = async (e) => {
  e.preventDefault();

  if (!formData.category) {
  alert("Please select a category.");
  return;
}

if (!formData.subcategory) {
  alert("Please select a subcategory.");
  return;
}
  console.log(formData.variants);
  try {
    const token = localStorage.getItem("token");

const url = editingId
  ? `${API}/products/${editingId}`
  : `${API}/products`

const method = editingId
  ? "PUT"
  : "POST";

  console.log(formData);
  console.log(formData.uses);

const productData = {
  ...formData,

  variants: formData.variants.filter(
  item =>
    item.size &&
    item.price !== "" &&
    item.stock !== ""
)
};
if (productData.variants.length > 0) {
  productData.price = Number(productData.variants[0].price);

  // Total stock of all variants
  productData.stock = productData.variants.reduce(
    (total, variant) => total + Number(variant.stock || 0),
    0
  );
}
const response = await fetch(url, {
  method,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },

 
  body: JSON.stringify(productData),
});

const data = await response.json();

if (data.success) {
  fetchProducts();

  setEditingId(null);
setFormData({
  title: "",
  description: "",
  category: "",
  subcategory: "",
  price: "",
  stock: "",
  variants: [
  {
    size: "",
    price: "",
    stock: "",
  },
],

  images: [],
  uses: [],
  keyBenefits: [],
  ingredients: "",
  nutritionalInformation: "",
});
  alert(
    editingId
      ? "Product Updated Successfully"
      : "Product Added Successfully"
  );
}

} catch (error) {
    console.error(error);
  }
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

const uploadImages = async (
  files
) => {
  try {

    setUploading(true);

    let uploadedImages = [];

    for (const file of files) {

      const imageData =
        new FormData();

      imageData.append(
        "image",
        file
      );

      const response =
        await fetch(
          `${API}/upload`,
          {
            method: "POST",
            body: imageData,
          }
        );

      const data =
        await response.json();

      if (data.success) {

        uploadedImages.push(
          data.imageUrl
        );

      }
    }

    setFormData(prev => ({
  ...prev,
  images: [
    ...prev.images,
    ...uploadedImages,
  ],
}));

    setUploading(false);

  } catch (error) {

    console.error(error);

    setUploading(false);

  }
};
const uploadUseImage = async (
  file,
  index
) => {
  try {

    console.log(file);

    const imageData =
      new FormData();

    imageData.append(
      "image",
      file
    );

    const response =
      await fetch(
        `${API}/upload`,
        {
          method: "POST",
          body: imageData,
        }
      );

    const data =
      await response.json();

    console.log(data);


      if (data.success) {

  setFormData(prev => {

    const updatedUses = [...prev.uses];

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

    console.error(error);

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
    className="grid grid-cols-4 gap-3 mb-3"
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
      placeholder="Price"
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
    className="bg-green-600 text-white px-4 py-2 rounded"
  >
    {editingId ? "Update Product" : "Add Product"}
  </button>
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
  onClick={() => {
    setEditingId(product._id);

  setFormData({
  title: product.title,
  description: product.description,
  category: product.category,
  subcategory: product.subcategory || "",
  price: product.price,
  stock: product.stock,
 

variants:
  product.variants?.length
    ? product.variants
    : [
        {
          size: "",
          price: "",
          stock: "",
          
        },
      ],
  images: product.images || [],
  uses: product.uses || [],

  keyBenefits: product.keyBenefits || [],
  ingredients: product.ingredients || "",
  nutritionalInformation:
    product.nutritionalInformation || "",
});
  }}
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