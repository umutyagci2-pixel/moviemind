import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchMovies = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/search-text?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setMovies(data.results || []);
    setLoading(false);
  };

  return (
    <div style={{
      backgroundColor: "#0d0d0d",
      color: "#fff",
      fontFamily: "Inter, sans-serif",
      minHeight: "100vh",
      padding: "3rem",
      textAlign: "center"
    }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🎬 MovieMind</h1>
      <p style={{ opacity: 0.8, marginBottom: "2rem" }}>
        Describe a movie, actor, or scene — and let AI find it.
      </p>

      <div>
        <input
          type="text"
          placeholder="e.g. dream within a dream Leonardo DiCaprio"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "60%",
            padding: "0.8rem",
            borderRadius: "8px",
            border: "none",
            outline: "none",
            fontSize: "1rem"
          }}
        />
        <button
          onClick={searchMovies}
          style={{
            marginLeft: "1rem",
            padding: "0.8rem 1.5rem",
            backgroundColor: "#7B61FF",
            border: "none",
            borderRadius: "8px",
            color: "#fff",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1.5rem",
        marginTop: "3rem"
      }}>
        {movies.map((movie) => (
          <div key={movie.id} style={{
            backgroundColor: "#1a1a1a",
            borderRadius: "10px",
            padding: "1rem",
            boxShadow: "0 0 10px rgba(255,255,255,0.1)"
          }}>
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              style={{
                width: "100%",
                borderRadius: "8px"
              }}
            />
            <h3 style={{ marginTop: "0.8rem" }}>{movie.title}</h3>
            <p style={{ opacity: 0.7, fontSize: "0.9rem" }}>
              {movie.release_date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
