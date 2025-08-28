const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

//for movies only
async function fetchMovies(req, res) {
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
}

//for movies only
async function fetchMovieDetails(req, res) {
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
}

async function fetchMovieTrailers(req, res) {
  const { movie_id, media_type } = req.params;

  if (!movie_id || !media_type) {
    return res.status(400).json({ error: "Missing id or type parameter" });
  }

  try {
    let url;
    if (media_type === "movie") {
      url = `https://api.themoviedb.org/3/movie/${movie_id}/videos`;
    } else if (media_type === "tv") {
      url = `https://api.themoviedb.org/3/tv/${movie_id}/videos`;
    } else {
      return res.status(400).json({ error: "Invalid type parameter" });
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    });

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
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch videos" });
  }
}

//for movies and series
async function fetchAll(req, res) {
  const page = req.query.page || 1;
  const search = req.query.search || "";

  try {
    let url;
    if (search.trim()) {
      url = `https://api.themoviedb.org/3/search/multi?api_key=${MOVIE_API_KEY}&query=${encodeURIComponent(
        search
      )}&page=${page}`;
    } else {
      url = `https://api.themoviedb.org/3/trending/all/week?api_key=${MOVIE_API_KEY}&page=${page}`;
    }

    const response = await fetch(url);
    const unfilteredData = await response.json();

    return res.status(200).json({ movie_data: unfilteredData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch movies" });
  }
}
//for movies and series
async function fetchAllDetails(req, res) {
  const { movie_id, media_type } = req.params;
  try {
    let url;
    if (media_type === "movie") {
      url = `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${MOVIE_API_KEY}`;
    } else if (media_type === "tv") {
      url = `https://api.themoviedb.org/3/tv/${movie_id}?api_key=${MOVIE_API_KEY}`;
    } else {
      return res.status(400).json({ error: "Invalid type parameter" });
    }

    const response = await fetch(url);
    const data = await response.json();

    return res.status(200).json({ movie_data: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch details" });
  }
}

module.exports = {
  fetchMovies,
  fetchMovieDetails,
  fetchMovieTrailers,
  fetchAll,
  fetchAllDetails,
};
