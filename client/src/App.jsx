import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { FaWhatsapp } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CompareProvider } from "./context/CompareContext";
import { AuthProvider } from "./context/AuthContext";
import { API } from "./config";
import SEO from "./components/SEO";
import TopBar from "./components/TopBar";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import CategoryCarousel from "./components/CategoryCarousel";
import FreeShipping from "./components/FreeShipping";
import ThreeBanners from "./components/ThreeBanners";
import TabbedProducts from "./components/TabbedProducts";
import CategoryProductSections from "./components/CategoryProductSections";
import SectionBanner from "./components/SectionBanner";
import WatchPromo from "./components/WatchPromo";
import LatestProducts from "./components/LatestProducts";
import FeaturedProducts from "./components/FeaturedProducts";
import TwoBanners from "./components/TwoBanners";
import PromoGrid from "./components/PromoGrid";
import PopularProducts from "./components/PopularProducts";
import DealOfTheDay from "./components/DealOfTheDay";
import BestSellingProducts from "./components/BestSellingProducts";
import Testimonials from "./components/Testimonials";
import Brands from "./components/Brands";
import BlogGallery from "./components/BlogGallery";
import ServiceFeatures from "./components/ServiceFeatures";
import DownloadApp from "./components/DownloadApp";
import LiveChat from "./components/LiveChat";
import SignUpBanner from "./components/SignUpBanner";
import CookieConsent from "./components/CookieConsent";
import Footer from "./components/Footer";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import OTPVerifyPage from "./pages/OTPVerifyPage";
import CartPage from "./pages/CartPage";
import ProductPage from "./pages/ProductPage";
import WishlistPage from "./pages/WishlistPage";
import ComparePage from "./pages/ComparePage";
import ShopPage from "./pages/ShopPage";
import CheckoutPage from "./pages/CheckoutPage";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryPage from "./pages/CategoryPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import HelpCenterPage from "./pages/HelpCenterPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import TermsPage from "./pages/TermsPage";
import SecurePaymentPage from "./pages/SecurePaymentPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import DiscountPage from "./pages/DiscountPage";
import CreditSlipPage from "./pages/CreditSlipPage";
import SitemapPage from "./pages/SitemapPage";
import StoresPage from "./pages/StoresPage";
import AccessoriesPage from "./pages/AccessoriesPage";
import PricesDropPage from "./pages/PricesDropPage";
import NewProductsPage from "./pages/NewProductsPage";
import BestSellersPage from "./pages/BestSellersPage";
import NotFoundPage from "./pages/NotFoundPage";

