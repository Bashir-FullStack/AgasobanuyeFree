import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";

const blogPosts = [
  { id: 1, title: "How to Write a Blog Post Your Readers Will Love in 5 Steps", image: "https://picsum.photos/seed/blog1/400/300" },
  { id: 2, title: "9 Content Marketing Trends and Ideas to Increase Traffic", image: "https://picsum.photos/seed/blog2/400/300" },
  { id: 3, title: "The Ultimate Guide to Marketing Strategies to Improve Sales", image: "https://picsum.photos/seed/blog3/400/300" },
  { id: 4, title: "50 Best Sales Questions to Determine Your Customer's Needs", image: "https://picsum.photos/seed/blog4/400/300" },
  { id: 5, title: "6 Simple Ways To Boost Your Ecommerce Conversion Rate", image: "https://picsum.photos/seed/blog5/400/300" },
  { id: 6, title: "9 Customer Experience Trends That'll Define the Next Year", image: "https://picsum.photos/seed/blog6/400/300" },
  { id: 7, title: "A Step-by-Step Guide to Creating a Blog on WordPress", image: "https://picsum.photos/seed/blog7/400/300" },
  { id: 8, title: "How to Write a Blog Post Outline: A Simple Formula to Follow", image: "https://picsum.photos/seed/blog8/400/300" },
];

export default function BlogGallery() {
  return (
    <section className="mb-12">
      <div className="max-w-[1430px] mx-auto px-4">
        <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-100">
          <div className="w-1 h-6 bg-primary rounded-full"></div>
          <h2 className="text-xl md:text-2xl font-bold text-dark">From The Gallery</h2>
        </div>
        <div className="relative">
          <Swiper
            modules={[Navigation]}
            slidesPerView={1}
            breakpoints={{ 640: { slidesPerView: 2 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } }}
            spaceBetween={20}
            navigation={{ prevEl: "#blog-prev", nextEl: "#blog-next" }}
          >
            {blogPosts.map((post) => (
              <SwiperSlide key={post.id}>
                <a href="#" className="block group rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow bg-white">
                  <div className="overflow-hidden h-48 relative">
                    <img loading="lazy" src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <span className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/80 text-xs"><FiCalendar size={12} /> May 21, 2026</span>
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">Ecommerce</span>
                    <h3 className="text-sm font-semibold text-dark group-hover:text-primary leading-snug mt-1 line-clamp-2">{post.title}</h3>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">Discover the latest insights and strategies to grow your online business effectively.</p>
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
          <button id="blog-prev" className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition opacity-0 hover:opacity-100"><FiChevronLeft size={18} /></button>
          <button id="blog-next" className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition opacity-0 hover:opacity-100"><FiChevronRight size={18} /></button>
        </div>
      </div>
    </section>
  );
}
