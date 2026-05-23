import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthProvider, { useAuth } from "./context/AuthContext";
import { TranslationProvider } from "./i18n/TranslationContext";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "652032330761-m1bcrab25iev63dr42mjmd657sclsjt8.apps.googleusercontent.com";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminForgotPasswordPage from "./pages/AdminForgotPasswordPage";
import AdminOTPVerifyPage from "./pages/AdminOTPVerifyPage";
import AdminResetPasswordPage from "./pages/AdminResetPasswordPage";
import Dashboard from "./pages/Dashboard";
import ProductsPage from "./pages/ProductsPage";
import AddProductPage from "./pages/AddProductPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CategoriesPage from "./pages/CategoriesPage";
import NewCategoryPage from "./pages/NewCategoryPage";
import BannersPage from "./pages/BannersPage";
import AddBannerPage from "./pages/AddBannerPage";
import BrandsPage from "./pages/BrandsPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import MessagesPage from "./pages/MessagesPage";
import InboxPage from "./pages/InboxPage";
import NotificationsPage from "./pages/NotificationsPage";
import WebSettingsPage from "./pages/WebSettingsPage";
import ProfilePage from "./pages/ProfilePage";
import CustomersPage from "./pages/CustomersPage";
import CustomerReportsPage from "./pages/CustomerReportsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SalesReportPage from "./pages/SalesReportPage";
import DeliveryPage from "./pages/DeliveryPage";
import CouponsPage from "./pages/CouponsPage";
import SubscribersPage from "./pages/SubscribersPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import Layout from "./components/Layout";

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <TranslationProvider>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/admin-forgot-password" element={<AdminForgotPasswordPage />} />
          <Route path="/admin-verify-otp" element={<AdminOTPVerifyPage />} />
          <Route path="/admin-reset-password" element={<AdminResetPasswordPage />} />
          <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><Layout><ProductsPage /></Layout></ProtectedRoute>} />
          <Route path="/products/new" element={<ProtectedRoute><Layout><AddProductPage /></Layout></ProtectedRoute>} />
          <Route path="/product-detail" element={<Navigate to="/products/detail" />} />
          <Route path="/products/detail" element={<ProtectedRoute><Layout><ProductDetailPage /></Layout></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute><Layout><CategoriesPage /></Layout></ProtectedRoute>} />
          <Route path="/categories/new" element={<ProtectedRoute><Layout><NewCategoryPage /></Layout></ProtectedRoute>} />
          <Route path="/banners" element={<ProtectedRoute><Layout><BannersPage /></Layout></ProtectedRoute>} />
          <Route path="/banners/new" element={<ProtectedRoute><Layout><AddBannerPage /></Layout></ProtectedRoute>} />
          <Route path="/brands" element={<ProtectedRoute><Layout><BrandsPage /></Layout></ProtectedRoute>} />
          <Route path="/delivery" element={<ProtectedRoute><Layout><DeliveryPage /></Layout></ProtectedRoute>} />
          <Route path="/coupons" element={<ProtectedRoute><Layout><CouponsPage /></Layout></ProtectedRoute>} />
          <Route path="/subscribers" element={<ProtectedRoute><Layout><SubscribersPage /></Layout></ProtectedRoute>} />
          <Route path="/announcements" element={<ProtectedRoute><Layout><AnnouncementsPage /></Layout></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Layout><OrdersPage /></Layout></ProtectedRoute>} />
          <Route path="/orders/detail" element={<ProtectedRoute><Layout><OrderDetailPage /></Layout></ProtectedRoute>} />
          <Route path="/orders/tracking" element={<ProtectedRoute><Layout><OrderTrackingPage /></Layout></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Layout><MessagesPage /></Layout></ProtectedRoute>} />
          <Route path="/messages/inbox" element={<ProtectedRoute><Layout><InboxPage /></Layout></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Layout><NotificationsPage /></Layout></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><Layout><CustomersPage /></Layout></ProtectedRoute>} />
          <Route path="/customers/reports" element={<ProtectedRoute><Layout><CustomerReportsPage /></Layout></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Layout><AnalyticsPage /></Layout></ProtectedRoute>} />
          <Route path="/analytics/sales" element={<ProtectedRoute><Layout><SalesReportPage /></Layout></ProtectedRoute>} />
          <Route path="/settings/profile" element={<ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>} />
          <Route path="/settings/websettings" element={<ProtectedRoute><Layout><WebSettingsPage /></Layout></ProtectedRoute>} />
          <Route path="/settings/websettings/branding" element={<ProtectedRoute><Layout><WebSettingsPage /></Layout></ProtectedRoute>} />
          <Route path="/settings/websettings/general" element={<ProtectedRoute><Layout><WebSettingsPage /></Layout></ProtectedRoute>} />
          <Route path="/settings/websettings/seo" element={<ProtectedRoute><Layout><WebSettingsPage /></Layout></ProtectedRoute>} />
          <Route path="/settings/websettings/social-links" element={<ProtectedRoute><Layout><WebSettingsPage /></Layout></ProtectedRoute>} />
          <Route path="/settings/websettings/payment" element={<ProtectedRoute><Layout><WebSettingsPage /></Layout></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
      </TranslationProvider>
    </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
