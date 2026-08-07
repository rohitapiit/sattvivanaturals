import React, {useState,useEffect,} from "react";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
const API = import.meta.env.VITE_API_URL;




const CheckoutPage = () => {

  console.log(
    import.meta.env.VITE_RAZORPAY_KEY_ID
  );


  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

const location = useLocation();

const buyNowItem =
  location.state?.buyNowItem;

  const [addresses, setAddresses] = useState([]);
    
  const { cartItems, getCartTotal, clearCart } = useCart();

  const checkoutItems =
  buyNowItem
    ? [buyNowItem]
    : cartItems;

    console.log("Buy Now Item:", buyNowItem);
console.log("Cart Items:", cartItems);
console.log("Checkout Items:", checkoutItems);
  const navigate = useNavigate();

  const [visibleCoupons, setVisibleCoupons] =
  useState([]);




 const [shippingAddress, setShippingAddress] = useState({
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
});



const [errors, setErrors] = useState({
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
});


const [billingAddress, setBillingAddress] = useState({
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
});

const [billingErrors, setBillingErrors] = useState({
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
});



const [sameAsShipping, setSameAsShipping] = useState(true);


  const [couponCode, setCouponCode] =
  useState("");

  // Tracks the code of the coupon that's currently successfully
  // applied, so the Apply button can be disabled until the person
  // types/selects a different code.
  const [appliedCoupon, setAppliedCoupon] =
  useState(null);

   
const [discount, setDiscount] =
  useState(0);

const [finalAmount, setFinalAmount] =
  useState(0);

  const [paymentMethod, setPaymentMethod] =
  useState("ONLINE");

  const isCouponApplied = !!appliedCoupon;

  

  useEffect(() => {

    const token =
      localStorage.getItem("token");
  
    if (token) {
  
      fetchProfile();      // <-- Add this
  
      fetchAddresses();
  
    }
  
    fetchCoupons();
  
  }, []);

  useEffect(() => {
    const total = checkoutItems.reduce(
      (sum, item) =>
        sum + item.product.price * item.quantity,
      0
    );
  
    if (discount === 0) {
      setFinalAmount(total);
    }
  }, [checkoutItems, discount]);

useEffect(() => {
  const handleStorageChange = () => {
    fetchCoupons();
  };

   



  window.addEventListener(
    "storage",
    handleStorageChange
  );

  return () =>
    window.removeEventListener(
      "storage",
      handleStorageChange
    );
}, []);

useEffect(() => {
  if (appliedCoupon) {
    setPaymentMethod("ONLINE");
  }
}, [appliedCoupon]);



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

      setShippingAddress((prev) => ({
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
      setShippingAddress((prev) => ({
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

const fetchBillingCityState = async (pincode) => {
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

      setBillingAddress((prev) => ({
  ...prev,
  city: office.District,
  state: office.State,
}));

      // Clear previous errors
      setBillingErrors((prev) => ({
        ...prev,
        city: "",
        state: "",
        pincode: "",
      }));
    } else {
      setBillingAddress((prev) => ({
  ...prev,
  city: "",
  state: "",
}));

      setBillingErrors((prev) => ({
        ...prev,
        pincode: "Invalid Pincode",
      }));
    }
  } catch (error) {
    console.error(error);

    toast.error("Unable to fetch location");
  }
};

const validateShipping = () => {
  const newErrors = {};

  if (!shippingAddress.fullName.trim()) {
    newErrors.fullName = "Full Name is required";
  } else if (!/^[A-Za-z ]+$/.test(shippingAddress.fullName)) {
    newErrors.fullName = "Only letters are allowed";
  }

  console.log("EMAIL =", shippingAddress.email);
  if (!/^\S+@\S+\.\S+$/.test(shippingAddress.email)) {
    newErrors.email = "Enter a valid email";
  }

  if (!/^\d{10}$/.test(shippingAddress.phone)) {
    newErrors.phone = "Enter a valid 10-digit phone number";
  }

  if (!shippingAddress.address.trim()) {
    newErrors.address = "Address is required";
  }

  if (!shippingAddress.city.trim()) {
    newErrors.city = "City is required";
  }

  if (!shippingAddress.state.trim()) {
    newErrors.state = "State is required";
  }

  if (!/^\d{6}$/.test(shippingAddress.pincode)) {
    newErrors.pincode = "Enter a valid 6-digit pincode";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};


const validatebilling = () => {
  const newErrors = {};

  if (!billingAddress.fullName.trim()) {
    newErrors.fullName = "Full Name is required";
  } else if (!/^[A-Za-z ]+$/.test(billingAddress.fullName)) {
    newErrors.fullName = "Only letters are allowed";
  }

  if (!/^\S+@\S+\.\S+$/.test(billingAddress.email)) {
    newErrors.email = "Enter a valid email";
  }

  if (!/^\d{10}$/.test(billingAddress.phone)) {
    newErrors.phone = "Enter a valid 10-digit phone number";
  }

  if (!billingAddress.address.trim()) {
    newErrors.address = "Address is required";
  }

  if (!billingAddress.city.trim()) {
    newErrors.city = "City is required";
  }

  if (!billingAddress.state.trim()) {
    newErrors.state = "State is required";
  }

  if (!/^\d{6}$/.test(billingAddress.pincode)) {
    newErrors.pincode = "Enter a valid 6-digit pincode";
  }

  setBillingErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

const fetchProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.success) {
      setShippingAddress((prev) => ({
        ...prev,
        email: prev.email || data.user.email,
      }));

      setBillingAddress((prev) => ({
        ...prev,
        email: prev.email || data.user.email,
      }));
    }
  } catch (error) {
    console.error(error);
  }
};
const fetchAddresses = async () => {
  try {
    const token = localStorage.getItem(
      "token"
    );

    const response = await fetch(
      `${API}/addresses`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      setAddresses(data.addresses);

      const defaultAddress =
        data.addresses.find(
          (a) => a.isDefault
        );

      if (defaultAddress) {
        setShippingAddress({
          fullName:
            defaultAddress.fullName,

            email: defaultAddress.email,
          phone:
            defaultAddress.phone,

          address:
            defaultAddress.address,

          city:
            defaultAddress.city,

          state:
            defaultAddress.state,

          pincode:
            defaultAddress.pincode,
        });

        setBillingAddress({
  fullName: defaultAddress.fullName,
  email: defaultAddress.email,
  phone: defaultAddress.phone,
  address: defaultAddress.address,
  city: defaultAddress.city,
  state: defaultAddress.state,
  pincode: defaultAddress.pincode,
});
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const fetchCoupons = async () => {
  try {
    const response = await fetch(
      `${API}/coupons`,
    );

    const data = await response.json();

    if (data.success) {
      setVisibleCoupons(
        data.coupons
      );
    }
  } catch (error) {
    console.error(error);
  }
};

const applyCoupon = async () => {
  const trimmedCode = couponCode.trim();

  if (!trimmedCode) {
    toast.error("Please enter a coupon code");
    return;
  }

  // Already applied and unchanged — button should be disabled for
  // this case anyway, but guard here too in case it's triggered
  // programmatically.
  if (appliedCoupon && appliedCoupon === trimmedCode) {
    return;
  }

  try {
    const total = checkoutItems.reduce(

  (sum, item) =>
    sum +
    item.product.price * item.quantity,
  0
);

    const response = await fetch(
      `${API}/coupons/apply`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
  code: trimmedCode,
  amount: total,
}),
      }
    );

    const data =
      await response.json();
      console.log("Coupon API Response:", data);

    if (!data.success) {
      toast.error(data.message);
      return;
    }

    setDiscount(data.discount);

    setFinalAmount(
      data.finalAmount
    );

    setAppliedCoupon(trimmedCode);
    setPaymentMethod("ONLINE");

    console.log("Discount:", data.discount);
console.log("Final Amount:", data.finalAmount);

    toast.success(
      "Coupon Applied 🎉"
    );
  } catch (error) {
    console.error(error);
  }
};


  const handlePlaceOrder = async () => {

    const token = localStorage.getItem("token");

const authHeaders = {
  "Content-Type": "application/json",
  ...(token && {
    Authorization: `Bearer ${token}`,
  }),
};

    if (isPlacingOrder) return;

    
  
if (!validateShipping()) {
  toast.error("Please correct the highlighted fields.");
  return;
}
if (!sameAsShipping && !validatebilling()) {
  toast.error("Please correct the billing address.");
  return;
}

setIsPlacingOrder(true);


if (paymentMethod === "COD") {

  try {

    
    const response =
      await fetch(

        buyNowItem
        
        ? `${API}/orders/buy-now`
        
        : `${API}/orders`,
         {

        method:"POST",

        headers: authHeaders,

        body: JSON.stringify({

          shippingAddress,
        
          billingAddress:
            sameAsShipping
              ? shippingAddress
              : billingAddress,
        
          paymentMethod: "COD",
          finalAmount,
          couponCode,
          discount,

          guestItems: checkoutItems.map(
            (item) => ({
        
              productId:
                item.product._id,
        
              quantity:
                item.quantity,
        
            })
          ),
        
          productId: buyNowItem?.product?._id,
        
          variantId: buyNowItem?.variant?._id,
        
          quantity: buyNowItem?.quantity,
        
        })

      });

    const data =
      await response.json();

    if(data.success){

      clearCart();

      toast.success(
        "Order Placed Successfully"
      );

      navigate("/success", {
        state: {
          order: data.order,
        },
      });

      return;

    }

    toast.error(data.message);

setIsPlacingOrder(false);

return;

  }
  catch(error){

    console.log(error);
  
    setIsPlacingOrder(false);
  
  }

  return;

}

const res = await loadRazorpay();

if (!res) {

  toast.error("Razorpay SDK failed to load");

  setIsPlacingOrder(false);

  return;

}

    try {
      

      const response = await fetch(
        `${API}/orders/create-razorpay-order`,
        {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({

            shippingAddress,
          
            billingAddress:
              sameAsShipping
                ? shippingAddress
                : billingAddress,
          
            finalAmount,

            guestItems: checkoutItems.map(
              (item) => ({
          
                productId:
                  item.product._id,
          
                quantity:
                  item.quantity,
          
              })
            ),
          
            productId: buyNowItem?.product?._id,
          
            quantity: buyNowItem?.quantity,
          
          })
        }
      );

     

      const data = await response.json();

      if (!data.success) {

        toast.error(
          data.message ||
          "Unable to create payment order"
        );
      
        setIsPlacingOrder(false);
      
        return;
      }
      const options = {
  key:
    import.meta.env.VITE_RAZORPAY_KEY_ID,

  amount:
    data.order.amount,

  currency:
    data.order.currency,

  name:
    "SattViva",

  description:
    "Order Payment",

  order_id:
    data.order.id,

    handler: async function (response) {
      try {
        console.log(response);
    
        const orderResponse = await fetch(
          buyNowItem
            ? `${API}/orders/buy-now`
            : `${API}/orders`,
          {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify({
              shippingAddress,
    
              billingAddress: sameAsShipping
                ? shippingAddress
                : billingAddress,
    
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
    
              paymentMethod: "ONLINE",

              finalAmount,
              couponCode,
              discount,
    
              guestItems: checkoutItems.map((item) => ({
                productId: item.product._id,
                quantity: item.quantity,
              })),
    
              productId: buyNowItem?.product?._id,
              variantId: buyNowItem?.variant?._id,
              quantity: buyNowItem?.quantity,
            }),
          }
        );
    
        const orderData = await orderResponse.json();
    
        if (orderData.success) {
          clearCart();
    
          toast.success("Payment Successful 🎉");
          setIsPlacingOrder(false);
    
          navigate("/success", {
            state: {
              order: orderData.order,
            },
          });
        } else {
          toast.error(orderData.message);
    
          setIsPlacingOrder(false);
        }
      } catch (error) {
        console.error(error);
    
        setIsPlacingOrder(false);
    
        toast.error("Payment verification failed.");
      }
    },

  prefill: {
  name: shippingAddress.fullName,
  contact: shippingAddress.phone,
},

modal: {
  ondismiss: function () {
    console.log("Popup closed");

    setIsPlacingOrder(false);

    toast.info("Payment cancelled.");
  },

  escape: false,
  backdropclose: false,
},

  theme: {
    color: "#16a34a",
  },
};

console.log("OPTIONS =", options);
console.log(window.Razorpay);
console.log("Before Open");
const razorpay =
  new window.Razorpay(
    options

  );

  razorpay.on("payment.submit", function (response) {
  console.log("PAYMENT SUBMITTED");
  console.log(response);
});

razorpay.on("payment.failed", function (response) {
  console.log("PAYMENT FAILED");
  console.log(response.error);

  setIsPlacingOrder(false);

  toast.error(
    response.error.description || "Payment failed."
  );
});
razorpay.open();
console.log("After Open");

    } catch(error){

      console.error(error);
   
      setIsPlacingOrder(false);
   
   }
  };

  setTimeout(() => {
  console.log(document.querySelector("iframe"));
}, 2000);


if (checkoutItems.length === 0) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <h1 className="text-2xl font-bold">
        Your cart is empty 🛒
      </h1>
    </div>
  );
}


console.log({
  subtotal: checkoutItems.reduce(
    (sum, item) =>
      sum + item.product.price * item.quantity,
    0
  ),
  discount,
  finalAmount,
});
  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">
        Checkout
      </h1>

      <div className="grid md:grid-cols-2 gap-8">

        {/* Shipping Address */}

        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-xl font-bold mb-4">
            📦 Shipping Address
          </h2>

          <div className="space-y-3 mb-5">
  {addresses.map((address) => (
    <div
      key={address._id}
      className={`border rounded-lg p-3 cursor-pointer ${
        shippingAddress.address ===
        address.address
          ? "border-green-600"
          : ""
      }`}
      onClick={() =>
        setShippingAddress({
          fullName:
            address.fullName,

          email: address.email,
          
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
        })
      }
    >
      <div className="flex items-center gap-2">

        <strong>
          {address.nickname}
        </strong>

        {address.isDefault && (
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
            Default
          </span>
        )}
      </div>

      <p>
        {address.fullName}
      </p>

      <p>
        {address.address}
      </p>

      <p>
        {address.city},{" "}
        {address.state} -
        {address.pincode}
      </p>
    </div>
  ))}
</div>

          <input
            placeholder="Full Name"
            className="w-full border rounded-lg p-3 mb-3"
            value={shippingAddress.fullName}
            onChange={(e) => {
  setShippingAddress({
    ...shippingAddress,
    fullName: e.target.value.replace(/[^A-Za-z ]/g, ""),
  });
  setErrors((prev) => ({
    ...prev,
    fullName: "",
  }));
}}
          />
          {errors.fullName && (
  <p className="text-red-500 text-sm mt-1">
    {errors.fullName}
  </p>
)}
          <input
  type="email"
  placeholder="Email"
  className="w-full border rounded-lg p-3 mb-3"
  value={shippingAddress.email}
  onChange={(e) => {
    console.log("Email:", JSON.stringify(e.target.value));
    setShippingAddress({
      ...shippingAddress,
      email: e.target.value,
    });
    setErrors((prev) => ({
  ...prev,
  email: "",
}));
  }}
  
  
/>

{errors.email && (
  <p className="text-red-500 text-sm mt-1">
    {errors.email}
  </p>
)}
          <input
            placeholder="Phone Number"
            className="w-full border rounded-lg p-3 mb-3"
            value={shippingAddress.phone}
            onChange={(e)=>{
const value=e.target.value
.replace(/\D/g,"")
.slice(0,10);

setShippingAddress({
...shippingAddress,
phone:value,
});

setErrors(prev=>({
...prev,
phone:"",
}));
}}
          />
          {errors.phone && (
<p className="text-red-500 text-sm mt-1">
{errors.phone}
</p>
)}

          <textarea
            placeholder="Full Address"
            rows="3"
            className="w-full border rounded-lg p-3 mb-3"
            value={shippingAddress.address}
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                address: e.target.value,
              })
            }
          />

            <input
            placeholder="Pincode"
            className="w-full border rounded-lg p-3 mb-3"
            value={shippingAddress.pincode}
            onChange={(e)=>{

const value=e.target.value
.replace(/\D/g,"")
.slice(0,6);

setShippingAddress(prev=>({
...prev,
pincode:value,
}));

setErrors(prev=>({
...prev,
pincode:"",
}));

if(value.length===6){
fetchCityState(value);
}else{

setShippingAddress(prev=>({
...prev,
city:"",
state:"",
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

          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              placeholder="City"
              readOnly
className="border rounded-lg p-3 bg-gray-100"
              value={shippingAddress.city}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  city: e.target.value,
                })
              }
            />

            <input
              placeholder="State"
              readOnly
className="border rounded-lg p-3 bg-gray-100"
              value={shippingAddress.state}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  state: e.target.value,
                })
              }
            />
          </div>

        


          <div className="flex items-center gap-2 mt-5">
  <input
    type="checkbox"
    checked={sameAsShipping}
    onChange={(e) => {
      const checked = e.target.checked;

      setSameAsShipping(checked);

      if (checked) {
        setBillingAddress(shippingAddress);
      }
    }}
  />

  <label className="text-sm font-medium">
    Billing address is same as Shipping
  </label>
