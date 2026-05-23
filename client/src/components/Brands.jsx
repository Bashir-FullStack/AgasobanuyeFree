import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { API } from "../config";

export default function Brands() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetch(`${API}/brands`)
      .then(r => r.json())
      .then(data => setBrands(data))
      .catch(() => {});
  }, []);

  if (brands.length === 0) return null;
  return (
    <section className="mb-12">
      <div className="max-w-[1430px] mx-auto px-4">
        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            slidesPerView={2}
            breakpoints={{ 480: { slidesPerView: 3 }, 768: { slidesPerView: 4 }, 1024: { slidesPerView: 5 } }}
            spaceBetween={20}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            speed={1500}
            navigation={{ prevEl: "#brand-prev", nextEl: "#brand-next" }}
          >
            {brands.map((b) => (
              <SwiperSlide key={b._id}>
                <a href="#" className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <img src={b.image || `https://placehold.co/200x80?text=${b.name.charAt(0)}`} alt={b.name} className="h-12 object-contain mx-auto grayscale hover:grayscale-0 transition" />
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
          <button id="brand-prev" className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition opacity-0 hover:opacity-100"><FiChevronLeft size={18} /></button>
          <button id="brand-next" className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition opacity-0 hover:opacity-100"><FiChevronRight size={18} /></button>
        </div>
      </div>
    </section>
  );
}
