import React, {useEffect, useState,} from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
const API = import.meta.env.VITE_API_URL;

const MyAddressesPage = () => {

    const [showForm, setShowForm] =
  useState(false);

const [formData, setFormData] =
  useState({
    nickname: "Home",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  

  const [errors, setErrors] = useState({
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
});

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Puducherry",
    "Chandigarh",
  ];

  const [editingId, setEditingId] =
  useState(null);

  const [addresses, setAddresses] =
    useState([]);



  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API}/addresses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (data.success) {
        
        setAddresses(data.addresses);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  setFormData({
    ...formData,
    [name]: type === "checkbox" ? checked : value,
  });

  setErrors((prev) => ({
    ...prev,
    [name]: "",
  }));
};

const isFormValid =
  formData.fullName.trim() !== "" &&
  /^[A-Za-z ]+$/.test(formData.fullName) &&
  /^\d{10}$/.test(formData.phone) &&
  formData.address.trim() !== "" &&
  formData.city.trim() !== "" &&
  formData.state.trim() !== "" &&
  /^\d{6}$/.test(formData.pincode);

  const fetchCityState = async (pincode) => {
  try {
    const response = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );

    const data = await response.json();

    if (
      data[0].Status === "Success" &&
      data[0].PostOffice &&
      data[0].PostOffice.length > 0
    ) {
      const office = data[0].PostOffice[0];

      setFormData((prev) => ({
        ...prev,
        city: office.District,
        state: office.State,
      }));

      // Clear previous errors
      setErrors((prev) => ({
        ...prev,
        city: "",
        state: "",
        pincode: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        city: "",
        state: "",
      }));

      setErrors((prev) => ({
        ...prev,
        pincode: "Invalid Pincode",
      }));
    }
  } catch (error) {
    console.error(error);

    toast.error("Unable to fetch location");
  }
};

  const validateForm = () => {

  const newErrors = {};

  if (!formData.fullName.trim()) {
    newErrors.fullName = "Full Name is required";
  } else if (!/^[A-Za-z ]+$/.test(formData.fullName)) {
    newErrors.fullName = "Only letters are allowed";
  }

  if (!/^\d{10}$/.test(formData.phone)) {
    newErrors.phone = "Enter a valid 10-digit phone number";
  }

  if (!formData.address.trim()) {
    newErrors.address = "Address is required";
  }

  if (!formData.city.trim()) {
    newErrors.city = "City is required";
  }

  if (!formData.state) {
    newErrors.state = "Please select a state";
  }

  if (!/^\d{6}$/.test(formData.pincode)) {
    newErrors.pincode = "Enter a valid 6-digit pincode";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (
  !formData.fullName.trim() ||
  !formData.phone.trim() ||
  !formData.address.trim() ||
  !formData.city.trim() ||
  !formData.state ||
  !formData.pincode.trim()
) {
  toast.error("Please fill all required details correctly.");
  return;
}

  if (!validateForm()) {
  return;
}
  try {
    const token = localStorage.getItem("token");

    const url = editingId
      ? `${API}/addresses/${editingId}`
      : `${API}/addresses`;

    const method = editingId
      ? "PUT"
      : "POST";

    const response = await fetch(url, {
      method: method,

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.success) {

      toast.success(
editingId
? "Address Updated Successfully"
: "Address Added Successfully"
);
      fetchAddresses();

      setEditingId(null);

      setShowForm(false);

      setFormData({
        nickname: "Home",
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false,
      });

      setErrors({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      });
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");

  }
};
const handleDelete = async (id) => {

  const result = await Swal.fire({
    title: "Delete Address?",
    text: "This address will be permanently deleted.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#17863A",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  try {

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API}/addresses/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Address deleted successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

      fetchAddresses();

    } else {

      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: data.message,
      });

    }

  } catch (error) {

    console.error(error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong.",
    });

  }
};

