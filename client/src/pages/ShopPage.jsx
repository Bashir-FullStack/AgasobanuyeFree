import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiSearch, FiTrendingUp, FiZap, FiStar, FiArrowUp, FiAward, FiHeart, FiEye, FiThumbsUp, FiSun, FiMonitor, FiClock, FiPlus, FiCamera, FiRefreshCw, FiCalendar } from "react-icons/fi";
import { API } from "../config";
import SEO from "../components/SEO";

const badgeIcon = (text) => {
  const map = {
    "Hot": FiZap,
    "Trending Now": FiTrendingUp,
    "Most Popular": FiStar,
    "Rising Fast": FiArrowUp,
    "Top Picks": FiAward,
    "Fan Favorites": FiHeart,
    "Most Watched": FiEye,
    "Recommended": FiThumbsUp,
    "Featured": FiSun,
    "Watching Now": FiMonitor,
    "Popular This Week": FiClock,
    "Just Added": FiPlus,
    "New Releases": FiCamera,
    "Fresh Content": FiZap,
    "Recently Updated": FiRefreshCw,
    "Latest Movies": FiCalendar,
  };
  return map[text] || FiTrendingUp;
};

const genreColors = ["#f5c518", "#a855f7", "#3b82f6", "#06b6d4", "#ec4899", "#22c55e", "#f97316", "#ef4444"];
const IMG_FALLBACK = "https://picsum.photos/seed/movie/300/170";

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const genreId = searchParams.get("genre") || "";
  const debounceRef = useRef(null);

  const [input, setInput] = useState(searchParams.get("search") || "");
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API}/movies`).then(r => r.json()),
      fetch(`${API}/genres`).then(r => r.json()),
    ])
      .then(([moviesData, genresData]) => {
        const movieList = Array.isArray(moviesData) ? moviesData : [];
        const genreList = Array.isArray(genresData) ? genresData : [];
        setMovies(movieList);
        setGenres(genreList);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [input, genreId]);

  const activeQuery = input;
  const filtered = movies.filter(m => {
    if (activeQuery) {
      const q = activeQuery.toLowerCase();
      const match = (m.title || "").toLowerCase().includes(q) ||
        (m.description || "").toLowerCase().includes(q) ||
        (m.genre || "").toLowerCase().includes(q) ||
        (m.interpreter || "").toLowerCase().includes(q);
      if (!match) return false;
    }
    if (genreId && m.genre_id != genreId) {
      const g = genres.find(x => x.id == genreId);
      if (g && !(m.genres || []).includes(g.name) && m.genre !== g.name) return false;
    }
    return true;
  });

  const PER_PAGE = 20;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageMovies = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const title = activeQuery ? `Search: ${activeQuery}` : "Browse Movies";
  const desc = activeQuery
    ? `Search results for "${activeQuery}"`
    : "Browse our full catalog of Kinyarwanda-interpreted movies.";

  return (
    <div className="space-y-1 pb-10">
      <SEO title={`${title} - AgasobanuyeFree Streaming`} description={desc} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold" style={{ color: "var(--text-primary)" }}>{title}</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{filtered.length} movie{filtered.length !== 1 ? "s" : ""} found{totalPages > 1 ? ` — Page ${currentPage} of ${totalPages}` : ""}</p>
        </div>
        <div className="relative max-w-xs w-full">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} size={16} />
          <input
            value={input}
            onChange={(e) => {
              const val = e.target.value;
              setInput(val);
              clearTimeout(debounceRef.current);
              debounceRef.current = setTimeout(() => {
                if (val) {
                  setSearchParams({ search: val, ...(genreId ? { genre: genreId } : {}) });
                } else {
                  setSearchParams(genreId ? { genre: genreId } : {});
                }
              }, 300);
            }}
            placeholder="Search movies..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl outline-none"
            style={{ backgroundColor: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border-color)" }}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 15 }, (_, i) => (
            <div key={i} className="rounded-xl overflow-hidden animate-pulse" style={{ backgroundColor: "var(--bg-card)" }}>
              <div className="aspect-video" style={{ backgroundColor: "var(--border-color)" }} />
              <div className="p-3 space-y-2">
                <div className="h-3 rounded w-3/4" style={{ backgroundColor: "var(--border-color)" }} />
                <div className="h-2 rounded w-1/2" style={{ backgroundColor: "var(--border-color)" }} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>No movies found</h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {activeQuery ? `No results for "${activeQuery}". Try a different search.` : "No movies available yet."}
          </p>
          <Link to="/movies" className="inline-block mt-4 px-6 py-2.5 bg-[#f5c518] text-black rounded-xl font-semibold text-sm">View All Movies</Link>
        </div>
      ) : (
        <>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {pageMovies.map((movie) => {
            const poster = movie.poster || movie.image || IMG_FALLBACK;
            const gColor = genreColors[(movie.genre_id || movie.id) % genreColors.length];
            return (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                className="group/card rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img loading="lazy"
                    src={poster}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                    onError={(e) => { e.target.src = IMG_FALLBACK; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                  {movie.badge && (
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#f5c518] text-black font-bold shadow-md">
                        {badgeIcon(movie.badge)({ size: 12 })} {movie.badge}
                      </span>
                    </div>
                  )}
                  {movie.quality && (
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover/card:opacity-100 transition-all duration-300 translate-y-2 group-hover/card:translate-y-0">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#f5c518] text-black font-bold">{movie.quality}</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold truncate flex items-center gap-1" style={{ color: "var(--text-primary)" }}>
                    {movie.type === "Season" && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500 text-white font-bold shrink-0">Season</span>}
                    {movie.type === "Episode" && <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500 text-white font-bold shrink-0">Episode</span>}
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {movie.rating && <span className="text-xs text-[#f5c518] font-semibold">★ {movie.rating}</span>}
                    {movie.year && <span className="text-xs" style={{ color: "var(--text-muted)" }}>{movie.year}</span>}
                    {movie.language && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: gColor + "20", color: gColor }}>{movie.language}</span>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-40 transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border-color)" }}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className="w-9 h-9 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
                style={{
                  backgroundColor: page === currentPage ? "#f5c518" : "var(--bg-card)",
                  color: page === currentPage ? "#000" : "var(--text-primary)",
                  border: "1px solid var(--border-color)",
                }}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-40 transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border-color)" }}
            >
              Next
            </button>
          </div>
        )}
        </>
      )}
    </div>
  );
}
