import React, {
  useEffect,
  useState,
} from "react";

import {
  Route,
  Routes,
  BrowserRouter as Router,
  useLocation,
} from "react-router-dom";

import {
  CartProvider,
} from "@/hooks/useCart";

import ScrollToTop from "@/components/ScrollToTop.jsx";
import DashboardLayout from "@/components/DashboardLayout.jsx";
import ShoppingCart from "@/components/ShoppingCart.jsx";

// Pages
import HomePage from "@/pages/HomePage.jsx";
import OurStoryPage from "@/pages/OurStoryPage.jsx";
import LabReportsPage from "@/pages/LabReportsPage.jsx";
import LoginPage from "@/pages/LoginPage.jsx";
import RegisterPage from "@/pages/RegisterPage.jsx";
import MyOrdersPage from "@/pages/MyOrdersPage.jsx";
import AdminOrdersPage from "@/pages/AdminOrdersPage.jsx";
import AdminProductsPage from "@/pages/AdminProductsPage.jsx";
import AdminRoute from "@/components/AdminRoute";
import CheckoutPage from "@/pages/CheckoutPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import MyAddressesPage from "@/pages/MyAddressesPage";
import ProfilePage from "@/pages/ProfilePage";
import AdminCouponsPage from "@/pages/AdminCouponsPage";
import ContactPage from "@/pages/ContactPage";
import ComingSoonPage from "@/pages/ComingSoonPage";
import TermsPage from "@/pages/TermsPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import MyReviewsPage from "@/pages/MyReviewsPage";
import ReviewEmailPage from "@/pages/ReviewEmailPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "@/pages/ResetPasswordPage.jsx";
import ProductCatalog from "@/pages/ProductCatalog.jsx";
import ProductDetailPage from "@/pages/ProductDetailPage.jsx";
import SuccessPage from "@/pages/SuccessPage.jsx";
import AdminContactPage from "./pages/AdminContactPage";
import KnowYourFacilityPage from "./pages/KnowYourFacilityPage";
import GuestReviewPage from "@/pages/GuestReviewPage";
import BannerManagementPage from "@/pages/BannerManagementPage";
import AbandonedCartsPage from "@/pages/AbandonedCartsPage.jsx";

// ==========================================
// APP CONTENT
// This component is inside Router,
// so useLocation() works correctly.
// ==========================================

