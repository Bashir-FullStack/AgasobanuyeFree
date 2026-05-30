import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FiDownload, FiTrendingUp, FiZap, FiStar, FiArrowUp, FiAward, FiHeart, FiEye, FiThumbsUp, FiSun, FiMonitor, FiClock, FiPlus, FiCamera, FiRefreshCw, FiCalendar } from "react-icons/fi";

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
import { API } from "../config";
import SEO from "../components/SEO";

const FallbackPoster = "https://picsum.photos/seed/movie/400/600";
const BACKEND_BASE = API.replace("/api", "");

function resolveUrl(url) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${BACKEND_BASE}${url}`;
  return url;
}

export default function MoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [allMovies, setAllMovies] = useState([]);

  useEffect(() => {
    setLoading(true);
    setShowPlayer(false);
    setVideoError(false);
    fetch(`${API}/movies/${id}`)
      .then(r => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then(data => { setMovie(data); setLoading(false); })
      .catch(() => { setLoading(false); navigate("/movies"); });
  }, [id]);

  useEffect(() => {
    fetch(`${API}/movies`)
      .then(r => r.json())
      .then(data => setAllMovies(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="rounded-2xl h-[300px] lg:h-[450px]" style={{ backgroundColor: "var(--bg-card)" }} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 rounded w-3/4" style={{ backgroundColor: "var(--bg-card)" }} />
            <div className="h-4 rounded w-1/4" style={{ backgroundColor: "var(--bg-card)" }} />
            <div className="h-20 rounded" style={{ backgroundColor: "var(--bg-card)" }} />
          </div>
          <div className="space-y-3">
            <div className="h-40 rounded-xl" style={{ backgroundColor: "var(--bg-card)" }} />
          </div>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const backdrop = resolveUrl(movie.backdrop || movie.banner || movie.image) || FallbackPoster;
  const poster = resolveUrl(movie.poster || movie.image) || FallbackPoster;
  const genres = movie.genres || (movie.genre ? [movie.genre] : []);
  const rating = movie.rating || 0;
  const videoUrl = resolveUrl(movie.video_url);
  const seoTitle = `${movie.title} - AgasobanuyeFree Streaming`;
  const seoDesc = movie.description
    ? movie.description.length > 160
      ? movie.description.slice(0, 157) + "..."
      : movie.description
    : `Watch ${movie.title} on AgasobanuyeFree Streaming`;

  return (
    <div className="space-y-6 pb-10">
      <SEO title={seoTitle} description={seoDesc} image={poster} />
      <div className="relative rounded-2xl overflow-hidden min-h-[250px] lg:min-h-[400px]">
        <img loading="lazy"
          src={backdrop}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.target.src = "https://picsum.photos/seed/backdrop/1200/600"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
        <div className="relative z-10 p-6 lg:p-10 flex flex-col justify-end min-h-[250px] lg:min-h-[400px]">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            {movie.type === "Season" && <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400">Season</span>}
            {movie.type === "Episode" && <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400">Episode</span>}
            {genres.map((g, i) => (
              <span key={i} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#f5c518]/20 text-[#f5c518]">{g}</span>
            ))}
          </div>
          <h1 className="text-2xl lg:text-4xl xl:text-5xl font-extrabold mb-2 leading-tight" style={{ color: "var(--text-primary)" }}>
            {movie.title}
          </h1>
          <div className="flex items-center gap-4 text-sm flex-wrap" style={{ color: "var(--text-secondary)" }}>
            {movie.year && <span>{movie.year}</span>}
            {movie.duration && <span>{movie.duration} min</span>}
            {rating > 0 && <span className="text-[#f5c518] font-semibold">★ {rating}</span>}
            {movie.language && <span>{movie.language}</span>}
            {movie.quality && <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#f5c518] text-black">{movie.quality}</span>}
          </div>
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <button
              onClick={() => { setShowPlayer(true); setVideoError(false); }}
              className="inline-flex items-center gap-2 bg-[#f5c518] text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#d4a800] transition-all shadow-lg shadow-[#f5c518]/25"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              {showPlayer ? "Now Playing" : "Watch Now"}
            </button>
            {videoUrl && (
              <a
                href={videoUrl}
                download
                className="inline-flex items-center gap-2 bg-[#f5c518] text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#d4a800] transition-all shadow-lg shadow-[#f5c518]/25"
              >
                <FiDownload size={18} />
                Download
              </a>
            )}
            <Link to="/movies" className="inline-flex items-center gap-2 glass px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[var(--bg-hover)] transition-all" style={{ color: "var(--text-primary)" }}>
              Back to Movies
            </Link>
          </div>
        </div>
      </div>

      {showPlayer && videoUrl && !videoError && (
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
          <div className="aspect-video">
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
              style={{ backgroundColor: "#000" }}
              onError={() => setVideoError(true)}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}

      {showPlayer && videoError && (
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
          <svg className="mx-auto mb-3" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Failed to load video</p>
          <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
            The video could not be loaded. It may be unavailable or the URL may be incorrect.
          </p>
        </div>
      )}

      {showPlayer && !videoUrl && (
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
          <svg className="mx-auto mb-3" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}>
            <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
          </svg>
          <p className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>No video available</p>
          <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
            This movie does not have a video file yet. Check back later.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl p-5 lg:p-6" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text-primary)" }}>Synopsis</h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {movie.description || "No description available."}
            </p>
          </div>

          {movie.interpreter && (
            <div className="rounded-2xl p-5 lg:p-6" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
              <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text-primary)" }}>Interpreter</h2>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#f5c518] to-[#d4a800] flex items-center justify-center text-black font-bold text-lg">
                  {movie.interpreter.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{movie.interpreter}</p>
                  {movie.interpreter_id && (
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Kinyarwanda Interpreter</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl p-5" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <h3 className="text-sm font-bold mb-4" style={{ color: "var(--text-primary)" }}>Movie Info</h3>
            <div className="space-y-3 text-sm">
              {movie.country && (
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-muted)" }}>Country</span>
                  <span style={{ color: "var(--text-secondary)" }}>{movie.country}</span>
                </div>
              )}
              {movie.language && (
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-muted)" }}>Language</span>
                  <span style={{ color: "var(--text-secondary)" }}>{movie.language}</span>
                </div>
              )}
              {movie.year && (
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-muted)" }}>Year</span>
                  <span style={{ color: "var(--text-secondary)" }}>{movie.year}</span>
                </div>
              )}
              {movie.duration && (
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-muted)" }}>Duration</span>
                  <span style={{ color: "var(--text-secondary)" }}>{movie.duration} min</span>
                </div>
              )}
              {rating > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-muted)" }}>Rating</span>
                  <span className="text-[#f5c518] font-semibold">★ {rating}</span>
                </div>
              )}
              {movie.views > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-muted)" }}>Views</span>
                  <span style={{ color: "var(--text-secondary)" }}>{movie.views.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <img loading="lazy"
              src={poster}
              alt={movie.title}
              className="w-full aspect-[2/3] object-cover"
              onError={(e) => { e.target.src = FallbackPoster; }}
            />
          </div>
        </div>
      </div>

      {relatedMovies.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Related Movies</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            {relatedMovies.map(rm => (
              <Link key={rm.id} to={`/movie/${rm.id}`} className="group/card flex-shrink-0 w-[180px] lg:w-[200px] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
                <div className="relative aspect-video overflow-hidden">
                  <img src={rm.poster || rm.image || `https://picsum.photos/seed/movie${rm.id}/300/170`} alt={rm.title} className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                  {rm.quality && (
                    <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-0 group-hover/card:opacity-100 transition-all duration-300 translate-y-2 group-hover/card:translate-y-0">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#f5c518] text-black font-bold">{rm.quality}</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold truncate flex items-center gap-1" style={{ color: "var(--text-primary)" }}>
                    {rm.type === "Season" && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500 text-white font-bold shrink-0">Season</span>}
                    {rm.type === "Episode" && <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500 text-white font-bold shrink-0">Episode</span>}
                    {rm.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {rm.rating && <span className="text-xs text-[#f5c518] font-semibold">★ {rm.rating}</span>}
                    {rm.year && <span className="text-xs" style={{ color: "var(--text-muted)" }}>{rm.year}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
