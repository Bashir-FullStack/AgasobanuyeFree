import { useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useFetch } from "../utils/api";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function CategoryCarousel() {
  const { data: categories } = useFetch("/categories");
  const navPrevRef = useRef(null);
  const navNextRef = useRef(null);
  const list = categories || [];

  if (list.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="max-w-[1430px] mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 bg-primary rounded-full"></div>
            <h2 className="text-lg md:text-xl font-bold text-dark">Shop by Categories</h2>
          </div>
          <Link to="/categories" className="text-sm text-primary font-semibold hover:underline underline-offset-4">See All →</Link>
        </div>
        <div className="relative">
          <button ref={navPrevRef} className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:text-primary hover:shadow-xl z-10 transition hidden md:flex">
            <FiChevronLeft size={18} />
          </button>
          <button ref={navNextRef} className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:text-primary hover:shadow-xl z-10 transition hidden md:flex">
            <FiChevronRight size={18} />
          </button>
          <Swiper
            modules={[Navigation]}
            navigation={{ prevEl: navPrevRef.current, nextEl: navNextRef.current }}
            onInit={(swiper) => { swiper.params.navigation.prevEl = navPrevRef.current; swiper.params.navigation.nextEl = navNextRef.current; swiper.navigation.init(); swiper.navigation.update(); }}
            slidesPerView={3}
            spaceBetween={12}
            breakpoints={{
              480: { slidesPerView: 4, spaceBetween: 14 },
              640: { slidesPerView: 5, spaceBetween: 16 },
              768: { slidesPerView: 6, spaceBetween: 18 },
              1024: { slidesPerView: 8, spaceBetween: 20 },
            }}
            className="!px-1"
          >
            {list.map((cat) => (
              <SwiperSlide key={cat._id}>
                <Link to={`/category/${cat.name?.toLowerCase()}`} className="flex flex-col items-center group">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary-lighter to-primary/5 flex items-center justify-center overflow-hidden border border-gray-100 group-hover:border-primary transition-all shadow-sm group-hover:shadow-lg group-hover:shadow-primary/10 card-hover">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg md:text-xl font-bold text-primary">{cat.name?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <span className="text-[11px] md:text-xs text-gray-600 mt-2.5 text-center font-semibold group-hover:text-primary transition truncate max-w-full">{cat.name}</span>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
