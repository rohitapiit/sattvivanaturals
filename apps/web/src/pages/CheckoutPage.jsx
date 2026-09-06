import React, { useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;

const emptyAddress = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

// =====================================================
// FORMAT ADDRESS
// =====================================================

const formatAddress = (address = {}) => ({
  fullName: address.fullName || "",
  email: address.email || "",
  phone: address.phone || "",
  address: address.address || "",
  city: address.city || "",
  state: address.state || "",
  pincode: address.pincode || "",
});

// =====================================================
// REUSABLE ADDRESS FORM
// IMPORTANT:
// This component is outside CheckoutPage so inputs do not
// remount and lose focus whenever the parent re-renders.
// =====================================================

const AddressForm = ({
  address,
  setAddress,
  formErrors,
  setFormErrors,
  type,
  onPincodeLookup,
}) => {
  const handleChange = (field, value) => {
    setAddress((previousAddress) => ({
      ...previousAddress,
      [field]: value,
    }));

    if (formErrors[field]) {
      setFormErrors((previousErrors) => ({
        ...previousErrors,
        [field]: "",
      }));
    }
  };

  const handlePincodeChange = (event) => {
    const value = event.target.value
      .replace(/\D/g, "")
      .slice(0, 6);

    setAddress((previousAddress) => ({
      ...previousAddress,
      pincode: value,
      city:
        value.length < 6
          ? ""
          : previousAddress.city,
      state:
        value.length < 6
          ? ""
          : previousAddress.state,
    }));

    setFormErrors((previousErrors) => ({
      ...previousErrors,
      pincode: "",
      city: value.length < 6 ? "" : previousErrors.city,
      state: value.length < 6 ? "" : previousErrors.state,
    }));

    if (value.length === 6) {
      onPincodeLookup(value, type);
    }
  };

  return (
    <div className="space-y-4">
      {/* FULL NAME */}

      <div>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
          value={address.fullName}
          onChange={(event) => {
            const value = event.target.value.replace(
              /[^A-Za-z ]/g,
              ""
            );

            handleChange("fullName", value);
          }}
        />

        {formErrors.fullName && (
          <p className="text-red-500 text-sm mt-1">
            {formErrors.fullName}
          </p>
        )}
      </div>

      {/* EMAIL */}

      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
          value={address.email}
          onChange={(event) =>
            handleChange(
              "email",
              event.target.value
            )
          }
        />

        {formErrors.email && (
          <p className="text-red-500 text-sm mt-1">
            {formErrors.email}
          </p>
        )}
      </div>

      {/* PHONE */}

      <div>
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
          value={address.phone}
          inputMode="numeric"
          onChange={(event) => {
            const value = event.target.value
              .replace(/\D/g, "")
              .slice(0, 10);

            handleChange("phone", value);
          }}
        />

        {formErrors.phone && (
          <p className="text-red-500 text-sm mt-1">
            {formErrors.phone}
          </p>
        )}
      </div>

      {/* ADDRESS */}

      <div>
        <textarea
          name="address"
          rows={4}
          placeholder="Full Address"
          className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500 resize-none"
          value={address.address}
          onChange={(event) =>
            handleChange(
              "address",
              event.target.value
            )
          }
        />

        {formErrors.address && (
          <p className="text-red-500 text-sm mt-1">
            {formErrors.address}
          </p>
        )}
      </div>

      {/* PINCODE */}

      <div>
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          inputMode="numeric"
          className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
          value={address.pincode}
          onChange={handlePincodeChange}
        />

        {formErrors.pincode && (
          <p className="text-red-500 text-sm mt-1">
            {formErrors.pincode}
          </p>
        )}
      </div>

      {/* CITY + STATE */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <input
            type="text"
            placeholder="City"
            className="w-full border rounded-xl p-3 bg-gray-50 outline-none"
            value={address.city}
            onChange={(event) =>
              handleChange(
                "city",
                event.target.value
              )
            }
          />

          {formErrors.city && (
            <p className="text-red-500 text-sm mt-1">
              {formErrors.city}
            </p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="State"
            className="w-full border rounded-xl p-3 bg-gray-50 outline-none"
            value={address.state}
            onChange={(event) =>
              handleChange(
                "state",
                event.target.value
              )
            }
          />

          {formErrors.state && (
            <p className="text-red-500 text-sm mt-1">
              {formErrors.state}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// =====================================================
// CHECKOUT PAGE
// =====================================================

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const buyNowItem =
    location.state?.buyNowItem;

  const {
    cartItems,
    clearCart,
  } = useCart();

  const checkoutItems =
    buyNowItem
      ? [buyNowItem]
      : cartItems;

  const [
    isPlacingOrder,
    setIsPlacingOrder,
  ] = useState(false);

  const [
    addresses,
    setAddresses,
  ] = useState([]);

  const [
    selectedAddressId,
    setSelectedAddressId,
  ] = useState("");

  const [
    selectedBillingAddressId,
    setSelectedBillingAddressId,
  ] = useState("");

  const [
    visibleCoupons,
    setVisibleCoupons,
  ] = useState([]);

  const [
    shippingAddress,
    setShippingAddress,
  ] = useState({
    ...emptyAddress,
  });

  const [
    billingAddress,
    setBillingAddress,
  ] = useState({
    ...emptyAddress,
  });

  const [
    sameAsShipping,
    setSameAsShipping,
  ] = useState(true);

  const [
    couponCode,
    setCouponCode,
  ] = useState("");

  const [
    appliedCoupon,
    setAppliedCoupon,
  ] = useState(null);

  const [
    discount,
    setDiscount,
  ] = useState(0);

  const [
    finalAmount,
    setFinalAmount,
  ] = useState(0);

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState("ONLINE");

  const [
    errors,
    setErrors,
  ] = useState({});

  const [
    billingErrors,
    setBillingErrors,
  ] = useState({});

  const isCouponApplied =
    Boolean(appliedCoupon);

  // =====================================================
  // CALCULATE SUBTOTAL
  // =====================================================

  const subtotal = checkoutItems.reduce(
    (sum, item) => {
      const price =
        item.variant?.price ??
        item.product?.price ??
        0;

      return (
        sum +
        Number(price) *
          Number(item.quantity || 1)
      );
    },
    0
  );

  // =====================================================
  // FETCH PROFILE
  // =====================================================

  const fetchProfile = async () => {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) return;

      const response = await fetch(
        `${API}/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (data.success) {
        const email =
          data.user?.email || "";

        setShippingAddress((previous) => ({
          ...previous,
          email:
            previous.email || email,
        }));

        setBillingAddress((previous) => ({
          ...previous,
          email:
            previous.email || email,
        }));
      }
    } catch (error) {
      console.error(
        "Profile fetch error:",
        error
      );
    }
  };

  // =====================================================
  // FETCH ADDRESSES
  // =====================================================

  const fetchAddresses = async () => {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) return;

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

      if (!data.success) return;

      const addressList =
        data.addresses || [];

      setAddresses(addressList);

      if (!addressList.length) {
        return;
      }

      const defaultAddress =
        addressList.find(
          (address) =>
            address.isDefault
        ) || addressList[0];

      const formattedAddress =
        formatAddress(defaultAddress);

      setSelectedAddressId(
        defaultAddress._id
      );

      setSelectedBillingAddressId(
        defaultAddress._id
      );

      setShippingAddress(
        formattedAddress
      );

      setBillingAddress(
        formattedAddress
      );
    } catch (error) {
      console.error(
        "Address fetch error:",
        error
      );
    }
  };

  // =====================================================
  // FETCH COUPONS
  // =====================================================

  const fetchCoupons = async () => {
    try {
      const response = await fetch(
        `${API}/coupons`
      );

      const data =
        await response.json();

      if (data.success) {
        setVisibleCoupons(
          data.coupons || []
        );
      }
    } catch (error) {
      console.error(
        "Coupon fetch error:",
        error
      );
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (token) {
      fetchProfile();
      fetchAddresses();
    }

    fetchCoupons();
  }, []);

  // =====================================================
  // SYNC BILLING ADDRESS
  // =====================================================

  useEffect(() => {
    if (sameAsShipping) {
      setBillingAddress({
        ...shippingAddress,
      });

      setSelectedBillingAddressId(
        selectedAddressId
      );
    }
  }, [
    shippingAddress,
    sameAsShipping,
    selectedAddressId,
  ]);

  // =====================================================
  // CALCULATE TOTAL
  // =====================================================

  useEffect(() => {
    if (!appliedCoupon) {
      setDiscount(0);
      setFinalAmount(subtotal);
      return;
    }

    const coupon =
      visibleCoupons.find(
        (item) =>
          item.code.toUpperCase() ===
          appliedCoupon.toUpperCase()
      );

    if (!coupon) {
      setDiscount(0);
      setFinalAmount(subtotal);
      return;
    }

    let newDiscount = 0;

    if (
      coupon.discountType ===
      "percentage"
    ) {
      newDiscount =
        (subtotal *
          Number(coupon.discountValue)) /
        100;
    } else {
      newDiscount =
        Number(coupon.discountValue);
    }

    newDiscount = Math.min(
      newDiscount,
      subtotal
    );

    setDiscount(newDiscount);

    setFinalAmount(
      subtotal - newDiscount
    );
  }, [
    subtotal,
    appliedCoupon,
    visibleCoupons,
  ]);

  // =====================================================
  // FORCE ONLINE PAYMENT FOR COUPON
  // =====================================================

  useEffect(() => {
    if (appliedCoupon) {
      setPaymentMethod("ONLINE");
    }
  }, [appliedCoupon]);

  // =====================================================
  // SHIPPING ADDRESS SELECT
  // =====================================================

  const handleAddressSelect = (
    addressId
  ) => {
    setSelectedAddressId(addressId);

    const selected =
      addresses.find(
        (address) =>
          address._id === addressId
      );

    if (!selected) return;

    setShippingAddress(
      formatAddress(selected)
    );
  };

  // =====================================================
  // BILLING ADDRESS SELECT
  // =====================================================

  const handleBillingAddressSelect = (
    addressId
  ) => {
    setSelectedBillingAddressId(
      addressId
    );

    const selected =
      addresses.find(
        (address) =>
          address._id === addressId
      );

    if (!selected) return;

    setBillingAddress(
      formatAddress(selected)
    );
  };

  // =====================================================
  // PINCODE LOOKUP
  // =====================================================

  const fetchCityState = async (
    pincode,
    type = "shipping"
  ) => {
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );

      const data =
        await response.json();

      if (
        data?.[0]?.Status === "Success" &&
        data?.[0]?.PostOffice?.length
      ) {
        const office =
          data[0].PostOffice[0];

        const setter =
          type === "shipping"
            ? setShippingAddress
            : setBillingAddress;

        const errorSetter =
          type === "shipping"
            ? setErrors
            : setBillingErrors;

        setter((previous) => ({
          ...previous,
          city:
            office.District || "",
          state:
            office.State || "",
        }));

        errorSetter((previous) => ({
          ...previous,
          pincode: "",
          city: "",
          state: "",
        }));
      } else {
        const errorSetter =
          type === "shipping"
            ? setErrors
            : setBillingErrors;

        errorSetter((previous) => ({
          ...previous,
          pincode:
            "Invalid pincode",
        }));
      }
    } catch (error) {
      console.error(
        "Pincode lookup error:",
        error
      );
    }
  };

  // =====================================================
  // VALIDATE ADDRESS
  // =====================================================

  const validateAddress = (
    address,
    setErrorState
  ) => {
    const newErrors = {};

    if (!address.fullName.trim()) {
      newErrors.fullName =
        "Full Name is required";
    }

    if (
      !/^\S+@\S+\.\S+$/.test(
        address.email
      )
    ) {
      newErrors.email =
        "Enter a valid email";
    }

    if (
      !/^\d{10}$/.test(
        address.phone
      )
    ) {
      newErrors.phone =
        "Enter a valid 10-digit phone number";
    }

    if (!address.address.trim()) {
      newErrors.address =
        "Address is required";
    }

    if (!address.city.trim()) {
      newErrors.city =
        "City is required";
    }

    if (!address.state.trim()) {
      newErrors.state =
        "State is required";
    }

    if (
      !/^\d{6}$/.test(
        address.pincode
      )
    ) {
      newErrors.pincode =
        "Enter a valid 6-digit pincode";
    }

    setErrorState(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // =====================================================
  // COUPON CHANGE
  // =====================================================

  const handleCouponCodeChange = (
    value
  ) => {
    setCouponCode(value);

    if (
      appliedCoupon &&
      appliedCoupon !==
        value.trim().toUpperCase()
    ) {
      setAppliedCoupon(null);
      setDiscount(0);
      setFinalAmount(subtotal);
    }
  };

  // =====================================================
  // APPLY COUPON
  // =====================================================

  const applyCoupon = async () => {
    const trimmedCode =
      couponCode.trim().toUpperCase();

    if (!trimmedCode) {
      toast.error(
        "Please enter a coupon code"
      );

      return;
    }

    try {
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
            amount: subtotal,
          }),
        }
      );

      const data =
        await response.json();

      if (!data.success) {
        toast.error(
          data.message ||
            "Invalid coupon"
        );

        return;
      }

      setCouponCode(trimmedCode);
      setAppliedCoupon(trimmedCode);

      setDiscount(
        Number(data.discount) || 0
      );

      setFinalAmount(
        Number(data.finalAmount) ||
          subtotal
      );

      setPaymentMethod("ONLINE");

      toast.success(
        "Coupon Applied 🎉"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Unable to apply coupon"
      );
    }
  };

  // =====================================================
  // REMOVE COUPON
  // =====================================================

  const removeCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setDiscount(0);
    setFinalAmount(subtotal);
  };

  // =====================================================
  // LOAD RAZORPAY
  // =====================================================

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const existingScript =
        document.querySelector(
          'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
        );

      if (existingScript) {
        existingScript.onload = () =>
          resolve(true);

        return;
      }

      const script =
        document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () =>
        resolve(true);

      script.onerror = () =>
        resolve(false);

      document.body.appendChild(
        script
      );
    });
  };

  // =====================================================
  // PLACE ORDER
  // =====================================================

  const handlePlaceOrder = async () => {
    if (isPlacingOrder) return;

    const isShippingValid =
      validateAddress(
        shippingAddress,
        setErrors
      );

    if (!isShippingValid) {
      toast.error(
        "Please correct the shipping address."
      );

      return;
    }

    if (!sameAsShipping) {
      const isBillingValid =
        validateAddress(
          billingAddress,
          setBillingErrors
        );

      if (!isBillingValid) {
        toast.error(
          "Please correct the billing address."
        );

        return;
      }
    }

    setIsPlacingOrder(true);

    const token =
      localStorage.getItem("token");

    const authHeaders = {
      "Content-Type":
        "application/json",

      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    };

    const orderItems =
      checkoutItems.map((item) => ({
        productId:
          item.product?._id,

        variantId:
          item.variant?._id,

        quantity:
          item.quantity || 1,
      }));

    const orderPayload = {
      shippingAddress,

      billingAddress:
        sameAsShipping
          ? shippingAddress
          : billingAddress,

      paymentMethod,

      finalAmount,

      couponCode:
        appliedCoupon || "",

      discount,

      guestItems:
        orderItems,

      productId:
        buyNowItem?.product?._id,

      variantId:
        buyNowItem?.variant?._id,

      quantity:
        buyNowItem?.quantity,
    };

    // ===================================================
    // CASH ON DELIVERY
    // ===================================================

    if (paymentMethod === "COD") {
      try {
        const endpoint =
          buyNowItem
            ? `${API}/orders/buy-now`
            : `${API}/orders`;

        const response =
          await fetch(
            endpoint,
            {
              method: "POST",
              headers:
                authHeaders,
              body:
                JSON.stringify({
                  ...orderPayload,
                  paymentMethod:
                    "COD",
                }),
            }
          );

        const data =
          await response.json();

        if (!data.success) {
          toast.error(
            data.message ||
              "Unable to place order"
          );

          setIsPlacingOrder(false);

          return;
        }

        if (!buyNowItem) {
          clearCart();
        }

        toast.success(
          "Order Placed Successfully 🎉"
        );

        navigate(
          "/success",
          {
            state: {
              order:
                data.order,
            },
          }
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Unable to place order"
        );

        setIsPlacingOrder(false);
      }

      return;
    }

    // ===================================================
    // RAZORPAY
    // ===================================================

    const razorpayLoaded =
      await loadRazorpay();

    if (!razorpayLoaded) {
      toast.error(
        "Razorpay failed to load"
      );

      setIsPlacingOrder(false);

      return;
    }

    try {
      const response =
        await fetch(
          `${API}/orders/create-razorpay-order`,
          {
            method: "POST",

            headers:
              authHeaders,

            body:
              JSON.stringify(
                orderPayload
              ),
          }
        );

      const data =
        await response.json();

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
          import.meta.env
            .VITE_RAZORPAY_KEY_ID,

        amount:
          data.order.amount,

        currency:
          data.order.currency,

        name:
          "SattViva Naturals",

        description:
          "Order Payment",

        order_id:
          data.order.id,

        prefill: {
          name:
            shippingAddress.fullName,

          email:
            shippingAddress.email,

          contact:
            shippingAddress.phone,
        },

        handler:
          async (
            razorpayResponse
          ) => {
            try {
              const endpoint =
                buyNowItem
                  ? `${API}/orders/buy-now`
                  : `${API}/orders`;

              const orderResponse =
                await fetch(
                  endpoint,
                  {
                    method:
                      "POST",

                    headers:
                      authHeaders,

                    body:
                      JSON.stringify({
                        ...orderPayload,

                        paymentMethod:
                          "ONLINE",

                        razorpayOrderId:
                          razorpayResponse
                            .razorpay_order_id,

                        razorpayPaymentId:
                          razorpayResponse
                            .razorpay_payment_id,
                      }),
                  }
                );

              const orderData =
                await orderResponse.json();

              if (
                !orderData.success
              ) {
                toast.error(
                  orderData.message ||
                    "Order creation failed"
                );

                setIsPlacingOrder(
                  false
                );

                return;
              }

              if (!buyNowItem) {
                clearCart();
              }

              toast.success(
                "Payment Successful 🎉"
              );

              navigate(
                "/success",
                {
                  state: {
                    order:
                      orderData.order,
                  },
                }
              );
            } catch (error) {
              console.error(error);

              toast.error(
                "Payment verification failed"
              );

              setIsPlacingOrder(
                false
              );
            }
          },

        modal: {
          ondismiss: () => {
            setIsPlacingOrder(
              false
            );
          },
        },

        theme: {
          color: "#16a34a",
        },
      };

      const razorpay =
        new window.Razorpay(
          options
        );

      razorpay.on(
        "payment.failed",
        (response) => {
          console.error(
            response.error
          );

          toast.error(
            response.error
              ?.description ||
              "Payment failed"
          );

          setIsPlacingOrder(
            false
          );
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(error);

      toast.error(
        "Unable to start payment"
      );

      setIsPlacingOrder(false);
    }
  };

  // =====================================================
  // EMPTY CART
  // =====================================================

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Your cart is empty 🛒
          </h1>

          <button
            onClick={() =>
              navigate("/products")
            }
            className="mt-5 bg-green-600 text-white px-6 py-3 rounded-xl"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="bg-gray-50 min-h-screen">
      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          md:px-6
          lg:px-8
          py-6
          md:py-10
          pb-[180px]
          md:pb-10
        "
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-8">
          Checkout
        </h1>

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-[minmax(0,1fr)_420px]
            gap-8
            items-start
          "
        >
          {/* ============================================= */}
          {/* LEFT SIDE */}
          {/* ============================================= */}

          <div className="space-y-6">
            {/* SHIPPING ADDRESS */}

            <div className="bg-white rounded-2xl shadow-sm border p-5 md:p-6">
              <h2 className="text-xl font-bold mb-5">
                📦 Shipping Address
              </h2>

              {addresses.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">
                    Select Saved Address
                  </label>

                  <select
                    value={
                      selectedAddressId
                    }
                    onChange={(event) =>
                      handleAddressSelect(
                        event.target.value
                      )
                    }
                    className="
                      w-full
                      border
                      rounded-xl
                      p-3
                      bg-white
                      outline-none
                      focus:ring-2
                      focus:ring-green-500
                    "
                  >
                    {addresses.map(
                      (address) => (
                        <option
                          key={
                            address._id
                          }
                          value={
                            address._id
                          }
                        >
                          {address.nickname ||
                            "Address"}{" "}
                          —{" "}
                          {
                            address.fullName
                          }
                          {address.isDefault
                            ? " (Default)"
                            : ""}
                        </option>
                      )
                    )}
                  </select>

                  {selectedAddressId && (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-4 text-sm">
                      <p className="font-bold">
                        {
                          shippingAddress.fullName
                        }
                      </p>

                      <p>
                        {
                          shippingAddress.address
                        }
                      </p>

                      <p>
                        {
                          shippingAddress.city
                        }
                        ,{" "}
                        {
                          shippingAddress.state
                        }{" "}
                        -{" "}
                        {
                          shippingAddress.pincode
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}

              <AddressForm
                address={
                  shippingAddress
                }
                setAddress={
                  setShippingAddress
                }
                formErrors={
                  errors
                }
                setFormErrors={
                  setErrors
                }
                type="shipping"
                onPincodeLookup={
                  fetchCityState
                }
              />

              <label className="flex items-center gap-3 mt-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    sameAsShipping
                  }
                  onChange={(event) =>
                    setSameAsShipping(
                      event.target.checked
                    )
                  }
                />

                <span className="font-medium">
                  Billing address is same as
                  shipping address
                </span>
              </label>
            </div>

            {/* BILLING ADDRESS */}

            {!sameAsShipping && (
              <div className="bg-white rounded-2xl shadow-sm border p-5 md:p-6">
                <h2 className="text-xl font-bold mb-5">
                  🧾 Billing Address
                </h2>

                {addresses.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2">
                      Select Saved Address
                    </label>

                    <select
                      value={
                        selectedBillingAddressId
                      }
                      onChange={(event) =>
                        handleBillingAddressSelect(
                          event.target.value
                        )
                      }
                      className="
                        w-full
                        border
                        rounded-xl
                        p-3
                        bg-white
                        outline-none
                        focus:ring-2
                        focus:ring-green-500
                      "
                    >
                      {addresses.map(
                        (address) => (
                          <option
                            key={
                              address._id
                            }
                            value={
                              address._id
                            }
                          >
                            {address.nickname ||
                              "Address"}{" "}
                            —{" "}
                            {
                              address.fullName
                            }
                            {address.isDefault
                              ? " (Default)"
                              : ""}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                )}

                <AddressForm
                  address={
                    billingAddress
                  }
                  setAddress={
                    setBillingAddress
                  }
                  formErrors={
                    billingErrors
                  }
                  setFormErrors={
                    setBillingErrors
                  }
                  type="billing"
                  onPincodeLookup={
                    fetchCityState
                  }
                />
              </div>
            )}
          </div>

          {/* ============================================= */}
          {/* RIGHT SIDE */}
          {/* ============================================= */}

          <div
            className="
              lg:sticky
              lg:top-6
              lg:max-h-[calc(100vh-48px)]
              lg:overflow-y-auto
              bg-white
              rounded-2xl
              shadow-sm
              border
              p-5
              md:p-6
            "
          >
            <h2 className="text-xl font-bold mb-5">
              🛒 Order Summary
            </h2>

            {/* PRODUCTS */}

            <div className="space-y-4">
              {checkoutItems.map(
                (item, index) => {
                  const price =
                    item.variant?.price ??
                    item.product?.price ??
                    0;

                  return (
                    <div
                      key={
                        item.variant?._id ||
                        item.product?._id ||
                        index
                      }
                      className="flex gap-3 border-b pb-4"
                    >
                      <img
                        src={
                          item.product?.image
                        }
                        alt={
                          item.product?.title
                        }
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold line-clamp-2">
                          {
                            item.product?.title
                          }
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          Qty:{" "}
                          {
                            item.quantity
                          }
                        </p>

                        <p className="font-bold text-green-700 mt-1">
                          ₹{price}
                        </p>
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {/* AVAILABLE COUPONS */}

            {visibleCoupons.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold mb-3">
                  🎉 Available Offers
                </h3>

                <div className="space-y-3">
                  {visibleCoupons.map(
                    (coupon) => (
                      <div
                        key={
                          coupon._id
                        }
                        className="border rounded-xl p-3 bg-green-50"
                      >
                        <div className="flex justify-between gap-3">
                          <div>
                            <p className="font-bold text-green-700">
                              {
                                coupon.code
                              }
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              {
                                coupon.discountValue
                              }
                              {coupon.discountType ===
                              "percentage"
                                ? "% OFF"
                                : "₹ OFF"}

                              {" "}above ₹
                              {
                                coupon.minimumAmount
                              }
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setCouponCode(
                                coupon.code
                              )
                            }
                            className="text-sm bg-green-600 text-white px-3 py-2 rounded-lg h-fit"
                          >
                            Use
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* COUPON INPUT */}

            <div className="mt-6">
              <input
                type="text"
                placeholder="Enter Coupon Code"
                value={
                  couponCode
                }
                onChange={(event) =>
                  handleCouponCodeChange(
                    event.target.value
                  )
                }
                className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
              />

              <div className="flex gap-3 mt-3">
                <button
                  type="button"
                  onClick={
                    applyCoupon
                  }
                  disabled={
                    isCouponApplied &&
                    appliedCoupon ===
                      couponCode.trim()
                        .toUpperCase()
                  }
                  className="
                    flex-1
                    bg-orange-500
                    text-white
                    py-3
                    rounded-xl
                    font-medium
                    disabled:bg-gray-400
                  "
                >
                  {isCouponApplied &&
                  appliedCoupon ===
                    couponCode.trim()
                      .toUpperCase()
                    ? "Applied ✓"
                    : "Apply Coupon"}
                </button>

                {isCouponApplied && (
                  <button
                    type="button"
                    onClick={
                      removeCoupon
                    }
                    className="
                      px-4
                      py-3
                      border
                      border-red-500
                      text-red-500
                      rounded-xl
                    "
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* TOTAL */}

            <div className="space-y-3 mt-6 border-t pt-5">
              <div className="flex justify-between">
                <span>
                  Subtotal
                </span>

                <span>
                  ₹{subtotal}
                </span>
              </div>

              <div className="flex justify-between text-red-500">
                <span>
                  Discount
                </span>

                <span>
                  -₹{discount}
                </span>
              </div>

              <div className="border-t pt-4 flex justify-between text-xl font-bold">
                <span>
                  Total
                </span>

                <span className="text-green-600">
                  ₹{finalAmount}
                </span>
              </div>
            </div>

            {/* PAYMENT METHOD */}

            <div className="border rounded-xl p-4 mt-6">
              <h3 className="font-bold mb-4">
                Payment Method
              </h3>

              <label className="flex items-center gap-3 mb-4 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ONLINE"
                  checked={
                    paymentMethod ===
                    "ONLINE"
                  }
                  onChange={() =>
                    setPaymentMethod(
                      "ONLINE"
                    )
                  }
                />

                <span>
                  Online Payment
                </span>
              </label>

              <label
                className={`flex items-center gap-3 cursor-pointer ${
                  isCouponApplied
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={
                    paymentMethod ===
                    "COD"
                  }
                  disabled={
                    isCouponApplied
                  }
                  onChange={() =>
                    setPaymentMethod(
                      "COD"
                    )
                  }
                />

                <span>
                  Cash on Delivery
                </span>
              </label>

              {isCouponApplied && (
                <p className="text-red-500 text-xs mt-3">
                  Coupons are valid only
                  for prepaid orders.
                </p>
              )}
            </div>

            {/* DESKTOP BUTTON */}

            <button
              type="button"
              onClick={
                handlePlaceOrder
              }
              disabled={
                isPlacingOrder
              }
              className="
                hidden
                lg:block
                w-full
                mt-6
                bg-green-600
                hover:bg-green-700
                text-white
                py-4
                rounded-xl
                font-bold
                shadow-lg
                disabled:bg-gray-400
                disabled:cursor-not-allowed
              "
            >
              {isPlacingOrder
                ? "Processing..."
                : `🚀 Place Order • ₹${finalAmount}`}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE FIXED BUTTON */}

      <div
        className="
          fixed
          bottom-[72px]
          left-0
          right-0
          z-40
          lg:hidden
          bg-white
          border-t
          shadow-[0_-8px_30px_rgba(0,0,0,0.08)]
          p-4
        "
      >
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">
              Total
            </span>

            <span className="text-xl font-bold text-green-600">
              ₹{finalAmount}
            </span>
          </div>

          <button
            type="button"
            onClick={
              handlePlaceOrder
            }
            disabled={
              isPlacingOrder
            }
            className="
              flex-1
              bg-green-600
              hover:bg-green-700
              text-white
              py-4
              rounded-xl
              font-bold
              disabled:bg-gray-400
              disabled:cursor-not-allowed
            "
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