export default function WatchPromo() {
  return (
    <section className="mb-12">
      <div className="max-w-[1430px] mx-auto px-4">
        <div className="relative rounded-xl overflow-hidden h-[200px] md:h-[240px] group">
          <img src="https://i.pinimg.com/1200x/22/e9/70/22e9707022c7f280eba0d32b9407eac0.jpg" alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent p-8 md:p-12 flex flex-col justify-center">
            <span className="text-primary font-bold text-xs md:text-sm uppercase tracking-[0.2em]">Watch</span>
            <h3 className="text-white text-xl md:text-3xl font-bold max-w-lg mt-3 leading-snug">M6 Smart Band 2.3 — Fitness Band Men's and Women's Health Tracking, Red Strap</h3>
            <p className="text-gray-300 text-sm mt-3 max-w-md">Track your fitness goals with advanced health monitoring and stylish red strap design.</p>
            <a href="#" className="mt-5 inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-primary-dark transition self-start">Shop Now <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}
