import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const testimonials = [
  { id: 1, name: "Alice Uwimana", title: "Fashion Designer", quote: "Ndagushimira cyane! Ibi bidoli byiza cyane kandi bigurishwa ku giciro gike. Byageze vuba kandi nta kibazo. Nzakomeza kugura hano.", avatar: "https://i.pinimg.com/736x/a1/3f/e5/a13fe593cd044397afc8ce5d47598333.jpg" },
  { id: 2, name: "Jeanne Mukamana", title: "Business Owner", quote: "Excellent quality products and fast shipping. The customer service team was incredibly helpful throughout the entire process. Highly recommend!", avatar: "https://i.pinimg.com/736x/10/96/f6/1096f66d775688b4e9b69500b2b9ac03.jpg" },
  { id: 3, name: "Patrick Habimana", title: "Store Manager", quote: "Amazing collection of products with great prices. Ubucuruzi bwiza cyane! The website is easy to navigate and checkout is a breeze.", avatar: "https://i.pinimg.com/1200x/8f/c3/d5/8fc3d58ab94716fae5e3c628a17c0f4c.jpg" },
  { id: 4, name: "Marie Claire", title: "Web Designer", quote: "I've been shopping here for years and the quality never disappoints. Their return policy is fantastic and the team always goes above and beyond. Murakoze cyane!", avatar: "https://i.pravatar.cc/80?img=16" },
];

export default function Testimonials() {
  return (
    <section className="mb-12 bg-gray-50 py-12">
      <div className="max-w-[1430px] mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-dark">What Our Clients Say</h2>
        </div>
        <div className="relative">
          <Swiper
            modules={[Navigation]}
            slidesPerView={1}
            spaceBetween={24}
            navigation={{ prevEl: "#test-prev", nextEl: "#test-next" }}
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id}>
                <div className="bg-white p-6 rounded-lg border border-gray-200 text-center max-w-2xl mx-auto">
                  <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full mx-auto mb-3 object-cover" />
                  <p className="text-gray-500 text-sm italic mb-4">"{t.quote}"</p>
                  <h4 className="font-semibold text-dark">{t.name}</h4>
                  <p className="text-xs text-gray-500">{t.title}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <button id="test-prev" className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition"><FiChevronLeft size={18} /></button>
          <button id="test-next" className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition"><FiChevronRight size={18} /></button>
        </div>
      </div>
    </section>
  );
}
