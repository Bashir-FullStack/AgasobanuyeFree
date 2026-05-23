import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useFetch } from "../utils/api";
import ProductCard from "./ProductCard";
import { ProductGridSkeleton } from "./Skeletons";

export default function LatestProducts() {
  const { data: products, loading } = useFetch("/products?limit=10");

  return (
    <section className="mb-14">
      <div className="max-w-[1430px] mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-7 bg-primary rounded-full" />
          <h2 className="text-xl md:text-2xl font-bold text-dark">New Arrivals</h2>
        </div>
        {loading ? <ProductGridSkeleton count={5} /> : (
          <>
            <div className="md:hidden -mx-4 px-4">
              <Swiper slidesPerView={2} spaceBetween={10}>
                {(products || []).slice(0, 10).map((p) => (
                  <SwiperSlide key={p.id}><ProductCard product={p} /></SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="hidden md:block">
              <div className="grid grid-cols-3 lg:grid-cols-5 gap-3">
                {(products || []).slice(0, 10).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
