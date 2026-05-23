import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useFetch } from "../utils/api";
import ProductCard from "./ProductCard";
import { ProductGridSkeleton } from "./Skeletons";

export default function FeaturedProducts() {
  const { data: products, loading } = useFetch("/products/featured?limit=10");
  const { data: videoBanners } = useFetch("/banners?position=featured-video&active=1");
  const video = videoBanners?.find(b => b.video);

  return (
    <section className="mb-14">
      <div className="max-w-[1430px] mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-7 bg-primary rounded-full" />
          <h2 className="text-xl md:text-2xl font-bold text-dark">Featured Products</h2>
        </div>
        {video && (
          <div className="relative rounded-2xl overflow-hidden mb-6 h-[220px] md:h-[320px] shadow-lg">
            <video src={video.video} autoPlay muted loop playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent p-6 md:p-10 flex flex-col justify-center">
              <h3 className="text-white text-lg md:text-3xl font-bold">{video.title}</h3>
              {video.subtitle && <p className="text-gray-200 text-xs md:text-sm mt-1">{video.subtitle}</p>}
              {video.link && <a href={video.link} className="mt-4 inline-block text-xs font-semibold text-white bg-primary px-5 py-2.5 rounded-xl hover:bg-primary-dark transition self-start shadow-lg shadow-primary/25">Shop Now →</a>}
            </div>
          </div>
        )}
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
