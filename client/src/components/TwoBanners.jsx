import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useFetch } from "../utils/api";

export default function TwoBanners() {
  const { data: banners } = useFetch("/banners?position=banner&active=1");
  const list = banners || [];

  if (list.length === 0) return null;

  const rows = [];
  for (let i = 0; i < list.length; i += 2) {
    rows.push(list.slice(i, i + 2));
  }

  return (
    <>
      {rows.map((row, idx) => (
        <section key={idx} className="mb-8">
          <div className="max-w-[1430px] mx-auto px-4">
            <div className="md:hidden -mx-4 px-4">
              <Swiper slidesPerView={1.2} spaceBetween={12}>
                {row.map((b) => (
                  <SwiperSlide key={b._id}>
                    <a href={b.link || "#"} className="relative group rounded-lg overflow-hidden h-[200px] block">
                      {b.video ? (
                        <video src={b.video} autoPlay muted loop playsInline className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      ) : (
                        <img src={b.image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent p-6 flex flex-col justify-center">
                        <h3 className="text-white text-lg font-bold">{b.title}</h3>
                        <p className="text-gray-200 text-xs mt-1">{b.subtitle || b.description}</p>
                        <span className="text-primary text-xs font-medium underline mt-2">Shop Now</span>
                      </div>
                    </a>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="hidden md:grid md:grid-cols-2 gap-6">
              {row.map((b) => (
                <a key={b._id} href={b.link || "#"} className="relative group rounded-lg overflow-hidden h-[220px]">
                  {b.video ? (
                    <video src={b.video} autoPlay muted loop playsInline className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <img src={b.image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent p-8 flex flex-col justify-center">
                    <h3 className="text-white text-xl font-bold">{b.title}</h3>
                    <p className="text-gray-200 text-sm mt-1">{b.subtitle || b.description}</p>
                    <span className="text-primary text-sm font-medium underline mt-3">Shop Now</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
