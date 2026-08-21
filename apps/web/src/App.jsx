import React, { useState } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { CartProvider } from '@/hooks/useCart';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import ShoppingCart from '@/components/ShoppingCart.jsx';


// Pages
import HomePage from '@/pages/HomePage.jsx';
import OurStoryPage from '@/pages/OurStoryPage.jsx';
import LabReportsPage from '@/pages/LabReportsPage.jsx';
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



import ForgotPasswordPage from "@/pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "@/pages/ResetPasswordPage.jsx";

import StorePage from '@/pages/StorePage.jsx';
import ProductCatalog from '@/pages/ProductCatalog.jsx';
import ProductDetailPage from '@/pages/ProductDetailPage.jsx';
import SuccessPage from '@/pages/SuccessPage.jsx';
import AdminContactPage from "./pages/AdminContactPage";

import KnowYourFacilityPage from "./pages/KnowYourFacilityPage";
import GuestReviewPage from "@/pages/GuestReviewPage";

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (

  
    <CartProvider>
      <Router>
        <ScrollToTop />
        
        <DashboardLayout onCartOpen={() => setIsCartOpen(true)}>
          <ShoppingCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />

          
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/our-story" element={<OurStoryPage />} />
            <Route path="/lab-reports" element={<LabReportsPage />} />
            <Route
  path="/know-your-facility"
  element={<KnowYourFacilityPage />}
/>
            
            
            <Route path="/products" element={<ProductCatalog />} />
            <Route path="/products/:category" element={<ProductCatalog />}/>

            <Route path="/products/:category/:subCategory" element={<ProductCatalog />}/>
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin-contacts" element={<AdminContactPage />}/>
            <Route path="/terms" element={<TermsPage />} />


            <Route path="/addresses" element={<ProtectedRoute><MyAddressesPage /></ProtectedRoute>}/>
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}/>
            <Route path="/admin/coupons" element={<AdminRoute><AdminCouponsPage /></AdminRoute>}/>
            <Route path="/store" element={<ProductCatalog />}/>
            <Route path="/privacy" element={<PrivacyPolicyPage />} />

            <Route path="/my-reviews" element={<MyReviewsPage />}/>
            {/* <Route path="/guest-review" element={<GuestReviewPage />}/> */}
            <Route
  path="/guest-review/:token"
  element={<GuestReviewPage />}
/>

<Route
  path="/review/:token"
  element={<GuestReviewPage />}
/>

<Route
  path="/review/:orderId/:productId"
  element={
    <ProtectedRoute>
      <GuestReviewPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/coming-soon"
  element={<ComingSoonPage />}
/>
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>}/>       
                 <Route path="/my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>}/>   
                 <Route path="/checkout" element={<CheckoutPage />}/>
            <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>}/>          
              <Route path="*" element={
                
              <div className="min-h-[60vh] flex items-center justify-center bg-background">
                <div className="text-center px-4">
                  <h1 className="heading-font text-5xl font-bold text-primary mb-4">Page Not Found</h1>
                  <p className="text-muted-foreground text-lg mb-8 font-light">The page you are looking for does not exist or has been moved.</p>
                  <a href="/" className="inline-block bg-secondary text-secondary-foreground px-8 py-3 rounded-full tracking-wide font-semibold hover:bg-secondary/90 transition-colors shadow-md">
                    Return to Home
                  </a>
                </div>
              </div>
            } />

             
  
          </Routes>
        </DashboardLayout>
        
      </Router>
    </CartProvider>
  );
}


export default App;