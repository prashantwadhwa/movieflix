import axios from "axios";

export const BASE_URL = "https://api.themoviedb.org/3";

export const getMoviesByGenre = async (genreId) => {
  const res = await axios.get(`${BASE_URL}/discover/movie`, {
    params: {
      api_key: import.meta.env.VITE_MOVIE_API,
      with_genres: genreId,
    },
  });
  return res.data.results
};
