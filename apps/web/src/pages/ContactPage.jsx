import React, { useState } from "react";
import { toast } from "react-toastify";
const API = import.meta.env.VITE_API_URL;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
  const { name, value } = e.target;

  let newValue = value;

  if (name === "fullName") {
    newValue = value.replace(/[^A-Za-z ]/g, "");
  }

  if (name === "phone") {
    newValue = value.replace(/\D/g, "").slice(0, 10);
  }

  setFormData((prev) => ({
    ...prev,
    [name]: newValue,
  }));

  setErrors((prev) => ({
    ...prev,
    [name]: "",
  }));
};

  const validateForm = () => {
  const newErrors = {};

  // Full Name
  if (!formData.fullName.trim()) {
    newErrors.fullName = "Full Name is required";
  } else if (!/^[A-Za-z ]+$/.test(formData.fullName)) {
    newErrors.fullName = "Only letters and spaces are allowed";
  }

  // Email
  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  ) {
    newErrors.email = "Enter a valid email address";
  }

  // Phone
  if (!/^\d{10}$/.test(formData.phone)) {
    newErrors.phone = "Phone number must be exactly 10 digits";
  }

  // Message
  if (!formData.message.trim()) {
    newErrors.message = "Message is required";
  } else if (formData.message.trim().length < 10) {
    newErrors.message =
      "Message should contain at least 10 characters";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
    return;
  }

    const response =
await fetch(
  `${API}/contact`,
{
method: "POST",

headers: {
"Content-Type":
"application/json",
},

body:
JSON.stringify(formData),
}
);

const data =
await response.json();

if (data.success) {

toast.success("Message sent successfully 🎉");

}

    // Backend API baad me connect karenge


    setFormData({
      fullName: "",
      email: "",
      phone: "",
      subject: "General Inquiry",
      message: "",
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">

      <h1 className="text-4xl font-bold text-center mb-3">
        Contact Us
      </h1>

      <p className="text-center text-gray-500 mb-10">
        We'd love to hear from you. Please fill out the form below.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 space-y-5"
      >
        {/* Full Name */}
        <div>
          <label className="block mb-2 font-medium">
            Full Name *
          </label>

          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            className="w-full border rounded-lg p-3"
          />

          {errors.fullName && (
  <p className="text-red-500 text-sm mt-1">
    {errors.fullName}
  </p>
)}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 font-medium">
            Email Address *
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            className="w-full border rounded-lg p-3"
          />


          {errors.email && (
  <p className="text-red-500 text-sm mt-1">
    {errors.email}
  </p>
)}
        </div>

        {/* Mobile */}
        <div>
          <label className="block mb-2 font-medium">
            Mobile Number *
          </label>

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your mobile number"
            required
            className="w-full border rounded-lg p-3"
          />


          {errors.phone && (
  <p className="text-red-500 text-sm mt-1">
    {errors.phone}
  </p>
)}
        </div>

        {/* Subject */}
        <div>
          <label className="block mb-2 font-medium">
            Subject *
          </label>

          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          >
            <option>General Inquiry</option>
            <option>Product Information</option>
            <option>Order Support</option>
            <option>Bulk / Wholesale Orders</option>
            <option>Distributor Inquiry</option>
            <option>Retailer Partnership</option>
            <option>Feedback & Suggestions</option>
            <option>Media & Collaborations</option>
            <option>Other</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label className="block mb-2 font-medium">
            Message *
          </label>

          <textarea
            name="message"
            rows="6"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message here..."
            required
            className="w-full border rounded-lg p-3"
          />

          {errors.message && (
  <p className="text-red-500 text-sm mt-1">
    {errors.message}
  </p>
)}
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactPage;