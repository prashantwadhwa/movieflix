import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../services/tmdb";
import axios from "axios";
import fallBackImg from "../../assets/fallback.jpeg";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import spinner from "../../assets/spinner.svg";
import { motion, AnimatePresence } from "framer-motion";
import CardSkeleton from "../../components/CardSkeleton/CardSkeleton";

function UserLibrary() {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [activeTab, setActiveTab] = useState("favorites");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getFavMovies = async () => {
    const favMovies = JSON.parse(localStorage.getItem("favorite-movies"));
    setLoading(true);
    try {
      const res = await Promise.all(
        favMovies.map((id) =>
          axios.get(`${BASE_URL}/movie/${id}`, {
            params: {
              api_key: import.meta.env.VITE_MOVIE_API,
            },
          }),
        ),
      );
      setFavoriteMovies(res.map((movie) => movie.data));
      setLoading(false);
    } catch (error) {
      console.error("Some Error Occurred", error);
      setLoading(false);
    }
  };

  const getWatchlistMovies = async () => {
    const watchMovies = JSON.parse(localStorage.getItem("watchlist-movies"));
    setLoading(true);
    try {
      const res = await Promise.all(
        watchMovies.map((id) =>
          axios.get(`${BASE_URL}/movie/${id}`, {
            params: {
              api_key: import.meta.env.VITE_MOVIE_API,
            },
          }),
        ),
      );
      setWatchlistMovies(res.map((movie) => movie.data));
      setLoading(false);
    } catch (error) {
      console.error("Some Error Occurred", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getFavMovies();
    getWatchlistMovies();
  }, []);

  const page = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const navTab = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        type: "spring",
        stiffness: 260,
        damping: 12,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const navTabChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const cardContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
    },
  };

  const movieCard = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={page}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="user-library mx-auto p-8 mt-[15vh] flex flex-col gap-10 items-center justify-center"
    >
      <motion.div
        variants={navTab}
        initial="hidden"
        animate="visible"
        className="nav-tab flex mx-auto gap-5 bg-transparent backdrop-blur-2xl rounded-full px-8 py-4 shadow-purple-600/15 hover:shadow-[4px_4px_20px_rgba(0,0,0,0.35)] shadow-[4px_4px_8px_rgba(0,0,0,0.25),4px_4px_8px_rgba(255,255,255,0.15)] brightness-150 transition-all duration-400"
      >
        <motion.div
          variants={navTabChildren}
          onClick={() => setActiveTab("favorites")}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className={`text-xl cursor-pointer font-bold px-5 pt-3 pb-2 rounded-full transition-all duration-300 ease-out
              ${
                activeTab === "favorites"
                  ? "border-b-2 border-t-2 border-t-transparent border-pink-600/35 from-blue-400/25 to-purple-600/25 backdrop-blur-lg text-white scale-105 hover:border-t-2 hover:border-pink-600/35"
                  : "border-b-2 border-t-2 border-transparent text-white/60 hover:text-white hover:border-2 hover:border-pink-600/35"
              }
            `}
        >
          Favorites
        </motion.div>

        <motion.div
          variants={navTabChildren}
          onClick={() => setActiveTab("watchlist")}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className={`text-xl cursor-pointer font-bold px-5 pt-3 pb-2 rounded-full transition-all duration-300 ease-out
        ${
          activeTab === "watchlist"
            ? "border-b-2 border-t-2 border-t-transparent border-pink-600/35 from-blue-400/25 to-purple-600/25 backdrop-blur-lg text-white scale-105 hover:border-t-2 hover:border-pink-600/35"
            : "border-b-2 border-t-2 border-transparent text-white/60 hover:text-white hover:border-2 hover:border-pink-600/35"
        }
      `}
        >
          Watchlist
        </motion.div>
      </motion.div>

      <div className="flex flex-col gap-10">
        {loading &&
          Array.from({ length: 5 }).map((_, index) => (
            <div
              className="fav-movies-skeleton grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              key={index}
            >
              <CardSkeleton />
            </div>
          ))}
        <AnimatePresence mode="wait">
          {activeTab === "favorites" && (
            <motion.div
              key={favoriteMovies.length}
              variants={cardContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fav-movies grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              {favoriteMovies.length > 0 ? (
                favoriteMovies.map((movie) => (
                  <motion.div
                    variants={movieCard}
                    className="fav-movie group rounded-lg cursor-pointer relative overflow-hidden"
                    key={movie?.id}
                    onClick={() => navigate(`/movie/${movie?.id}`)}
                  >
                    <div className="movie-img rounded-lg group-hover:scale-105 transition-all duration-300">
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500/${movie?.poster_path}`
                            : fallBackImg
                        }
                        alt=""
                      />
                    </div>
                    <div className="movie-overlay flex items-center text-center rounded-lg bg-linear-to-t from-black/85 to-transparent opacity-0 absolute bottom-0 inset-0 w-full transition-opacity duration-300 group-hover:opacity-100">
                      <div className="movie-label absolute bottom-0 justify-center w-full items-center">
                        <div className="movie-title text-xl font-bold text-center">
                          {movie?.original_title}
                        </div>
                        <div className="flex justify-between p-4 text-md font-light">
                          <span className="capitalize">
                            {movie?.media_type ? movie.media_type : "Movie"}
                          </span>
                          <div className="ratings flex gap-2 items-center">
                            <FaStar color="#9333ea" />
                            <span>{movie?.vote_average.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <h2 className="mx-auto col-span-4">Nothing to see here!</h2>
              )}
            </motion.div>
          )}

          {activeTab === "watchlist" && (
            <motion.div
              key={watchlistMovies.length}
              variants={cardContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="watchlist-movies grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              {watchlistMovies.length > 0 ? (
                watchlistMovies.map((movie) => (
                  <motion.div
                    variants={movieCard}
                    className="fav-movie group rounded-lg cursor-pointer relative overflow-hidden"
                    key={movie?.id}
                    onClick={() => navigate(`/movie/${movie?.id}`)}
                  >
                    <div className="movie-img rounded-lg group-hover:scale-105 transition-all duration-300">
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500/${movie?.poster_path}`
                            : fallBackImg
                        }
                        alt=""
                      />
                    </div>
                    <div className="movie-overlay flex items-center text-center rounded-lg bg-linear-to-t from-black/85 to-transparent opacity-0 absolute bottom-0 inset-0 w-full transition-opacity duration-300 group-hover:opacity-100">
                      <div className="movie-label absolute bottom-0 justify-center w-full items-center">
                        <div className="movie-title text-xl font-bold text-center">
                          {movie?.original_title}
                        </div>
                        <div className="flex justify-between p-4 text-md font-light">
                          <span className="capitalize">
                            {movie?.media_type ? movie.media_type : "Movie"}
                          </span>
                          <div className="ratings flex gap-2 items-center">
                            <FaStar color="#9333ea" />
                            <span>{movie?.vote_average.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <h2>Nothing to see here!</h2>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default UserLibrary;
