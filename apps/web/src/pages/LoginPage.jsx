import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
const API = import.meta.env.VITE_API_URL;


const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
  email: "",
  password: "",
});

  const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });

  setErrors({
    ...errors,
    [e.target.name]: "",
  });
};
  const handleSubmit = async (e) => {
    e.preventDefault();

    const API = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(
        `${API}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      setErrors({
  email: "",
  password: "",
});

if (!data.success) {

  if (data.field === "email") {
    setErrors({
      email: data.message,
      password: "",
    });
  }

  if (data.field === "password") {
    setErrors({
      email: "",
      password: data.message,
    });
  }

  return;
}

      if (!data.success) {
        return;
      }

      login(data.user, data.token);


      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  
  return (
    <div className="max-w-md mx-auto py-20 px-6">
      <h1 className="text-4xl font-bold text-center mb-2">
  Welcome Back
</h1>



<p className="text-center text-gray-500 mb-8">
  Login to your account
</p>

<p className="text-center text-gray-500 mb-6">
  Don't have an account?{" "}
  <Link
    to="/register"
    className="text-green-600 font-semibold hover:underline"
  >
    Register
  </Link>
</p>


      <form onSubmit={handleSubmit}>
        <input className="w-full border rounded-lg p-3 mb-4"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        {errors.email && (
  <p className="text-red-500 text-sm -mt-3 mb-3">
    {errors.email}
  </p>
)}

<div  className="relative">
 <input className="w-full border rounded-lg p-3 mb-4"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-3/4 text-gray-500"
  >
    {showPassword ? (
      <EyeOff size={18} />
    ) : (
      <Eye size={18} />
    )}
  </button>
</div>
       

{errors.password && (
  <p className="text-red-500 text-sm -mt-3 mb-3">
    {errors.password}
  </p>
)}
        <div className="text-right mb-4">
  <Link
    to="/forgot-password"
    className="text-green-600 hover:underline"
  >
    Forgot Password?
  </Link>
</div>

        <button
  type="submit"
  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
>
  Login
</button>
      </form>

      
    </div>
  );
};

export default LoginPage;