</div>

{!sameAsShipping && (

<div className="mt-8 border-t pt-6">

<h2 className="text-xl font-bold mb-4">
🧾 Billing Address
</h2>

<div className="space-y-3">

{addresses.map((address)=>(

<div
key={address._id}
className={`border rounded-lg p-3 cursor-pointer ${
billingAddress.address===address.address
? "border-blue-600"
: ""
}`}

onClick={()=>
setBillingAddress({
fullName:address.fullName,
email:address.email,
phone:address.phone,
address:address.address,
city:address.city,
state:address.state,
pincode:address.pincode,
})
}
>

<strong>{address.nickname}</strong>

<p>{address.fullName}</p>

<p>{address.address}</p>

<p>
{address.city},
{address.state}
-
{address.pincode}
</p>

</div>

))}

</div>

<div className="bg-white p-6 rounded-xl shadow border">
         

      

          <input
            placeholder="Full Name"
            className="w-full border rounded-lg p-3 mb-3"
            value={billingAddress.fullName}
            onChange={(e) => {
  setBillingAddress({
    ...billingAddress,
    fullName: e.target.value.replace(/[^A-Za-z ]/g, ""),
  });
  setBillingErrors((prev) => ({
    ...prev,
    fullName: "",
  }));
}}
          />
          {billingErrors.fullName && (
  <p className="text-red-500 text-sm mt-1">
    {billingErrors.fullName}
  </p>
)}
          <input
  type="email"
  placeholder="Email"
  className="w-full border rounded-lg p-3 mb-3"
  value={billingAddress.email}
  onChange={(e) => {
    setBillingAddress({
      ...billingAddress,
      email: e.target.value,
    });
    setBillingErrors((prev) => ({
  ...prev,
  email: "",
}));
  }}
  
  
/>

{billingErrors.email && (
  <p className="text-red-500 text-sm mt-1">
    {billingErrors.email}
  </p>
)}
          <input
            placeholder="Phone Number"
            className="w-full border rounded-lg p-3 mb-3"
            value={billingAddress.phone}
            onChange={(e)=>{
const value=e.target.value
.replace(/\D/g,"")
.slice(0,10);

setBillingAddress({
...billingAddress,
phone:value,
});

setBillingErrors(prev=>({
...prev,
phone:"",
}));
}}
          />
          {billingErrors.phone && (
<p className="text-red-500 text-sm mt-1">
{billingErrors.phone}
</p>
)}

          <textarea
            placeholder="Full Address"
            rows="3"
            className="w-full border rounded-lg p-3 mb-3"
            value={billingAddress.address}
            onChange={(e) =>
              setBillingAddress({
                ...billingAddress,
                address: e.target.value,
              })
            }
          />

            <input
            placeholder="Pincode"
            className="w-full border rounded-lg p-3 mb-3"
            value={billingAddress.pincode}
            onChange={(e)=>{

const value=e.target.value
.replace(/\D/g,"")
.slice(0,6);

setBillingAddress(prev=>({
...prev,
pincode:value,
}));

setBillingErrors(prev=>({
...prev,
pincode:"",
}));

if(value.length===6){
fetchBillingCityState(value)
}else{

setBillingAddress(prev=>({
...prev,
city:"",
state:"",
}));

}

}}
          />

           {
billingErrors.pincode && (
<p className="text-red-500 text-sm mt-1">
   {billingErrors.pincode}
</p>
)
}

          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              placeholder="City"
              readOnly
className="border rounded-lg p-3 bg-gray-100"
              value={billingAddress.city}
              onChange={(e) =>
                setBillingAddress({
                  ...billingAddress,
                  city: e.target.value,
                })
              }
            />

            <input
              placeholder="State"
              readOnly
className="border rounded-lg p-3 bg-gray-100"
              value={billingAddress.state}
              onChange={(e) =>
                setBillingAddress({
                  ...billingAddress,
                  state: e.target.value,
                })
              }
            />
          </div>

        




        </div>

</div>

)}


        </div>

        {/* Order Summary */}

        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-xl font-bold mb-4">
            🛒 Order Summary
          </h2>

          <div className="space-y-4">
            {checkoutItems.map((item) => (
              <div
              key={item.variant?._id || item.product._id}
                className="flex justify-between border-b pb-2"
              >
                <div className="flex items-center gap-3">
  <img
    src={item.product.image}
    alt={item.product.title}
    className="w-16 h-16 object-cover rounded-lg"
  />

  <div>
    <p className="font-medium">
      {item.product.title}
    </p>

    <p className="text-sm text-gray-500">
      Qty: {item.quantity}
    </p>
  </div>
</div>

                <div>
                <div>
  ₹{item.variant?.price ?? item.product.price}
</div>
                </div>
              </div>
            ))}
          </div>

