import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import API from "../utils/api";
import { HeroSkeleton } from "./Skeletons";
import { useTranslation } from "../i18n/TranslationContext";

export default function Hero() {
  const { t } = useTranslation();
  const [slides, setSlides] = useState([]);
  const [sideBanners, setSideBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/banners/hero`)
      .then(r => r.json())
      .then(data => {
        if (data.slides?.length) setSlides(data.slides);
        if (data.side?.length) setSideBanners(data.side);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <HeroSkeleton />;

  return (
    <section className="bg-gradient-to-b from-hero-bg to-white pb-8 mb-10">
      <div className="max-w-[1430px] mx-auto px-4 pt-6">
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="lg:w-[65%] w-full">
            <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 5000 }} pagination={{ clickable: true }} loop className="rounded-2xl overflow-hidden shadow-lg">
              {slides.map((s, i) => (
                <SwiperSlide key={s.id || i}>
                  <div className="relative h-[220px] md:h-[340px] lg:h-[420px] flex items-center" style={{ background: `url(${s.image}) center/cover` }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
                    <div className="relative z-10 p-6 md:p-10 lg:p-14 max-w-md">
                      {s.subtitle && <p className="text-primary font-semibold text-xs md:text-sm uppercase tracking-widest mb-1 md:mb-2" style={{ animation: "fadeSlideLeft 0.8s ease-out" }}>{s.subtitle}</p>}
                      <h2 className="text-xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-dark mb-2 md:mb-3 leading-tight" style={{ animation: "fadeSlideLeft 0.8s ease-out 0.2s both" }}>{s.title}</h2>
                      {s.description && <p className="text-sm md:text-lg text-gray-700 mb-3 md:mb-5" style={{ animation: "fadeSlideLeft 0.8s ease-out 0.4s both" }}>{s.description}</p>}
                      {s.link?.startsWith("http") ? (
                        <a href={s.link} className="inline-block bg-primary text-white px-6 md:px-8 py-2.5 md:py-3.5 rounded-xl text-xs md:text-sm font-semibold hover:bg-primary-dark transition shadow-lg shadow-primary/25" style={{ animation: "fadeSlideLeft 0.8s ease-out 0.6s both" }}>{t("hero.shopNow")} →</a>
                      ) : (
                        <Link to={s.link || "#"} className="inline-block bg-primary text-white px-6 md:px-8 py-2.5 md:py-3.5 rounded-xl text-xs md:text-sm font-semibold hover:bg-primary-dark transition shadow-lg shadow-primary/25" style={{ animation: "fadeSlideLeft 0.8s ease-out 0.6s both" }}>{t("hero.shopNow")} →</Link>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="hidden lg:flex lg:w-[35%] flex-col gap-4">
            {sideBanners.map((b, i) => {
              const Wrapper = b.link?.startsWith("http") ? "a" : Link;
              const props = b.link?.startsWith("http") ? { href: b.link || "#" } : { to: b.link || "#" };
              return (
                <Wrapper key={b.id || i} {...props} className="relative rounded-2xl overflow-hidden group cursor-pointer h-[188px] block shadow-md card-hover">
                  <img src={b.image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent p-6 flex flex-col justify-center">
                    <h3 className="text-white text-lg font-bold leading-tight">{b.title}</h3>
                    {b.description && <p className="text-primary font-bold text-2xl mt-1">{b.description}</p>}
                    <span className="text-white/90 text-sm underline underline-offset-4 mt-2 inline-block group-hover:text-primary transition">{t("hero.shopNow")}</span>
                  </div>
                </Wrapper>
              );
            })}
          </div>
          {sideBanners.length > 0 && (
            <div className="flex lg:hidden gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4">
              {sideBanners.map((b, i) => {
                const Wrapper = b.link?.startsWith("http") ? "a" : Link;
                const props = b.link?.startsWith("http") ? { href: b.link || "#" } : { to: b.link || "#" };
                return (
                  <Wrapper key={b.id || i} {...props} className="relative rounded-2xl overflow-hidden group cursor-pointer h-[140px] min-w-[260px] snap-start shrink-0 block shadow-sm">
                    <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent p-4 flex flex-col justify-center">
                      <h3 className="text-white text-sm font-semibold">{b.title}</h3>
                      {b.description && <p className="text-primary font-bold text-base mt-0.5">{b.description}</p>}
                      <span className="text-white/80 text-[11px] underline mt-1 inline-block">{t("hero.shopNow")}</span>
                    </div>
                  </Wrapper>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