const handleDefault =
  async (id) => {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await fetch(
          `${API}/addresses/${id}/default`,
          {
            method: "PUT",

            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (data.success) {

      toast.success("Default Address Updated");

        fetchAddresses();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (
  address
) => {
  setEditingId(address._id);

  setFormData({
    nickname:
      address.nickname,

    fullName:
      address.fullName,

    phone:
      address.phone,

    address:
      address.address,

    city:
      address.city,

    state:
      address.state,

    pincode:
      address.pincode,

    isDefault:
      address.isDefault,
  });

  setShowForm(true);
};
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="mb-10">
  <h1 className="text-4xl font-bold text-[#5A3223]">
    My Addresses
  </h1>

  <p className="text-gray-500 mt-2 mb-6">
    Manage your saved addresses for faster checkout.
  </p>

  <button
    onClick={() => setShowForm(!showForm)}
    className="
      bg-[#17863A]
      hover:bg-[#126d2f]
      text-white
      px-7
      py-3
      rounded-xl
      font-semibold
      shadow-lg
      transition
    "
  >
    + Add New Address
  </button>
</div>
      {
  showForm && (
    <form
      onSubmit={handleSubmit}
      className="border rounded-xl p-5 mb-8"
    >

    <select
  name="nickname"
  value={formData.nickname}
  onChange={handleChange}
  className="border p-2 w-full mb-3"
>
  <option value="Home">
    Home
  </option>

  <option value="Office">
    Office
  </option>

  <option value="Hostel">
    Hostel
  </option>

  <option value="Other">
    Other
  </option>
</select>

      <input
        className="border p-2 w-full mb-3"
        name="fullName"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={(e) =>
          setFormData({
            ...formData,
            fullName: e.target.value.replace(/[^A-Za-z ]/g, ""),
          })
        }
        
      />
      {
errors.fullName && (
<p className="text-red-500 text-sm mt-1">
   {errors.fullName}
</p>
)
}


      <input
        className="border p-2 w-full mb-3"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={(e) =>
          setFormData({
            ...formData,
            phone: e.target.value.replace(/\D/g, "").slice(0, 10),
          })
        }
      />
      {
errors.phone && (
<p className="text-red-500 text-sm mt-1">
   {errors.phone}
</p>
)
}
<input
  className="border p-2 w-full mb-3"
  name="address"
  type="text"
  placeholder="Address"
  value={formData.address}
  onChange={handleChange}
/>

{
errors.address && (
<p className="text-red-500 text-sm mt-1">
   {errors.address}
</p>
)
}
      <select
  name="state"
  value={formData.state}
  onChange={handleChange}
  className="border p-2 w-full mb-3"
>
  <option value="">Select State</option>

  {states.map((state) => (
    <option key={state} value={state}>
      {state}
    </option>
  ))}
</select>

{errors.state && (
  <p className="text-red-500 text-sm mt-1">
    {errors.state}
  </p>
)}


      <input
        className="border p-2 w-full mb-3"
        name="pincode"
        placeholder="Pincode"
       onChange={(e) => {

  const value = e.target.value
    .replace(/\D/g, "")
    .slice(0, 6);

  setFormData((prev) => ({
    ...prev,
    pincode: value,
  }));

  setErrors((prev) => ({
    ...prev,
    pincode: "",
  }));

  if (value.length === 6) {
    fetchCityState(value);
  } else {
    setFormData((prev) => ({
      ...prev,
      city: "",
      state: "",
    }));
  }

}}
      />

      {
errors.pincode && (
<p className="text-red-500 text-sm mt-1">
   {errors.pincode}
</p>
)
}



      <input
  className="border p-2 w-full mb-3 bg-gray-100"
  name="city"
  placeholder="City"
  value={formData.city}
  readOnly
/>

{
errors.city && (
<p className="text-red-500 text-sm mt-1">
   {errors.city}
</p>
)
}


      <div className="flex gap-3">
  <button
  type="submit"
  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
>
  {editingId ? "Update Address" : "Save Address"}
</button>

  <button
    type="button"
    onClick={() => {
      setShowForm(false);
      setEditingId(null);

      setFormData({
        nickname: "Home",
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false,
      });
    }}
    className="border px-5 py-2 rounded"
  >
    Cancel
  </button>
</div>
    </form>
  )
}

      {addresses.length === 0 ? (
        <p>No addresses found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {addresses.map((address) => (
          <div
            key={address._id}
            className="
bg-white
rounded-2xl
border
border-[#ECE5DA]
shadow-md
hover:shadow-xl
transition
p-6
">
            <div className="flex justify-between items-start mb-5">
            <h2 className="text-2xl font-bold text-[#5A3223]">
              {address.nickname}
            </h2>

              {address.isDefault && (
                <span className="bg-green-50 text-green-600 text-sm px-3 py-1 rounded-full">
                  Default
                </span>
              )}
            </div>

            <p className="font-semibold text-lg text-gray-800">
  {address.fullName}
</p>

            <p className="text-gray-500">
  📞 {address.phone}
</p>

            <p className="text-gray-600 mt-2">
  📍 {address.address}
</p>
            <p className="text-gray-600">
  {address.city}, {address.state} - {address.pincode}
</p>

            <div className="flex flex-wrap gap-3 mt-6">
              <button
  onClick={() =>
    handleEdit(address)
  }
  className="
px-4
py-2
rounded-lg
bg-green-50
text-green-700
font-medium
hover:bg-green-100
"
>
  Edit
</button>

              <button
  onClick={() =>
    handleDelete(address._id)
  }
  className="
px-4
py-2
rounded-lg
bg-red-50
text-red-600
font-medium
hover:bg-red-100
"
>
  Delete
</button>

              {!address.isDefault && (
                <button
  onClick={() =>
    handleDefault(address._id)
  }
  className="
px-4
py-2
rounded-lg
bg-[#17863A]
text-white
hover:bg-[#126d2f]
"
>
  Set Default
</button>
              )}
            </div>
          </div>
        ))}
</div>
      )}
    </div>
  );
};

export default MyAddressesPage;