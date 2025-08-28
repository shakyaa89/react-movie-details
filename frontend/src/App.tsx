import { Route, Routes } from "react-router-dom";
import "./App.css";
import DiscoverPage from "./pages/DiscoverPage";
import MovieDetails from "./components/MovieDetails";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie" element={<DiscoverPage />} />
        <Route path="/movie/:media_type/:movie_id" element={<MovieDetails />} />
        <Route
          path="*"
          element={
            <div className="mt-30 flex flex-col items-center justify-center bg-black p-4">
              <h1 className="text-6xl md:text-8xl font-bold mb-4 text-red-600">
                404
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white text-center">
                Page Not Found
              </h2>
              <p className="text-gray-400 text-center max-w-md">
                The page you are looking for does not exist.
              </p>
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;
