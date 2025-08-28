var express = require("express");
const {
  fetchMovies,
  fetchMovieTrailers,
  fetchAll,
  fetchAllDetails,
} = require("../controller/movieController");
var router = express.Router();

router.get("/", fetchMovies);

router.get("/details/:media_type/:movie_id", fetchAllDetails);

router.get("/trailer/:media_type/:movie_id", fetchMovieTrailers);

router.get("/all", fetchAll);

module.exports = router;
