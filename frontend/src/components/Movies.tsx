import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Star } from "lucide-react";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  media_type: "movie" | "tv";
  runtime?: number;
  episode_run_time?: number;
}

function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMovies = async (pageNumber = 1, query = "") => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3001/movie/all?page=${pageNumber}&search=${query.trim()}`
      );
      const results = response?.data?.movie_data?.results || [];
      const filteredResults = results.filter(
        (item: Movie) => item.media_type === "movie" || item.media_type === "tv"
      );
      setMovies(filteredResults);
      console.log(filteredResults);
      setTotalPage(response?.data?.movie_data?.total_pages || 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(page, searchTerm);
  }, [page, searchTerm]);

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
      {Array.from({ length: 21 }).map((_, idx) => (
        <div key={idx} className="animate-pulse">
          <div className="bg-[#222] rounded-xl sm:rounded-2xl aspect-[2/3] mb-3 sm:mb-4"></div>
          <div className="bg-[#222] h-3 sm:h-4 rounded mb-2"></div>
          <div className="bg-[#222] h-2 sm:h-3 rounded w-2/3"></div>
        </div>
      ))}
    </div>
  );

  const MovieCard = ({ movie }: { movie: Movie }) => {
    const displayTitle =
      movie.media_type === "movie" ? movie.title : movie.name;
    const releaseYear =
      movie.media_type === "movie"
        ? movie.release_date
          ? new Date(movie.release_date).getFullYear()
          : "TBA"
        : movie.first_air_date
        ? new Date(movie.first_air_date).getFullYear()
        : "TBA";

    return (
      <Link
        to={`/movie/${movie.media_type}/${movie.id}`}
        className="group block"
      >
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-b from-gray-900 to-black transition-all duration-300 hover:scale-105 shadow-lg sm:shadow-2xl hover:shadow-2xl sm:hover:shadow-3xl border border-gray-700 hover:border-gray-500">
          <div className="aspect-[2/3] overflow-hidden relative">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={displayTitle}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src =
                  "https://nftcalendar.io/storage/uploads/2022/02/21/image-not-found_0221202211372462137974b6c1a.png";
              }}
            />
            {movie.vote_average && (
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex items-center gap-1 bg-black bg-opacity-70 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full backdrop-blur-sm">
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-500 fill-current" />
                <span className="text-yellow-500 text-xs font-bold">
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>
            )}
            <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white text-sm line-clamp-4 leading-relaxed font-light">
                  {movie.overview || "No overview available."}
                </p>
              </div>
            </div>
          </div>
          <div className="p-2 sm:p-4 space-y-2 sm:space-y-3">
            <h3 className="text-white font-bold text-sm sm:text-lg leading-tight line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
              {displayTitle}
            </h3>
            <div className="flex items-center gap-1 sm:gap-2 text-gray-400">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
              <span className="text-xs sm:text-sm font-medium">
                {releaseYear} &bull;{" "}
                {movie.media_type === "movie" ? "Movie" : "Series"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  const Pagination = () => {
    const getVisiblePages = () => {
      const delta = window.innerWidth < 640 ? 1 : 2;
      const range = [];
      const start = Math.max(1, page - delta);
      const end = Math.min(totalPage, page + delta);
      for (let i = start; i <= end; i++) range.push(i);
      return range;
    };

    return (
      <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3 mt-8 sm:mt-12 md:mt-16">
        <button
          disabled={page === 1}
          onClick={() => setPage(1)}
          className="hidden sm:block px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm font-bold text-gray-300 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg md:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-gray-600 hover:border-gray-400"
        >
          First
        </button>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 sm:px-6 md:px-8 py-2 md:py-3 text-xs sm:text-sm font-bold text-gray-300 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg md:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-gray-600 hover:border-gray-400"
        >
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </button>
        <div className="flex gap-1 sm:gap-2">
          {getVisiblePages().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`px-2 sm:px-3 md:px-4 py-2 md:py-3 text-xs sm:text-sm font-bold rounded-lg md:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                page === pageNum
                  ? "bg-gradient-to-r from-red-600 to-red-700 text-white"
                  : "text-gray-300 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-600 hover:border-gray-400"
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>
        <button
          disabled={page === totalPage}
          onClick={() => setPage(page + 1)}
          className="px-3 sm:px-6 md:px-8 py-2 md:py-3 text-xs sm:text-sm font-bold text-gray-300 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg md:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-gray-600 hover:border-gray-400"
        >
          <span className="hidden sm:inline">Next</span>
          <span className="sm:hidden">Next</span>
        </button>
        <button
          disabled={page === totalPage}
          onClick={() => setPage(totalPage)}
          className="hidden sm:block px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm font-bold text-gray-300 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg md:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-gray-600 hover:border-gray-400"
        >
          Last
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Search Input */}
      <div
        className={`flex justify-center p-6 gap-2 ${
          searchQuery ? "bg-gradient-to-t from-gray-900 to-black" : ""
        }`}
      >
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
            setSearchTerm(e.target.value);
          }}
          placeholder="Search movies or series..."
          className="w-full sm:w-1/2 px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
        />
      </div>

      {/* Hero Header */}
      {!searchTerm && (
        <div className="relative bg-gradient-to-b from-black to-gray-900 pt-10 sm:pt-10 pb-4 sm:pb-6 md:pb-8">
          <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-7xl">
            <div className="text-center space-y-3 sm:space-y-4 md:space-y-6">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Popular Movies & TV Shows
              </h1>
              <p className="text-gray-400 text-sm sm:text-lg md:text-xl font-light max-w-2xl mx-auto px-4">
                Discover the latest and greatest films and series from around
                the world
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-gradient-to-b from-gray-900 to-black pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-12 md:pb-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-7xl">
          {loading ? (
            <LoadingSkeleton />
          ) : movies.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
              <Pagination />
            </>
          ) : (
            <div className="text-center py-12 sm:py-16 md:py-20 px-4">
              <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">🎬</div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-300 mb-2 sm:mb-4">
                No movies or TV shows found
              </h2>
              <p className="text-gray-500 text-base sm:text-lg">
                Try changing your search or check your connection
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Movies;