<div className="space-y-3 mb-5">

  <h3 className="font-bold">
    🎉 Available Offers
  </h3>

  {visibleCoupons.map((coupon) => (
    <div
      key={coupon._id}
      className="border rounded-xl p-3 bg-green-50"
    >
      <div className="flex justify-between items-center">

        <div>
          <p className="font-bold text-green-700">
            {coupon.code}
          </p>

          <p className="text-sm text-gray-500">
            {coupon.discountValue}
            {coupon.discountType ===
            "percentage"
              ? "% OFF"
              : "₹ OFF"}

            {" "}above ₹
            {coupon.minimumAmount}
          </p>
        </div>

        <button
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
          onClick={() => {
            setCouponCode(coupon.code);

            if (appliedCoupon && appliedCoupon !== coupon.code) {
              setAppliedCoupon(null);
            }
          }}
        >
          Use
        </button>

      </div>
    </div>
  ))}

</div>
          <div className="mt-6">
  <input
    type="text"
    placeholder="Enter Coupon Code"
    value={couponCode}
    onChange={(e) => {
      const value = e.target.value;

      setCouponCode(value);

      if (appliedCoupon && appliedCoupon !== value.trim()) {
        setAppliedCoupon(null);
      }
    }}
    className="w-full border rounded-lg p-3"
  />

  <button
    onClick={applyCoupon}
    disabled={
      Boolean(appliedCoupon) &&
      appliedCoupon === couponCode.trim()
    }
    className="w-full mt-3 bg-orange-500 text-white py-3 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
  >
    {Boolean(appliedCoupon) &&
    appliedCoupon === couponCode.trim()
      ? "Coupon Applied ✓"
      : "Apply Coupon"}
  </button>