function AppContent() {
  const location = useLocation();

  const [
    isCartOpen,
    setIsCartOpen,
  ] = useState(false);

  // ==========================================
  // CLOSE CART AUTOMATICALLY
  // WHEN USER CHANGES PAGE
  // ==========================================

  useEffect(() => {
    setIsCartOpen(false);
  }, [location.pathname]);

  // ==========================================
  // OPEN CART
  // ==========================================

  const handleCartOpen = () => {
    setIsCartOpen(true);
  };

  // ==========================================
  // CLOSE CART
  // ==========================================

  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  return (
    <>
      <ScrollToTop />

      <DashboardLayout
        onCartOpen={handleCartOpen}
      >
        <ShoppingCart
          isCartOpen={isCartOpen}
          setIsCartOpen={setIsCartOpen}
        />

        {/* MOBILE BOTTOM SPACING */}
        <div className="pb-[72px] md:pb-0">

          <Routes>

            {/* ================= HOME ================= */}

            <Route
              path="/"
              element={<HomePage />}
            />

            {/* ================= OUR STORY ================= */}

            <Route
              path="/our-story"
              element={<OurStoryPage />}
            />

            {/* ================= LAB REPORTS ================= */}

            <Route
              path="/lab-reports"
              element={<LabReportsPage />}
            />

            {/* ================= FACILITY ================= */}

            <Route
              path="/know-your-facility"
              element={
                <KnowYourFacilityPage />
              }
            />

            {/* ================= PRODUCTS ================= */}

            <Route
              path="/products"
              element={
                <ProductCatalog />
              }
            />

            <Route
              path="/products/:category"
              element={
                <ProductCatalog />
              }
            />

            <Route
              path="/products/:category/:subCategory"
              element={
                <ProductCatalog />
              }
            />

            {/* ================= PRODUCT DETAIL ================= */}

            <Route
              path="/product/:id"
              element={
                <ProductDetailPage />
              }
            />

            {/* ================= SUCCESS ================= */}

            <Route
              path="/success"
              element={<SuccessPage />}
            />

            {/* ================= AUTH ================= */}

            <Route
              path="/login"
              element={<LoginPage />}
            />

            <Route
              path="/register"
              element={<RegisterPage />}
            />

            <Route
              path="/forgot-password"
              element={
                <ForgotPasswordPage />
              }
            />

            <Route
              path="/reset-password"
              element={
                <ResetPasswordPage />
              }
            />

            {/* ================= CONTACT ================= */}

            <Route
              path="/contact"
              element={<ContactPage />}
            />

            <Route
              path="/admin-contacts"
              element={
                <AdminContactPage />
              }
            />

            {/* ================= LEGAL ================= */}

            <Route
              path="/terms"
              element={<TermsPage />}
            />

            <Route
              path="/privacy"
              element={
                <PrivacyPolicyPage />
              }
            />

            {/* ================= ADDRESSES ================= */}

            <Route
              path="/addresses"
              element={
                <ProtectedRoute>
                  <MyAddressesPage />
                </ProtectedRoute>
              }
            />

            {/* ================= PROFILE ================= */}

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* ================= MY ORDERS ================= */}

            <Route
              path="/my-orders"
              element={
                <ProtectedRoute>
                  <MyOrdersPage />
                </ProtectedRoute>
              }
            />

            {/* ================= CHECKOUT ================= */}

            <Route
              path="/checkout"
              element={
                <CheckoutPage />
              }
            />

            {/* ================= REVIEWS ================= */}

            <Route
              path="/my-reviews"
              element={
                <MyReviewsPage />
              }
            />

            <Route
              path="/guest-review/:token"
              element={
                <GuestReviewPage />
              }
            />

            <Route
              path="/review/:token"
              element={
                <GuestReviewPage />
              }
            />

            <Route
              path="/review/:orderId/:productId"
              element={
                <ProtectedRoute>
                  <GuestReviewPage />
                </ProtectedRoute>
              }
            />

            {/* ================= COMING SOON ================= */}

            <Route
              path="/coming-soon"
              element={
                <ComingSoonPage />
              }
            />

            {/* ================= ADMIN ================= */}

            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <AdminOrdersPage />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/abandoned-carts"
              element={
                <AdminRoute>
                  <AbandonedCartsPage />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <AdminProductsPage />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/coupons"
              element={
                <AdminRoute>
                  <AdminCouponsPage />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/review-emails"
              element={
                <ReviewEmailPage />
              }
            />

            <Route
              path="/admin/banners"
              element={
                <BannerManagementPage />
              }
            />

            {/* ================= 404 ================= */}

            <Route
              path="*"
              element={
                <div className="min-h-[60vh] flex items-center justify-center bg-background">
                  <div className="text-center px-4">

                    <h1 className="heading-font text-5xl font-bold text-primary mb-4">
                      Page Not Found
                    </h1>

                    <p className="text-muted-foreground text-lg mb-8 font-light">
                      The page you are looking for does not exist or has been moved.
                    </p>

                    <a
                      href="/"
                      className="
                        inline-block
                        bg-secondary
                        text-secondary-foreground
                        px-8
                        py-3
                        rounded-full
                        tracking-wide
                        font-semibold
                        hover:bg-secondary/90
                        transition-colors
                        shadow-md
                      "
                    >
                      Return to Home
                    </a>

                  </div>
                </div>
              }
            />

          </Routes>

        </div>
      </DashboardLayout>
    </>
  );
}

// ==========================================
// MAIN APP
// ==========================================

function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}

export default App;