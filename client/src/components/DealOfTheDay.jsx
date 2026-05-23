import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useFetch } from "../utils/api";
import ProductCard from "./ProductCard";
import { ProductGridSkeleton } from "./Skeletons";

export default function DealOfTheDay() {
  const { data: products, loading } = useFetch("/products/discounts?limit=10");

  return (
    <section className="mb-14">
      <div className="max-w-[1430px] mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
            <h2 className="text-xl md:text-2xl font-bold text-dark">Deal Of The Day</h2>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-500 font-semibold">Limited Time Offers</span>
          </div>
        </div>
        {loading ? <ProductGridSkeleton count={5} /> : (
          <>
            <div className="md:hidden -mx-4 px-4">
              <Swiper slidesPerView={2} spaceBetween={10}>
                {(products || []).slice(0, 10).map((p) => (
                  <SwiperSlide key={p.id}>
                    <ProductCard product={p} showTimer />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="hidden md:block">
              <div className="grid grid-cols-3 lg:grid-cols-5 gap-3">
                {(products || []).slice(0, 10).map((p) => (
                  <ProductCard key={p.id} product={p} showTimer />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
