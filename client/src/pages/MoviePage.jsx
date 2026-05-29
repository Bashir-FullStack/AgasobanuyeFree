import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { API } from "../config";

const FallbackPoster = "https://picsum.photos/seed/movie/400/600";

export default function MoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    setLoading(true);
    setShowPlayer(false);
    fetch(`${API}/movies/${id}`)
      .then(r => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then(data => { setMovie(data); setLoading(false); })
      .catch(() => { setLoading(false); navigate("/movies"); });
  }, [id]);

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

  const backdrop = movie.backdrop || movie.banner || movie.image || FallbackPoster;
  const poster = movie.poster || movie.image || FallbackPoster;
  const genres = movie.genres || (movie.genre ? [movie.genre] : []);
  const rating = movie.rating || 0;

  return (
    <div className="space-y-6 pb-10">
      <div className="relative rounded-2xl overflow-hidden min-h-[250px] lg:min-h-[400px]">
        <img
          src={backdrop}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.target.src = "https://picsum.photos/seed/backdrop/1200/600"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
        <div className="relative z-10 p-6 lg:p-10 flex flex-col justify-end min-h-[250px] lg:min-h-[400px]">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
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
              onClick={() => setShowPlayer(true)}
              className="inline-flex items-center gap-2 bg-[#f5c518] text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#d4a800] transition-all shadow-lg shadow-[#f5c518]/25"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              {showPlayer ? "Now Playing" : "Watch Now"}
            </button>
            <Link to="/movies" className="inline-flex items-center gap-2 glass px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[var(--bg-hover)] transition-all" style={{ color: "var(--text-primary)" }}>
              Back to Movies
            </Link>
          </div>
        </div>
      </div>

      {showPlayer && movie.video_url && (
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
          <div className="aspect-video">
            <video
              src={movie.video_url}
              controls
              autoPlay
              className="w-full h-full object-contain"
              style={{ backgroundColor: "#000" }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
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
            <img
              src={poster}
              alt={movie.title}
              className="w-full aspect-[2/3] object-cover"
              onError={(e) => { e.target.src = FallbackPoster; }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
