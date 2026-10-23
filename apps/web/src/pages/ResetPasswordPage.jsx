import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;
import { toast } from "react-toastify";



const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `${API}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            otp: formData.otp,
            newPassword: formData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success("Password reset successful");

      navigate("/login");

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-6">
      <h1 className="text-4xl font-bold text-center mb-8">
        Reset Password
      </h1>

      <form onSubmit={handleSubmit}>
        <input
          className="w-full border rounded-lg p-3 mb-4"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          className="w-full border rounded-lg p-3 mb-4"
          type="text"
          name="otp"
          placeholder="Enter OTP"
          value={formData.otp}
          onChange={handleChange}
        />

        <input
          className="w-full border rounded-lg p-3 mb-4"
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={formData.newPassword}
          onChange={handleChange}
        />

        <input
          className="w-full border rounded-lg p-3 mb-6"
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;