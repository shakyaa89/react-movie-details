var express = require("express");
var router = express.Router();

const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

router.get("/", async (req, res) => {
  const page = req.query.page || 1;

  try {
    const movie_data = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${MOVIE_API_KEY}&page=${page}`
    );
    const movie_data_json = await movie_data.json();
    return res.status(200).json({ movie_data: movie_data_json });
  } catch (err) {
    console.log(err);
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

module.exports = router;
