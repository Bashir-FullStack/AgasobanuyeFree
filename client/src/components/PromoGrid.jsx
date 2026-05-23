import { Link } from "react-router-dom";
import { useFetch } from "../utils/api";

export default function PromoGrid() {
  const { data: banners } = useFetch("/banners?position=promo-grid&active=1");
  const list = banners || [];
  if (list.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="max-w-[1430px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {list.map((b) => {
            const Wrapper = b.link?.startsWith("http") ? "a" : Link;
            const linkProps = b.link?.startsWith("http") ? { href: b.link } : { to: b.link || "#" };
            return (
              <Wrapper key={b._id} {...linkProps} className="relative rounded-xl overflow-hidden h-[220px] group block">
                <img src={b.image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent p-8 flex flex-col justify-center">
                  {b.badge && <span className="text-primary font-bold text-xs uppercase tracking-widest">{b.badge}</span>}
                  <h3 className="text-white text-xl md:text-2xl font-bold max-w-md mt-1">{b.title}</h3>
                  {b.subtitle && <p className="text-gray-200 text-sm max-w-sm mt-1">{b.subtitle}</p>}
                  <span className="mt-3 text-white underline text-sm font-medium hover:text-primary transition">Shop Now</span>
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
