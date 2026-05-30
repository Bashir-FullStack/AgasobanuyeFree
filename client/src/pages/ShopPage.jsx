import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { API } from "../config";
import SEO from "../components/SEO";

const genreColors = ["#f5c518", "#a855f7", "#3b82f6", "#06b6d4", "#ec4899", "#22c55e", "#f97316", "#ef4444"];
const IMG_FALLBACK = "https://picsum.photos/seed/movie/300/170";

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const genreId = searchParams.get("genre") || "";

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const filtered = movies.filter(m => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
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

  const title = searchQuery ? `Search: ${searchQuery}` : "Browse Movies";
  const desc = searchQuery
    ? `Search results for "${searchQuery}"`
    : "Browse our full catalog of Kinyarwanda-interpreted movies.";

  return (
    <div className="space-y-1 pb-10">
      <SEO title={`${title} - AgasobanuyeFree Streaming`} description={desc} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold" style={{ color: "var(--text-primary)" }}>{title}</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{filtered.length} movie{filtered.length !== 1 ? "s" : ""} found</p>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.target); const q = fd.get("q"); if (q) window.location.href = `/movies?search=${encodeURIComponent(q)}`; }}
          className="relative max-w-xs w-full"
        >
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} size={16} />
          <input
            name="q"
            defaultValue={searchQuery}
            placeholder="Search movies..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl outline-none"
            style={{ backgroundColor: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border-color)" }}
          />
        </form>
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
            {searchQuery ? `No results for "${searchQuery}". Try a different search.` : "No movies available yet."}
          </p>
          <Link to="/movies" className="inline-block mt-4 px-6 py-2.5 bg-[#f5c518] text-black rounded-xl font-semibold text-sm">View All Movies</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((movie) => {
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
                  {movie.quality && (
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover/card:opacity-100 transition-all duration-300 translate-y-2 group-hover/card:translate-y-0">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#f5c518] text-black font-bold">{movie.quality}</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{movie.title}</h3>
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
      )}
    </div>
  );
}