</div>


          <div className="space-y-3 mt-8">

  <div className="flex justify-between">
    <span>Subtotal</span>

    <span>
      ₹{
        checkoutItems.reduce(
          (sum, item) =>
            sum +
            item.product.price *
              item.quantity,
          0
        )
      }
    </span>
  </div>

  <div className="flex justify-between text-red-500">
    <span>Discount</span>

    <span>
      -₹{discount}
    </span>
  </div>

  <div className="border-t pt-3 flex justify-between text-2xl font-bold text-green-600">
    <span>Total</span>

    <span>
    ₹{finalAmount}
    </span>
  </div>

</div>


<div className="border rounded-xl p-4 mt-6">

<h3 className="font-bold mb-3">
Payment Method
</h3>

<label className="flex items-center gap-3 mb-3 cursor-pointer">

<input
type="radio"
value="ONLINE"
checked={paymentMethod==="ONLINE"}
onChange={(e)=>setPaymentMethod(e.target.value)}
/>

<span>Online Payment</span>

</label>

<label className="flex items-center gap-3 cursor-pointer">

<input
  type="radio"
  value="COD"
  checked={paymentMethod === "COD"}
  disabled={isCouponApplied}
  onChange={() => setPaymentMethod("COD")}
/>

{isCouponApplied && (
  <p className="text-red-500 text-sm mt-1">
    Coupons are valid only for prepaid orders.
  </p>
)}

<span>Cash on Delivery</span>

</label>

</div>

<button
  onClick={handlePlaceOrder}
  disabled={isPlacingOrder}
  className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
>
  {isPlacingOrder
    ? "Processing..."
    : "🚀 Place Order"}
</button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;