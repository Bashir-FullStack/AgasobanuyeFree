export default function PromoBanner({ badge, title, subtitle, img, className }) {
  return (
    <div className={`relative rounded-xl overflow-hidden h-[220px] group ${className || ""}`}>
      <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent p-8 flex flex-col justify-center">
        {badge && <span className="text-primary font-bold text-xs uppercase tracking-widest">{badge}</span>}
        <h3 className="text-white text-xl md:text-2xl font-bold max-w-md mt-1">{title}</h3>
        {subtitle && <p className="text-gray-200 text-sm max-w-sm mt-1">{subtitle}</p>}
        <a href="#" className="mt-3 text-white underline text-sm font-medium hover:text-primary transition">Shop Now</a>
      </div>
    </div>
  );
}
