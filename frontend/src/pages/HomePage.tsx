import { Link } from "react-router-dom";
import { Film } from "lucide-react";

function HomePage() {
  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-black to-gray-900 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 md:pb-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-7xl text-center">
          <h1 className="text-7xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            <span className="block sm:inline">Welcome</span>{" "}
            <span className="block sm:inline">to</span>{" "}
            <span className="block sm:inline">
              Movie<span className="text-red-600">DB</span>
            </span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg md:text-xl font-light max-w-xl mx-auto mt-4">
            Discover popular films and explore hidden gems
          </p>

          <div className="mt-6 sm:mt-8 flex justify-center">
            <Link
              to="/movie"
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 font-bold text-white shadow-lg hover:scale-105 transition-all text-sm sm:text-base"
            >
              Browse Movies
            </Link>
          </div>
        </div>
      </div>

      {/* Popular Movies Section */}
      <div className="bg-gradient-to-b from-gray-900 to-black pt-10 sm:pt-14 md:pt-20 pb-8 sm:pb-8 md:pb-10">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-5xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">
            Popular Movies
          </h2>
          <Link
            to="/movie"
            className="block max-w-sm mx-auto sm:max-w-none sm:mx-0 group bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-6 text-center hover:scale-105 transition-all shadow-lg border border-gray-700 hover:border-gray-500"
          >
            <Film className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg sm:text-xl font-bold mb-2">
              Browse Popular
            </h3>
            <p className="text-gray-400 text-sm sm:text-base">
              Stay updated with trending and top-rated films worldwide
            </p>
          </Link>
        </div>
      </div>
      <div className="bg-black text-center pb-6">
        <p className="text-gray-500 text-sm">
          Created by{" "}
          <span className="text-white font-semibold">Shashwat Shakya</span>
        </p>
      </div>
    </div>
  );
}

export default HomePage;