function Layout({ children, seo }) {
  useEffect(() => { window.scrollTo(0, 0); });
  useEffect(() => {
    fetch(`${API}/settings`)
      .then(r => r.json())
      .then(data => {
        if (data?.favicon) {
          let link = document.querySelector("link[rel='icon']");
          if (link) link.href = data.favicon;
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans antialiased overflow-x-hidden">
      {seo}
      <TopBar />
      <Header />
      <Navigation />
      <SignUpBanner />
      <main>{children}</main>
      <CookieConsent />
      <DownloadApp />
      <a href="https://wa.me/250798388890" target="_blank" rel="noopener noreferrer" className="fixed bottom-24 lg:bottom-6 right-6 z-50 group">
        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75 group-hover:animate-none" />
        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-50 group-hover:animate-none" style={{ animationDelay: "0.5s" }} />
        <div className="relative w-14 h-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center">
          <FaWhatsapp size={28} />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">1</span>
        </div>
      </a>
       <Footer />
    </div>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <FreeShipping />
      <CategoryCarousel />
      <ThreeBanners />
      <TabbedProducts />
      <WatchPromo />
      <CategoryProductSections />
      <SectionBanner />
      <LatestProducts />
      <FeaturedProducts />
      <TwoBanners />
      <PromoGrid />
      <DealOfTheDay />
      <PopularProducts />
      <BestSellingProducts />
      <Testimonials />
      <Brands />
      <BlogGallery />
      <ServiceFeatures />
    </>
  );
}

function StripeWrapper({ children }) {
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    const envKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (envKey) return setStripePromise(loadStripe(envKey));

    fetch(`${API}/payment/config`)
      .then(r => r.json())
      .then(data => {
        if (data.publishableKey) {
          setStripePromise(loadStripe(data.publishableKey));
        }
      })
      .catch(() => {});
  }, []);

  if (!stripePromise) return children;
  return <Elements stripe={stripePromise}>{children}</Elements>;
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "652032330761-m1bcrab25iev63dr42mjmd657sclsjt8.apps.googleusercontent.com"}>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
      <CartProvider>
        <WishlistProvider>
        <CompareProvider>
        <Routes>
          <Route path="/" element={<Layout seo={<SEO title="Home" description="Shop the best deals on fashion, electronics, accessories and more in Rwanda. Free delivery across Kigali on orders over FRw 260,000." keywords="Hiromart, online shopping Rwanda, buy online Kigali" />}><HomePage /></Layout>} />
          <Route path="/login" element={<Layout seo={<SEO title="Login" keywords="login, sign in, Hiromart account" />}><LoginPage /></Layout>} />
          <Route path="/signup" element={<Layout seo={<SEO title="Create Account" keywords="sign up, register, create account Hiromart" />}><SignupPage /></Layout>} />
          <Route path="/forgot-password" element={<Layout seo={<SEO title="Forgot Password" />}><ForgotPasswordPage /></Layout>} />
          <Route path="/verify-otp" element={<Layout seo={<SEO title="Verify OTP" />}><OTPVerifyPage /></Layout>} />
          <Route path="/reset-password/:token" element={<Layout seo={<SEO title="Reset Password" />}><ResetPasswordPage /></Layout>} />
          <Route path="/reset-password" element={<Layout seo={<SEO title="Reset Password" />}><ResetPasswordPage /></Layout>} />
          <Route path="/cart" element={<Layout seo={<SEO title="Shopping Cart" keywords="shopping cart, Hiromart cart" />}><CartPage /></Layout>} />
          <Route path="/product/:id" element={<Layout><ProductPage /></Layout>} />
          <Route path="/wishlist" element={<Layout seo={<SEO title="Wishlist" />}><WishlistPage /></Layout>} />
          <Route path="/compare" element={<Layout seo={<SEO title="Compare Products" />}><ComparePage /></Layout>} />
          <Route path="/shop" element={<Layout><ShopPage /></Layout>} />
          <Route path="/checkout" element={<Layout seo={<SEO title="Checkout" />}><StripeWrapper><CheckoutPage /></StripeWrapper></Layout>} />
          <Route path="/categories" element={<Layout seo={<SEO title="Categories" description="Browse all product categories on Hiromart" keywords="product categories, shop by category" />}><CategoriesPage /></Layout>} />
          <Route path="/category/:name" element={<Layout><CategoryPage /></Layout>} />
          <Route path="/orders" element={<Layout seo={<SEO title="My Orders" />}><OrdersPage /></Layout>} />
          <Route path="/order-detail/:id" element={<Layout seo={<SEO title="Order Details" />}><OrderTrackingPage /></Layout>} />
          <Route path="/profile" element={<Layout seo={<SEO title="My Profile" />}><ProfilePage /></Layout>} />
          <Route path="/help" element={<Layout seo={<SEO title="Help Center" />}><HelpCenterPage /></Layout>} />
          <Route path="/about" element={<Layout seo={<SEO title="About Us" description="Learn more about Hiromart - Rwanda's trusted online shopping platform" keywords="about Hiromart, about us" />}><AboutPage /></Layout>} />
          <Route path="/contact" element={<Layout seo={<SEO title="Contact Us" description="Get in touch with Hiromart customer support" keywords="contact Hiromart, customer support" />}><ContactPage /></Layout>} />
          <Route path="/terms" element={<Layout seo={<SEO title="Terms & Conditions" />}><TermsPage /></Layout>} />
          <Route path="/secure-payment" element={<Layout seo={<SEO title="Secure Payment" />}><SecurePaymentPage /></Layout>} />
          <Route path="/order-tracking" element={<Layout seo={<SEO title="Order Tracking" />}><OrderTrackingPage /></Layout>} />
          <Route path="/discounts" element={<Layout seo={<SEO title="Discounts & Deals" keywords="discounts, deals, sales, promotions Hiromart" />}><DiscountPage /></Layout>} />
          <Route path="/credit-slip" element={<Layout seo={<SEO title="Credit Slip" />}><CreditSlipPage /></Layout>} />
          <Route path="/sitemap" element={<Layout seo={<SEO title="Sitemap" />}><SitemapPage /></Layout>} />
          <Route path="/stores" element={<Layout seo={<SEO title="Our Stores" keywords="Hiromart stores, pickup locations" />}><StoresPage /></Layout>} />
          <Route path="/accessories" element={<Layout seo={<SEO title="Accessories" keywords="accessories, Hiromart accessories" />}><AccessoriesPage /></Layout>} />
          <Route path="/prices-drop" element={<Layout seo={<SEO title="Price Drops" keywords="price drops, price reductions, sales" />}><PricesDropPage /></Layout>} />
          <Route path="/new-products" element={<Layout seo={<SEO title="New Products" description="Check out the latest products at Hiromart" keywords="new products, latest arrivals Hiromart" />}><NewProductsPage /></Layout>} />
          <Route path="/best-sellers" element={<Layout seo={<SEO title="Best Sellers" description="Most popular products on Hiromart" keywords="best sellers, popular products, top rated" />}><BestSellersPage /></Layout>} />
          <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
        </Routes>
        </CompareProvider>
        </WishlistProvider>
      </CartProvider>
      </AuthProvider>
    </BrowserRouter>
    </GoogleOAuthProvider>
  );
}
