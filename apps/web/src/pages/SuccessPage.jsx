import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useLocation } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const SuccessPage = () => {
  const { clearCart } = useCart();

  const location = useLocation();

const initialOrder = location.state?.order;

const [order, setOrder] = useState(initialOrder);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  // The Shiprocket order/shipment IDs are created in the background
  // right after checkout responds (see createOrder / createBuyNowOrder
  // on the backend), so they may not be ready the instant this page
  // loads. Poll for them until they show up, then stop.
  useEffect(() => {
    if (!initialOrder?._id) return;

    if (
      initialOrder.shiprocketOrderId &&
      initialOrder.shiprocketShipmentId
    ) {
      return;
    }

    let attempts = 0;
    const maxAttempts = 10; // ~30s total at 3s intervals

    const intervalId = setInterval(async () => {
      attempts += 1;

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API}/orders/${initialOrder._id}`,
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : {},
          }
        );

        const data = await response.json();

        if (data.success) {
          setOrder((prev) => ({
            ...prev,
            ...data.order,
          }));

          if (
            data.order.shiprocketOrderId &&
            data.order.shiprocketShipmentId
          ) {
            clearInterval(intervalId);
          }
        }
      } catch (error) {
        console.error("Order status poll failed:", error);
      }

      if (attempts >= maxAttempts) {
        clearInterval(intervalId);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [initialOrder]);

  return (
    <>
      <Helmet>
        <title>Order Successful - SattViva Naturals</title>
        <meta name="description" content="Thank you for your order! Your journey to pure, traditional nutrition begins now." />
      </Helmet>

      <div className="min-h-[80vh] flex items-center justify-center bg-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>

            <h1 className="heading-font text-4xl md:text-5xl font-bold text-foreground mb-4">
              Order Successful
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Thank you for choosing SattViva Naturals. Your order has been confirmed and will be prepared with care. You will receive an email confirmation shortly.
            </p>

            {order && (
  <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">

    <h2 className="text-2xl font-bold text-green-700 mb-6">
      📦 Order Details
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">

      <div>
        <p className="text-gray-500 text-sm">Order ID</p>
        <p className="font-semibold">{order.orderId}</p>
      </div>

      <div>
        <p className="text-gray-500 text-sm">Payment Method</p>
        <p className="font-semibold">{order.paymentMethod}</p>
      </div>

      <div>
        <p className="text-gray-500 text-sm">Payment Status</p>
        <p className="font-semibold text-green-600">
          {order.paymentStatus}
        </p>
      </div>

      <div>
        <p className="text-gray-500 text-sm">Order Status</p>
        <p className="font-semibold">
          {order.orderStatus}
        </p>
      </div>

      <div>
        <p className="text-gray-500 text-sm">
          Shiprocket Order ID
        </p>
        <p className="font-semibold break-all">
          {order.shiprocketOrderId || "Generating..."}
        </p>
      </div>

      <div>
        <p className="text-gray-500 text-sm">
          Shipment ID
        </p>
        <p className="font-semibold break-all">
          {order.shiprocketShipmentId || "Generating..."}
        </p>
      </div>

      <div>
        <p className="text-gray-500 text-sm">
          Tracking Number
        </p>
        <p className="font-semibold">
          {order.awbCode || "Will be assigned soon"}
        </p>
      </div>

      <div>
        <p className="text-gray-500 text-sm">
          Total Paid
        </p>
        <p className="font-semibold text-green-600">
          ₹{order.totalAmount}
        </p>
      </div>

    </div>

  </div>
)}

            <div className="bg-muted rounded-xl p-8 mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Package className="h-6 w-6 text-primary" />
                <h2 className="heading-font text-2xl font-semibold text-foreground">
                  What Happens Next?
                </h2>
              </div>
              <ul className="text-left space-y-3 text-muted-foreground max-w-md mx-auto">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">1.</span>
                  <span>Your order will be freshly prepared in small batches</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">2.</span>
                  <span>We will send you tracking details via email</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">3.</span>
                  <span>Your products will arrive fresh at your doorstep</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/store">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Continue Shopping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/">
                <Button size="lg" variant="outline">
                  Back to Home
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SuccessPage;