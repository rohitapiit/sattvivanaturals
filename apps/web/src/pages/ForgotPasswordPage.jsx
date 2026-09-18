import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const API = import.meta.env.VITE_API_URL;


const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success("OTP sent to your email 📧");

      navigate("/reset-password", {
        state: { email },
      });

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-6">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Forgot Password
      </h1>

      <form onSubmit={handleSubmit}>
        <input
          className="w-full border rounded-lg p-3 mb-4"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg"
        >
          Send OTP
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;