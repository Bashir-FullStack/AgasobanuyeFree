import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useFetch } from "../utils/api";

export default function ThreeBanners() {
  const { data: banners } = useFetch("/banners?position=promo&active=1");
  const list = banners || [];

  if (list.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="max-w-[1430px] mx-auto px-4">
        <div className="md:hidden -mx-4 px-4">
          <Swiper slidesPerView={1.2} spaceBetween={12}>
            {list.slice(0, 4).map((b) => (
              <SwiperSlide key={b._id}>
                <a href={b.link || "#"} className="relative group rounded-lg overflow-hidden cursor-pointer h-[200px] block">
                  {b.video ? (
                    <video src={b.video} autoPlay muted loop playsInline className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <img src={b.image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-5 flex flex-col justify-end">
                    <h3 className="text-white font-semibold text-sm">{b.title}</h3>
                    <p className="text-primary font-bold text-base mt-0.5">{b.description || b.subtitle}</p>
                    <span className="mt-2 inline-block text-xs font-semibold text-white bg-primary px-4 py-2 rounded hover:bg-primary/90 transition self-start">Shop Now</span>
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="hidden md:grid md:grid-cols-2 gap-5">
          {list.slice(0, 2).map((b) => (
            <a key={b._id} href={b.link || "#"} className="relative group rounded-lg overflow-hidden cursor-pointer h-[260px]">
              {b.video ? (
                <video src={b.video} autoPlay muted loop playsInline className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              ) : (
                <img src={b.image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-5 flex flex-col justify-end">
                <h3 className="text-white font-semibold">{b.title}</h3>
                <p className="text-primary font-bold text-lg mt-0.5">{b.description || b.subtitle}</p>
                <span className="mt-3 inline-block text-xs font-semibold text-white bg-primary px-4 py-2 rounded hover:bg-primary/90 transition self-start">Shop Now</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
