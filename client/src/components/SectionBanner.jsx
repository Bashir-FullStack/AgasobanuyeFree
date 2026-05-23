import { useFetch } from "../utils/api";

export default function SectionBanner() {
  const { data: banners } = useFetch("/banners?position=section&active=1");
  const list = banners || [];
  if (list.length === 0) return null;

  return (
    <>
      {list.map((b) => (
        <section key={b._id} className="mb-8">
          <div className="max-w-[1430px] mx-auto px-4">
            <a href={b.link || "#"} className="relative rounded-xl overflow-hidden h-[200px] md:h-[300px] group block">
              <img src={b.image} alt={b.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent p-6 md:p-12 flex flex-col justify-center">
                {b.title && (
                  <span className="text-primary font-bold text-xs md:text-sm uppercase tracking-[0.2em]">{b.title}</span>
                )}
                {b.subtitle && (
                  <h3 className="text-white text-xl md:text-3xl font-bold max-w-lg mt-2 leading-snug">{b.subtitle}</h3>
                )}
                {b.description && (
                  <p className="text-gray-200 text-xs md:text-base mt-2 max-w-md">{b.description}</p>
                )}
                <span className="mt-4 md:mt-5 inline-flex items-center gap-2 bg-primary text-white text-xs md:text-sm font-semibold px-5 md:px-6 py-2 md:py-2.5 rounded-lg hover:bg-primary-dark transition self-start">
                  Shop Now <span aria-hidden="true">→</span>
                </span>
              </div>
            </a>
          </div>
        </section>
      ))}
    </>
  );
}
