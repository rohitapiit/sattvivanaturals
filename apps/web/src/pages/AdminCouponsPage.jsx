import React, {
  useEffect,
  useState,
} from "react";
const API = import.meta.env.VITE_API_URL;

const AdminCouponsPage = () => {
  const [coupons, setCoupons] =
    useState([]);

  const [formData, setFormData] =
    useState({
      code: "",
      discountType: "percentage",
      discountValue: "",
      minimumAmount: "",
      isVisible: true,
      isActive: true,
    });

    const [editingCouponId, setEditingCouponId] =
  useState(null);
   const handleDeleteCoupon = async (
  id
) => {

  if (
    !window.confirm(
      "Delete this coupon?"
    )
  ) {
    return;
  }

  try {
    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await fetch(
        `${API}/coupons/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    const data =
      await response.json();

    if (data.success) {
      fetchCoupons();

      alert(
        "Coupon deleted successfully"
      );

      localStorage.setItem(
    "couponUpdated",
    Date.now()
      );
    }
  } catch (error) {
    console.error(error);
  }
};


const handleEditCoupon = (
  coupon
) => {

  setEditingCouponId(
    coupon._id
  );

  setFormData({
    code:
      coupon.code,

    discountType:
      coupon.discountType,

    discountValue:
      coupon.discountValue,

    minimumAmount:
      coupon.minimumAmount,

    isVisible:
      coupon.isVisible,

    isActive:
      coupon.isActive,
  });

};
const handleToggleVisible = async (
  coupon
) => {
  try {
    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await fetch(
        `${API}/coupons/${coupon._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            ...coupon,
            isVisible:
              !coupon.isVisible,
          }),
        }
      );

    const data =
      await response.json();

    if (data.success) {
      fetchCoupons();

      localStorage.setItem(
    "couponUpdated",
    Date.now()
      );
    }
  } catch (error) {
    console.error(error);
  }
};

const handleToggleActive = async (
  coupon
) => {
  try {
    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await fetch(
        `${API}/coupons/${coupon._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            ...coupon,
            isActive:
              !coupon.isActive,
          }),
        }
      );

    const data =
      await response.json();

    if (data.success) {
      fetchCoupons();

      localStorage.setItem(
    "couponUpdated",
    Date.now()
      );
    }
  } catch (error) {
    console.error(error);
  }
};
  const fetchCoupons = async () => {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await fetch(
          `${API}/coupons/admin`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (data.success) {
        setCoupons(
          data.coupons
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

 const handleCreateCoupon = async () => {
  try {
    const token = localStorage.getItem(
      "token"
    );

    const url = editingCouponId
      ? 
      `${API}/coupons/${editingCouponId}`
      : `${API}/coupons`
    const method = editingCouponId
      ? "PUT"
      : "POST";

    const response = await fetch(
      url,
      {
        method,

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },

        body: JSON.stringify(
          formData
        ),
      }
    );

    const data =
      await response.json();

    if (data.success) {

      alert(
        editingCouponId
          ? "Coupon Updated 🎉"
          : "Coupon Created 🎉"
      );

      fetchCoupons();

      localStorage.setItem(
    "couponUpdated",
    Date.now()
      );

      setEditingCouponId(
        null
      );

      setFormData({
        code: "",
        discountType:
          "percentage",
        discountValue:
          "",
        minimumAmount:
          "",
        isVisible:
          true,
        isActive:
          true,
      });
    }

  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="max-w-6xl mx-auto py-10">

      <h1 className="text-3xl font-bold mb-8">
        Admin Coupons
      </h1>

      {/* Form */}

      <div className="bg-white p-6 rounded-xl shadow mb-8">

        <input
          placeholder="Coupon Code"
          value={formData.code}
          onChange={(e) =>
            setFormData({
              ...formData,
              code:
                e.target.value,
            })
          }
          className="border p-3 rounded w-full mb-4"
        />

        <input
          placeholder="Discount Value"
          value={
            formData.discountValue
          }
          onChange={(e) =>
            setFormData({
              ...formData,
              discountValue:
                e.target.value,
            })
          }
          className="border p-3 rounded w-full mb-4"
        />

        <input
          placeholder="Minimum Amount"
          value={
            formData.minimumAmount
          }
          onChange={(e) =>
            setFormData({
              ...formData,
              minimumAmount:
                e.target.value,
            })
          }
          className="border p-3 rounded w-full mb-4"
        />

        <button
  onClick={
    handleCreateCoupon
  }
  className="bg-green-600 text-white px-6 py-3 rounded"
>
  {
    editingCouponId
      ? "Update Coupon"
      : "Add Coupon"
  }
</button>

      </div>

      {/* Table */}

      <table className="w-full border">

        <thead>
          <tr className="bg-gray-100">
            <th>Code</th>
            <th>Type</th>
            <th>Value</th>
            <th>Min Amount</th>
            <th>Visible</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {coupons.map(
            (coupon) => (
              <tr
                key={
                  coupon._id
                }
                className="text-center border-t"
              >
                <td>
                  {
                    coupon.code
                  }
                </td>

                <td>
                  {
                    coupon.discountType
                  }
                </td>

                <td>
                  {
                    coupon.discountValue
                  }
                </td>

                <td>
                  ₹
                  {
                    coupon.minimumAmount
                  }
                </td>

                <td>

<button
onClick={() =>
  handleToggleVisible(
    coupon
  )
}
className={`px-3 py-1 rounded text-white ${
coupon.isVisible
? "bg-green-500"
: "bg-gray-500"
}`}
>

{coupon.isVisible
? "Visible"
: "Hidden"}

</button>

</td>

<td>

<button
onClick={() =>
  handleToggleActive(
    coupon
  )
}
className={`px-3 py-1 rounded text-white ${
coupon.isActive
? "bg-green-500"
: "bg-red-500"
}`}
>

{coupon.isActive
? "Active"
: "Inactive"}

</button>

</td>


                <td className="space-x-2">

<button
  onClick={() =>
    handleEditCoupon(
      coupon
    )
  }
  className="bg-blue-500 text-white px-3 py-1 rounded"
>
  Edit
</button>
<button
onClick={() =>
  handleDeleteCoupon(
    coupon._id
  )
  
}
className="bg-red-500 text-white px-3 py-1 rounded"
>


Delete

</button>

</td>
              </tr>
            )
          )}
        </tbody>

      </table>

    </div>
  );
};

export default AdminCouponsPage;