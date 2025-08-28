import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Calendar, Clock, Heart, Play, Star } from "lucide-react";

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  first_air_date?: string;
  runtime?: number;
  vote_average?: number;
  genres?: Genre[];
  media_type?: "movie" | "tv";
}

function MovieDetails() {
  const { movie_id, media_type } = useParams<{
    movie_id: string;
    media_type: "movie" | "tv";
  }>();
  const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [trailerKey, setTrailerKey] = useState("");
  const [trailerError, setTrailerError] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  const fallbackPoster =
    "https://nftcalendar.io/storage/uploads/2022/02/21/image-not-found_0221202211372462137974b6c1a.png";

  const getTitle = (item: Movie) => item.title ?? item.name ?? "Untitled";
  const getDate = (item: Movie) =>
    item.release_date ?? item.first_air_date ?? "Unknown date";

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://react-movie-details.onrender.com/movie/details/${media_type}/${movie_id}`
      );
      setMovieDetails(response.data.movie_data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrailer = async () => {
    try {
      const response = await axios.get(
        `https://react-movie-details.onrender.com/movie/trailer/${media_type}/${movie_id}`
      );
      setTrailerKey(response.data.trailer?.key);
      setShowTrailer(true);
    } catch (error: any) {
      if (error.response?.status === 404) setTrailerError(true);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
  }, [movie_id, media_type]);

  const SkeletonLoader = () => (
    <div className="min-h-screen flex flex-col lg:flex-row gap-12 items-start pt-20 px-6 md:px-12 max-w-7xl mx-auto animate-pulse">
      <div className="w-72 md:w-80 lg:w-96 h-[500px] bg-[#222] rounded-2xl" />
      <div className="flex-1 space-y-6">
        <div className="h-12 bg-[#222] rounded w-3/4"></div>
        <div className="flex flex-wrap gap-4">
          <div className="h-8 w-20 bg-[#222] rounded-full"></div>
          <div className="h-8 w-20 bg-[#222] rounded-full"></div>
          <div className="h-8 w-20 bg-[#222] rounded-full"></div>
        </div>
        <div className="h-4 bg-[#222] rounded w-full"></div>
        <div className="h-4 bg-[#222] rounded w-5/6"></div>
        <div className="h-4 bg-[#222] rounded w-2/3"></div>
        <div className="h-12 bg-[#222] rounded w-1/4 mt-4"></div>
      </div>
    </div>
  );

  if (loading) return <SkeletonLoader />;
  if (!movieDetails)
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Movie/TV Show not found
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white">
      <div
        className="relative min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${
            movieDetails.backdrop_path ||
            movieDetails.poster_path ||
            fallbackPoster
          })`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 container mx-auto px-6 md:px-12 max-w-7xl flex flex-col lg:flex-row gap-12 items-start pt-20">
          <img
            src={
              movieDetails.poster_path
                ? `https://image.tmdb.org/t/p/original${movieDetails.poster_path}`
                : fallbackPoster
            }
            alt={getTitle(movieDetails)}
            className="w-72 md:w-80 lg:w-96 rounded-2xl shadow-2xl border border-gray-700"
            onError={(e) => {
              e.currentTarget.src = fallbackPoster;
            }}
          />
          <div className="flex-1 space-y-6">
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {getTitle(movieDetails)}
            </h1>
            <div className="flex flex-wrap gap-4 text-gray-300">
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
                  {new Date(getDate(movieDetails)).getFullYear()}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-black bg-opacity-50 px-4 py-2 rounded-full">
                <Clock className="w-5 h-5 text-green-400" />
                <span className="font-medium">123 mins</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {movieDetails.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="px-6 py-2 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full text-sm font-semibold border border-gray-600 hover:border-gray-400 transition-all duration-300 cursor-pointer"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-100">Overview</h3>
              <p className="text-gray-300 leading-relaxed">
                {movieDetails.overview}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={fetchTrailer}
                className="flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Play className="w-6 h-6 fill-current" /> Watch Trailer
              </button>
              {showTrailer && trailerKey && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                  <div className="relative w-full max-w-4xl">
                    <iframe
                      className="w-full aspect-video rounded-xl"
                      src={`https://www.youtube.com/embed/${trailerKey}`}
                      title="Trailer"
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
                className={`flex items-center gap-3 px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                  isWishlisted
                    ? "bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700"
                    : "bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-600 hover:border-gray-400"
                }`}
              >
                <Heart
                  className={`w-6 h-6 ${isWishlisted ? "fill-current" : ""}`}
                />{" "}
                {isWishlisted ? "In Watchlist" : "Add to Watchlist"}
              </button>
            </div>
            <div className="pt-4">
              <p className="text-gray-400 text-lg">
                Released on{" "}
                <span className="text-white font-semibold">
                  {getDate(movieDetails)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-b from-black to-gray-900 py-20">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl text-center">
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
  );
}

export default MovieDetails;
