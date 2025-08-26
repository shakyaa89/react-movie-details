import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Calendar, Clock, Heart, Play, Star } from "lucide-react";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  genres: Genre[];
  runtime: number;
  vote_average: number;
}

interface Genre {
  id: number;
  name: string;
}

function MovieDetails() {
  const { movie_id } = useParams<{ movie_id: string }>();
  const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [trailerKey, setTrailerKey] = useState("");
  const [trailerError, setTrailerError] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3001/movie/${movie_id}`
      );
      setMovieDetails(response?.data?.movie_data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrailer = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/movie/trailer/${movie_id}`
      );
      setTrailerKey(response?.data?.trailer?.key);
      console.log(trailerKey);
    } catch (error: any) {
      if (error.status === 404) {
        setTrailerError(true);
        return;
      }
    }
  };

  const handleTrailer = () => {
    fetchTrailer();
    setShowTrailer(true);
  };

  useEffect(() => {
    fetchMovies();

    console.log(movieDetails);
  }, [movie_id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="animate-pulse flex flex-col md:flex-row gap-8 max-w-5xl w-full p-8">
          <div className="bg-[#222] w-full md:w-1/3 h-96 rounded-xl"></div>
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-[#222] rounded w-3/4"></div>
            <div className="h-4 bg-[#222] rounded w-full"></div>
            <div className="h-4 bg-[#222] rounded w-full"></div>
            <div className="h-4 bg-[#222] rounded w-5/6"></div>
            <div className="flex flex-wrap gap-3 mt-4">
              <div className="h-6 bg-[#333] rounded-full w-20"></div>
              <div className="h-6 bg-[#333] rounded-full w-24"></div>
              <div className="h-6 bg-[#333] rounded-full w-16"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movieDetails) {
    return <div>Movie not found</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Backdrop */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Backdrop Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movieDetails.poster_path})`,
          }}
        >
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6 md:px-12 max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-12 items-start md:mt-20">
              {/* Movie Poster */}
              <div className="flex-shrink-0 transform hover:scale-105 transition-transform duration-300 mx-auto">
                <div className="relative group">
                  <img
                    src={`https://image.tmdb.org/t/p/original${movieDetails.poster_path}`}
                    alt={movieDetails.title}
                    className="w-72 md:w-80 lg:w-96 rounded-2xl shadow-2xl border border-gray-700"
                  />
                </div>
              </div>

              {/* Movie Information */}
              <div className="flex-1 space-y-8 text-center lg:text-left">
                {/* Title */}
                <div>
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {movieDetails.title}
                  </h1>
                </div>

                {/* Meta Information */}
                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-8 text-gray-300">
                  {movieDetails.vote_average && (
                    <div className="flex items-center gap-2 bg-black bg-opacity-50 px-4 py-2 rounded-full">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="text-lg font-bold text-yellow-500">
                        {movieDetails.vote_average.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-400">/10</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 bg-black bg-opacity-50 px-4 py-2 rounded-full">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <span className="font-medium">
                      {new Date(movieDetails.release_date).getFullYear()}
                    </span>
                  </div>

                  {movieDetails.runtime && (
                    <div className="flex items-center gap-2 bg-black bg-opacity-50 px-4 py-2 rounded-full">
                      <Clock className="w-5 h-5 text-green-400" />
                      <span className="font-medium">
                        {formatRuntime(movieDetails.runtime)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  {movieDetails.genres?.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-6 py-2 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full text-sm font-semibold border border-gray-600 hover:border-gray-400 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-800 transition-all duration-300 cursor-pointer"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                {/* Overview */}
                <div className="space-y-4 max-w-4xl">
                  <h3 className="text-2xl font-bold text-gray-100">Overview</h3>
                  <p className="text-gray-300 leading-relaxed text-lg font-light">
                    {movieDetails.overview}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center lg:justify-start">
                  <button
                    onClick={() => handleTrailer()}
                    className="flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Play className="w-6 h-6 fill-current" />
                    Watch Trailer
                  </button>
                  {showTrailer && trailerKey && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                      <div className="relative w-full max-w-4xl">
                        <iframe
                          className="w-full aspect-video rounded-xl"
                          src={`https://www.youtube.com/embed/${trailerKey}`}
                          title="Movie Trailer"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                        <button
                          onClick={() => setShowTrailer(false)}
                          className="absolute -top-10 right-0 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                  {trailerError && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                      <div className="relative w-full max-w-md bg-black rounded-xl p-6 text-center">
                        <h1 className="text-xl font-bold text-white mb-4">
                          Trailer Not Found
                        </h1>
                        <p className="text-gray-300 mb-4">
                          Sorry, we couldn't find a trailer for this movie.
                        </p>
                        <button
                          onClick={() => setTrailerError(false)}
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`flex items-center justify-center gap-3 px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                      isWishlisted
                        ? "bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700"
                        : "bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-600 hover:border-gray-400"
                    }`}
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        isWishlisted ? "fill-current" : ""
                      }`}
                    />
                    {isWishlisted ? "In Watchlist" : "Add to Watchlist"}
                  </button>
                </div>

                {/* Release Date */}
                <div className="pt-4">
                  <p className="text-gray-400 text-lg">
                    Released on{" "}
                    <span className="text-white font-semibold">
                      {formatDate(movieDetails.release_date)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Content Section */}
      <div className="bg-gradient-to-b from-black to-gray-900 py-20">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-300 mb-4">
              More Details Coming Soon
            </h2>
            <p className="text-gray-500">
              Cast information, reviews, and similar movies will be displayed
              here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
