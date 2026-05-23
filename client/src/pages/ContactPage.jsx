import { useState } from "react";
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiCheck } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-gray-100">
        <div className="max-w-[1000px] mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-dark mb-4">Contact Us</h1>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed">
            Have a question, feedback, or need help? We'd love to hear from you. Reach out using any of the channels below.
          </p>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { icon: FiPhone, label: "Phone", value: "+250 798 388 890", action: "tel:+250798388890", btn: "Call Now" },
            { icon: FiMail, label: "Email", value: "hakorimanasharif12@gmail.com", action: "mailto:hakorimanasharif12@gmail.com", btn: "Send Email" },
            { icon: FaWhatsapp, label: "WhatsApp", value: "+250 798 388 890", action: "https://wa.me/250798388890", btn: "Chat Now" },
            { icon: FiClock, label: "Working Hours", value: "Mon-Sat, 8AM-8PM", action: null, btn: null },
          ].map((c) => (
            <div key={c.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md transition">
              <c.icon size={24} className="mx-auto text-primary mb-3" />
              <h4 className="text-sm font-semibold text-dark">{c.label}</h4>
              <p className="text-xs text-gray-500 mt-1 mb-3">{c.value}</p>
              {c.action && (
                <a href={c.action} target={c.action.startsWith("http") ? "_blank" : undefined} rel={c.action.startsWith("http") ? "noopener noreferrer" : undefined} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                  {c.btn} →
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-lg font-bold text-dark mb-1">Send Us a Message</h2>
              <p className="text-sm text-gray-500 mb-6">We'll get back to you within 24 hours.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary transition bg-gray-50/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary transition bg-gray-50/50" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                  <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary transition bg-gray-50/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                  <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary transition bg-gray-50/50 resize-none" />
                </div>
                <button type="submit" className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition shadow-sm">
                  {sent ? <><FiCheck size={16} /> Message Sent!</> : <><FiSend size={16} /> Send Message</>}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-lg font-bold text-dark mb-4">Our Location</h2>
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-start gap-3"><FiMapPin className="mt-0.5 shrink-0 text-primary" size={18} /><span>Hiromart, 507-Union Trade Centre, Kigali, Rwanda</span></div>
                <div className="flex items-center gap-3"><FiPhone className="shrink-0 text-primary" size={18} /><a href="tel:+250798388890" className="hover:text-primary transition">+250 798 388 890</a></div>
                <div className="flex items-center gap-3"><FiMail className="shrink-0 text-primary" size={18} /><a href="mailto:hakorimanasharif12@gmail.com" className="hover:text-primary transition break-all">hakorimanasharif12@gmail.com</a></div>
                <div className="flex items-start gap-3"><FiClock className="mt-0.5 shrink-0 text-primary" size={18} /><div><span className="font-medium text-dark block">Working Hours</span><span className="text-gray-500">Monday - Saturday: 8:00 AM - 8:00 PM</span></div></div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Follow Us</h4>
                <div className="flex items-center gap-3">
                  {["Facebook", "Twitter", "Instagram", "Youtube"].map((s) => (
                    <a key={s} href="#" className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition">
                      <span className="text-[10px] font-bold">{s.charAt(0)}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 bg-primary/5 rounded-2xl border border-primary/10 p-6 text-center">
              <h3 className="text-sm font-bold text-dark mb-2">Need help immediately?</h3>
              <p className="text-xs text-gray-500 mb-4">Our support team is available for live chat during working hours.</p>
              <a href="https://wa.me/250798388890" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition shadow-sm"><FaWhatsapp size={16} /> Start Live Chat</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
