var express = require("express");
var router = express.Router();

const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

router.get("/", async (req, res) => {
  const page = req.query.page || 1;
  const search = req.query.search || "";

  try {
    let url;
    if (search.trim()) {
      url = `https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&query=${encodeURIComponent(
        search
      )}&page=${page}`;
    } else {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${MOVIE_API_KEY}&page=${page}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    return res.status(200).json({ movie_data: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch movies" });
  }
});

router.get("/:movie_id", async (req, res) => {
  const id = req.params.movie_id;
  try {
    const movieDetailsData = await fetch(`
https://api.themoviedb.org/3/movie/${id}?api_key=${MOVIE_API_KEY}`);
    const movieData = await movieDetailsData.json();
    return res.status(200).json({ movie_data: movieData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to fetch movies" });
  }
});

router.get("/trailer/:movie_id", async (req, res) => {
  const id = req.params.movie_id;
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        },
      }
    );

    const videoData = await response.json();
    const trailers = videoData.results.filter(
      (video) =>
        video.type === "Trailer" &&
        video.site === "YouTube" &&
        video.name === "Official Trailer"
    );

    if (trailers.length === 0) {
      return res.status(404).json({ error: "Trailer not found" });
    }

    return res.status(200).json({ trailer: trailers[0] });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to fetch movies" });
  }
});

module.exports = router;
