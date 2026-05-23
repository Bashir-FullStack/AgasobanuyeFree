import { Link } from "react-router-dom";
import { FiShield, FiFileText } from "react-icons/fi";

export default function TermsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-gray-100">
        <div className="max-w-[800px] mx-auto px-4 py-14 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"><FiFileText size={28} className="text-primary" /></div>
          <h1 className="text-3xl font-bold text-dark">Terms & Conditions</h1>
          <p className="text-gray-500 text-sm mt-2">Last updated: May 2026</p>
        </div>
      </div>
      <div className="max-w-[800px] mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6 text-sm text-gray-600 leading-relaxed">
          <section><h2 className="text-lg font-bold text-dark mb-3">1. Introduction</h2><p>Welcome to Hiromart. These Terms & Conditions govern your use of our website and services. By accessing or purchasing from Hiromart, you agree to be bound by these terms.</p></section>
          <section><h2 className="text-lg font-bold text-dark mb-3">2. Account Registration</h2><p>You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p></section>
          <section><h2 className="text-lg font-bold text-dark mb-3">3. Orders & Payment</h2><p>All orders are subject to availability and confirmation. We reserve the right to cancel any order. Prices are listed in Rwandan Francs (FRw) and include applicable taxes unless stated otherwise.</p></section>
          <section><h2 className="text-lg font-bold text-dark mb-3">4. Shipping & Delivery</h2><p>We ship within 5-7 business days for standard delivery. Express delivery (2-3 days) is available at an additional cost. Delivery times are estimates and not guaranteed.</p></section>
          <section><h2 className="text-lg font-bold text-dark mb-3">5. Returns & Refunds</h2><p>Items can be returned within 30 days of delivery in unused condition. Refunds are processed within 5-7 business days after we receive the returned item.</p></section>
          <section><h2 className="text-lg font-bold text-dark mb-3">6. Intellectual Property</h2><p>All content on this website — including product images, descriptions, logos, and trademarks — is the property of Hiromart and may not be used without permission.</p></section>
          <section><h2 className="text-lg font-bold text-dark mb-3">7. Limitation of Liability</h2><p>Hiromart is not liable for indirect, incidental, or consequential damages arising from the use of our products or services. Our total liability is limited to the purchase price of the product.</p></section>
          <section><h2 className="text-lg font-bold text-dark mb-3">8. Changes to Terms</h2><p>We may update these terms at any time. Continued use of the site after changes constitutes acceptance of the new terms.</p></section>
          <section><h2 className="text-lg font-bold text-dark mb-3">9. Contact</h2><p>For questions about these terms, contact us at <a href="mailto:hakorimanasharif12@gmail.com" className="text-primary hover:underline">hakorimanasharif12@gmail.com</a>.</p></section>
        </div>
      </div>
    </div>
  );
}
