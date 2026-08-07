import React, {
  useState,
  useEffect,
} from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const RegisterPage = () => {
  const navigate = useNavigate();

  

  const [showOtpInput, setShowOtpInput] = useState(false);

const [otp, setOtp] = useState("");

const [emailForOtp, setEmailForOtp] = useState("");

const [resendTimer, setResendTimer] = useState(30);

const [canResend, setCanResend] = useState(false);

const [showPassword, setShowPassword] = useState(false);

const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const [formData, setFormData] = useState({
  name: "",
  phone: "",
  email: "",
  password: "",
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
  formData.password !==
  formData.confirmPassword
) {
 toast.error("Passwords do not match");
  return;
}

    try {
      const response = await fetch(
        `${API}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

    toast.success("OTP sent to your email 📧");

setEmailForOtp(formData.email);

setShowOtpInput(true);

setCanResend(false);

setResendTimer(30);
    } catch (error) {
      console.error(error);
    }
  };

  const handleVerifyOtp = async () => {
  try {
    const response = await fetch(
      `${API}/auth/verify-otp`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          email: emailForOtp,
          otp,
        }),
      }
    );

    const data = await response.json();

    if (!data.success) {
      toast.error(data.message);
      return;
    }

    toast.success("Email verified successfully 🎉");

setTimeout(() => {
  navigate("/login");
}, 1000);

  } catch (error) {
    console.error(error);
  }
};

const handleResendOtp = async () => {

  if (!canResend) return;
  try {
    const response = await fetch(
      `${API}/auth/resend-otp`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          email: emailForOtp,
        }),
      }
    );

    const data = await response.json();

  if (data.success) {
    toast.success(data.message);

    setCanResend(false);
    
    setResendTimer(30);
} else {
  toast.error(data.message);
}
}

  catch (error) {
    console.error(error);
  }
};

useEffect(() => {

  if (!showOtpInput) return;

  if (canResend) return;

  if (resendTimer <= 0) {
    setCanResend(true);
    return;
  }

  const timer = setTimeout(() => {
    setResendTimer(prev => prev - 1);
  }, 1000);

  return () => clearTimeout(timer);

}, [
  resendTimer,
  canResend,
  showOtpInput,
]);

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6">
        Create Account
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          disabled={showOtpInput}
          className="w-full border rounded-lg p-3"
        />


<div>
  <input
    type="tel"
    name="phone"
    value={formData.phone}
    onChange={handleChange}
    placeholder="Enter your phone number"
    maxLength={10}
    required
    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
  />
</div>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          disabled={showOtpInput}
          className="w-full border rounded-lg p-3"
        />

<div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    value={formData.password}
    onChange={handleChange}
    disabled={showOtpInput}
    className="w-full border rounded-lg p-3 pr-10"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
  >
    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
</div>

       



<div className="relative">
  <input
    type={showConfirmPassword ? "text" : "password"}
    name="confirmPassword"
    placeholder="Confirm Password"
    value={formData.confirmPassword}
    onChange={handleChange}
    disabled={showOtpInput}
    className="w-full border rounded-lg p-3 pr-10"
  />

  <button
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
  >
    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
</div>





        {
  !showOtpInput && (
    <button
      type="submit"
      className="w-full bg-green-600 text-white py-3 rounded-lg"
    >
      Register
    </button>
  )
}
      </form>

      {showOtpInput && (
  <div className="mt-6 space-y-4">
    <input
      type="text"
      placeholder="Enter OTP"
      value={otp}
      onChange={(e) =>
        setOtp(e.target.value)
      }
      className="w-full border rounded-lg p-3"
    />
   <button
  onClick={handleResendOtp}
  disabled={!canResend}
  className={`w-full py-3 rounded-lg font-medium transition

    ${
      canResend
        ? "bg-green-600 text-white hover:bg-green-700"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }
  `}
>

  {canResend
    ? "Resend OTP"
    : `Resend OTP (${resendTimer}s)`}

</button>

    <button
      onClick={handleVerifyOtp}
      className="w-full bg-blue-600 text-white py-3 rounded-lg"
    >
      Verify OTP
    </button>
  </div>
)}

      <p className="mt-4 text-center">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-green-600 font-semibold"
        >
          Login
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;