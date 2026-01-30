import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import starIcon from "../../assets/star.svg";
import spinner from "../../assets/spinner.svg";
import heroBg from "../../assets/hero-bg.png";
import { GoHome, GoPlus } from "react-icons/go";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import {
  FaPlayCircle,
  FaClock,
  FaStar,
  FaVolumeMute,
  FaVolumeUp,
  FaCheck,
  FaPlus,
  FaPause,
  FaPlay,
} from "react-icons/fa";

import { motion, scale } from "framer-motion";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css";

import fallBackImg from "../../assets/fallback.jpeg";
import axios from "axios";
import "../../App.scss";
import "./Movie.scss";
import { toast } from "react-toastify";
import ScrollTop from "../../components/ScrollTop/ScrollTop";
import { IoIosArrowBack } from "react-icons/io";
import BackButton from "../../components/BackButton/BackButton";
import { BASE_URL } from "../../services/tmdb";

function Movie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [movieCredits, setMovieCredits] = useState([]);
  const [movieImgs, setMovieImgs] = useState([]);
  const [movieTrailer, setMovieTrailer] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [trailerKey, setTrailerKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [imgLoading, setImgLoading] = useState(true);
  const [movieOpen, setMovieOpen] = useState(false);
  const [showVid, setShowVid] = useState(false);
  const [movieReviews, setMovieReviews] = useState([]);
  const [inFavs, setInFavs] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [inCollection, setInCollection] = useState([]);
  const [collectionData, setCollectionData] = useState(null);

  const [isMuted, setIsMuted] = useState(true);

  const navigate = useNavigate();

  const getMovieData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
        params: {
          api_key: import.meta.env.VITE_MOVIE_API,
        },
      });

      const collection = res.data?.belongs_to_collection;

      if (collection) {
        const collectionRes = await axios.get(
          `https://api.themoviedb.org/3/collection/${collection?.id}`,
          {
            params: {
              api_key: import.meta.env.VITE_MOVIE_API,
            },
          },
        );
        setInCollection(collection);
        setCollectionData(collectionRes.data);
      }

      setMovie(res.data);
      setLoading(false);
    } catch (error) {
      console.error("some error occured", error);
      setLoading(false);
    }
  };

  const getMovieCast = async () => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/credits`,
        {
          params: {
            api_key: import.meta.env.VITE_MOVIE_API,
          },
        },
      );

      setMovieCredits(res.data.cast);
      setLoading(false);
    } catch (error) {
      console.error("some error occured", error);
      setLoading(false);
    }
  };

  const getMovieImgs = async () => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/images`,
        {
          params: {
            api_key: import.meta.env.VITE_MOVIE_API,
          },
        },
      );

      const enLogo = res.data.logos.find((logo) => logo.iso_639_1 === "en");

      setMovieImgs(enLogo.file_path);
      setLoading(false);
    } catch (error) {
      console.error("some error occured", error);
      setLoading(false);
    }
  };

  const getMovieTrailer = async () => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/videos`,
        {
          params: {
            api_key: import.meta.env.VITE_MOVIE_API,
          },
        },
      );

      const trailer = res.data.results.find(
        (trailer) => trailer.site === "YouTube" && trailer.type === "Trailer",
      );

      setTrailerKey(trailer?.key);
      setLoading(false);
    } catch (error) {
      console.error("some error occured", error);
      setLoading(false);
    }
  };

  const formatRuntime = (runtime) => {
    const h = Math.floor(runtime / 60);
    const m = Math.floor(runtime % 60);

    return `${h}h ${m}m`;
  };

  const getRecommendations = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/similar`,
        {
          params: {
            api_key: import.meta.env.VITE_MOVIE_API,
          },
        },
      );

      setRecommendedMovies(res.data.results);
    } catch (error) {
      console.error("some error occured", error);
    }
  };

  const getPopularMovies = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/popular`,
        {
          params: {
            api_key: import.meta.env.VITE_MOVIE_API,
          },
        },
      );

      setPopularMovies(res.data.results);
      setLoading(false);
    } catch (error) {
      console.error("some error occured", error);
      setLoading(false);
    }
  };

  const getMovieReviews = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/movie/${id}/reviews`, {
        params: {
          api_key: import.meta.env.VITE_MOVIE_API,
        },
      });
    } catch (error) {
      console.error("Some error occured", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = movieOpen && "hidden";
    getMovieData();
    getMovieCast();
    getMovieImgs();
    getMovieTrailer();
    formatRuntime();
    getRecommendations();
    getPopularMovies();
    getMovieReviews();

    const favMovies = JSON.parse(localStorage.getItem("favorite-movies")) || [];
    setInFavs(favMovies.includes(id));

    const watchList =
      JSON.parse(localStorage.getItem("watchlist-movies")) || [];
    setInWatchlist(watchList.includes(id));
  }, [id, movieOpen]);

  const addToFav = (movieId) => {
    const favMovies = JSON.parse(localStorage.getItem("favorite-movies")) || [];

    if (!favMovies.includes(movieId)) {
      favMovies.push(movieId);
      localStorage.setItem("favorite-movies", JSON.stringify(favMovies));
      setInFavs(true);
    }
  };

  const addToWatchlist = (movieId) => {
    const watchList =
      JSON.parse(localStorage.getItem("watchlist-movies")) || [];

    if (!watchList.includes(movieId)) {
      watchList.push(movieId);
      localStorage.setItem("watchlist-movies", JSON.stringify(watchList));
      setInWatchlist(true);
    }
  };

  const removeFromFavs = (movieId) => {
    const favMovies = JSON.parse(localStorage.getItem("favorite-movies"));

    const updatedFavs = favMovies.filter((id) => id !== movieId);

    localStorage.setItem("favorite-movies", JSON.stringify(updatedFavs));
    setInFavs(false);
  };

  const removeFromWatchlist = (movieId) => {
    const watchList = JSON.parse(localStorage.getItem("watchlist-movies"));

    const updatedWatchlist = watchList.filter((id) => id !== movieId);

    localStorage.setItem("watchlist-movies", JSON.stringify(updatedWatchlist));
    setInWatchlist(false);
  };

  const LikedIcon = motion(MdFavorite);
  const LikedIconBorder = motion(MdFavoriteBorder);

  const PlayIcon = motion(FaPlayCircle);

  const watchBtn = {
    rest: {
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      boxShadow: "0px 4px 10px rgba(168,85,247,0.15)",
    },
    hover: {
      scale: 1.08,
      rotateX: 10,
      rotateY: -8,
      rotateZ: 2,
      boxShadow: "0px 12px 20px rgba(168,85,247,0.25)",
    },
    tap: {
      scale: 0.95,
      rotateX: 5,
      rotateY: -5,
      rotateZ: -2,
      boxShadow: "0px 4px 10px rgba(168,85,247,0.25)",
    },
  };

  const watchBtnIcon = {
    rest: { y: 0 },
    hover: {
      y: [-2, 2, -2],
      transition: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 1.6,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <main
        className="movie-page min-h-screen relative bg-gray-100"
        onLoad={() => setLoading(false)}
      >
        <ScrollTop />
        {loading && (
          <div className="loading flex justify-center mt-16 show absolute top-0">
            <img src={spinner} alt="" width={50} height={50} />
          </div>
        )}

        <div className="pattern relative h-screen overflow-hidden">
          {/* <BackButton /> */}

          <div className="unmute-btn rounded-full p-3 absolute right-10 bottom-30 z-40 border border-white cursor-pointer hover:scale-105 transition-all duration-300">
            {showVid ? (
              <FaPause className="w-3 h-3" onClick={() => setShowVid(false)} />
            ) : (
              <FaPlay className="w-3 h-3" onClick={() => setShowVid(true)} />
            )}
          </div>

          {imgLoading && (
            <div className="absolute inset-0 flex justify-center items-center z-10 bg-black/40">
              <img src={spinner} alt="loading" width={50} height={50} />
            </div>
          )}
          {!showVid ? (
            <img
              src={`https://image.tmdb.org/t/p/original${movie?.backdrop_path}`}
              alt="heroBg"
              className={`hero-bg-img object-center absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${imgLoading ? "opacity-0" : "opacity-100"}`}
              onLoad={() => setImgLoading(false)}
            />
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${isMuted ? "1" : "0"}&loop=1&controls=0&showinfo=0&rel=0`}
              allow="autoplay; fullscreen"
              allowFullScreen
              frameBorder="0"
              className="absolute inset-0 w-full h-full object-cover scale-120"
              id="player"
            ></iframe>
          )}

          <div className="hero-bg-overlay" />
          <div className="hero-content absolute bottom-0 left-0 right-0">
            <div className="inner-content flex flex-col gap-10 px-8 py-8">
              <div className="movie-container max-w-5xl flex flex-col md:flex-row gap-8 justify-between">
                <div className="details flex-1 flex flex-col gap-4">
                  <div className="logo-section">
                    {movieImgs.length > 0 ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movieImgs}`}
                        alt=""
                        className="w-75"
                      />
                    ) : (
                      <span className="text-3xl font-bold uppercase">
                        {movie?.title}
                      </span>
                    )}
                  </div>
                  <p className="text-white font-extralight line-clamp-3">
                    {movie?.overview}
                  </p>

                  <div className="additional-info flex flex-wrap gap-4 text-white">
                    <span className="flex items-center gap-2">
                      <FaClock /> {formatRuntime(movie?.runtime)}
                    </span>
                    <span>Release: {movie?.release_date}</span>
                    <span>Rating: {movie?.vote_average.toFixed(1)}</span>
                    <span>
                      Language: {movie?.original_language.toUpperCase()}
                    </span>
                  </div>

                  <div className="genres flex gap-2 mt-2">
                    {movie?.genres?.map((g) => (
                      <span
                        key={g.id}
                        className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm"
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                  <div className="btns flex gap-6 items-center">
                    <motion.div className="watch-btn mt-2 perspective-midrange">
                      <motion.button
                        variants={watchBtn}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        transition={{ duration: 0.15 }}
                        className="text-purple-600 bg-white! hover:bg-purple-600! hover:text-white! text-lg font-semibold px-3! duration-300! transition-all! mt-3 hover:outline-none!"
                        onClick={() => navigate(`/movie/${id}/player`)}
                      >
                        <motion.span className="flex gap-2 items-center">
                          <PlayIcon variants={watchBtnIcon} />
                          Watch Now
                        </motion.span>
                      </motion.button>
                    </motion.div>

                    <div className="favorite-btn mt-2">
                      <motion.button
                        whileHover={{
                          scale: 1.08,
                          rotateX: 10,
                          rotateY: -8,
                          rotateZ: 2,
                          boxShadow: "0px 12px 20px rgba(168,85,247,0.25)",
                        }}
                        whileTap={{
                          scale: 0.95,
                          rotateX: 5,
                          rotateY: -5,
                          rotateZ: -2,
                          boxShadow: "0px 4px 10px rgba(168,85,247,0.25)",
                        }}
                        transition={{ duration: 0.15 }}
                        className="text-purple-600 bg-white! hover:bg-purple-600! hover:text-white! text-lg font-semibold px-3! duration-300! transition-all! mt-3 hover:outline-none!"
                        onClick={() =>
                          !inFavs ? addToFav(id) : removeFromFavs(id)
                        }
                      >
                        {inFavs ? (
                          <motion.span
                            whileHover={{ y: -2 }}
                            className="flex gap-2 items-center"
                          >
                            <div className="liked-icon">
                              <LikedIcon
                                initial={{ scale: 1 }}
                                animate={{ scale: 1.1 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 200,
                                  damping: 12,
                                  repeat: Infinity,
                                  repeatType: "loop",
                                  duration: 2,
                                }}
                              />
                            </div>
                            <span>Added to Favorites</span>
                          </motion.span>
                        ) : (
                          <motion.span
                            whileHover={{ y: -2 }}
                            className="flex gap-2 items-center"
                          >
                            <div className="liked-icon-border">
                              <LikedIconBorder />
                            </div>{" "}
                            <span> Add to Favorites</span>
                          </motion.span>
                        )}
                      </motion.button>
                    </div>

                    <div className="watchlist-btn mt-2">
                      <button
                        className="flex gap-3 items-center rounded-full! w-10 h-10 px-3.5! text-purple-600 bg-white! hover:bg-purple-600! hover:text-white! text-lg font-semibold duration-300! transition-all! mt-3 hover:outline-none!"
                        onClick={() =>
                          !inWatchlist
                            ? addToWatchlist(id)
                            : removeFromWatchlist(id)
                        }
                      >
                        {inWatchlist ? (
                          <>
                            <FaCheck className="w-3 h-3" />
                          </>
                        ) : (
                          <>
                            <FaPlus className="w-3 h-3" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="wrapper p-8 flex flex-col relative z-10 gap-10 h-full">
          <div className="bottom-section flex flex-col gap-10">
            {trailerKey && (
              <div className="trailer-container flex flex-col gap-4">
                <div className="trailer-header">
                  <span className="text-2xl font-bold text-white">
                    {movie?.title} Trailer
                  </span>
                </div>
                <iframe
                  src={`https://www.youtube.com/embed/${trailerKey}`}
                  className="rounded-xl"
                ></iframe>
              </div>
            )}

            {inCollection && (
              <div className="collection-container flex flex-col gap-4 items-start">
                <div className="collection-header">
                  <span className="text-2xl font-bold text-white">
                    {inCollection?.name}
                  </span>
                </div>
                <div className="collection-movies flex gap-4">
                  {collectionData?.parts.map((movie) => (
                    <div
                      className="collection-card relative group cursor-pointer"
                      onClick={() => navigate(`/movie/${movie?.id}`)}
                    >
                      <img
                        src={
                          movie?.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie?.poster_path}`
                            : fallBackImg
                        }
                        loading="lazy"
                        alt={movie?.name}
                        className="w-62 object-contain rounded-lg"
                      />
                      <div className="img-overlay rounded-lg bg-linear-to-t from-black/85 to-transparent opacity-0 absolute inset-0 w-full transition-opacity duration-300 group-hover:opacity-100">
                        {" "}
                        <div className="movie-label absolute bottom-0 justify-center w-full items-center">
                          <div className="movie-title text-xl font-bold text-center">
                            {movie?.original_title}
                          </div>
                          <div className="flex justify-between p-4 text-lg font-light">
                            <span className="capitalize">
                              {movie?.media_type || Movie}
                            </span>
                            <div className="ratings flex gap-2 items-center">
                              <FaStar color="#9333ea" />
                              <span>{movie?.vote_average.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="cast-slider-container flex flex-col gap-4">
              <div className="cast-header">
                <span className="text-2xl font-bold text-white">
                  Featured Cast
                </span>
              </div>
              <Swiper
                grabCursor={true}
                freeMode={true}
                spaceBetween={16}
                breakpoints={{
                  320: { slidesPerView: 1, spaceBetween: 12 },
                  640: { slidesPerView: 1.2, spaceBetween: 12 },
                  768: { slidesPerView: 3, spaceBetween: 12 },
                  1024: { slidesPerView: 4, spaceBetween: 20 },
                  1350: { slidesPerView: 5, spaceBetween: 22 },
                  1500: { slidesPerView: 5.5, spaceBetween: 24 },
                }}
                modules={[Navigation]}
                navigation={true}
                centeredSlides={false}
                className="cast-swiper"
              >
                {movieCredits.map((cast) => (
                  <SwiperSlide key={cast?.id}>
                    <div className="cast-card w-full flex rounded-md gap-5 relative">
                      <div className="cast-img w-full">
                        <img
                          src={
                            cast.profile_path
                              ? `https://image.tmdb.org/t/p/w500${cast?.profile_path}`
                              : fallBackImg
                          }
                          loading="lazy"
                          alt={cast?.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="cast-text-content pb-4 absolute bottom-0 text-center w-full bg-linear-to-t from-black/99 via-black to-purple-600/5">
                        <div className="cast-name text-md max-md:font-bold md:text-2xl md:font-semibold">
                          {cast?.name}
                        </div>
                        <div className="cast-character max-md:text-sm">
                          {cast?.character}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="recommendation-slider-container flex flex-col gap-4">
              <div className="next-header">
                <span className="text-2xl font-bold text-white">
                  What to watch next
                </span>
              </div>
              <Swiper
                grabCursor={true}
                freeMode={true}
                spaceBetween={16}
                breakpoints={{
                  320: { slidesPerView: 1, spaceBetween: 12 },
                  640: { slidesPerView: 1.2, spaceBetween: 12 },
                  768: { slidesPerView: 3, spaceBetween: 12 },
                  1024: { slidesPerView: 4, spaceBetween: 20 },
                  1350: { slidesPerView: 5, spaceBetween: 22 },
                  1500: { slidesPerView: 5.5, spaceBetween: 24 },
                }}
                modules={[Navigation]}
                navigation={true}
                centeredSlides={false}
                className="recommendations-swiper"
              >
                {recommendedMovies.length > 0
                  ? recommendedMovies?.map((movie) => (
                      <SwiperSlide
                        key={movie?.id}
                        className="rounded-lg transition-all duration-300 rec"
                      >
                        <div
                          className="movie-card group relative rounded-lg overflow-hidden transition-all duration-300 cursor-pointer"
                          onClick={() => navigate(`/movie/${movie?.id}`)}
                        >
                          <div className="movie-poster h-full w-full">
                            <img
                              src={
                                movie?.poster_path
                                  ? `https://image.tmdb.org/t/p/w500${movie?.poster_path}`
                                  : fallBackImg
                              }
                              loading="lazy"
                              className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-all duration-300"
                              alt={movie?.original_title}
                            />
                            <div className="img-overlay rounded-lg bg-linear-to-t from-black/85 to-transparent opacity-0 absolute inset-0 w-full transition-opacity duration-300 group-hover:opacity-100">
                              {" "}
                              <div className="movie-label absolute bottom-0 justify-center w-full items-center">
                                <div className="movie-title text-xl font-bold text-center">
                                  {movie?.original_title}
                                </div>
                                <div className="flex justify-between p-4 text-lg font-light">
                                  <span className="capitalize">
                                    {movie?.media_type}
                                  </span>
                                  <div className="ratings flex gap-2 items-center">
                                    <FaStar color="#9333ea" />
                                    <span>
                                      {movie?.vote_average.toFixed(1)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))
                  : popularMovies.map((popularMovie) => (
                      <SwiperSlide
                        key={popularMovie?.id}
                        className="rounded-lg transition-all duration-300 pop"
                      >
                        <div
                          className="movie-card group relative rounded-lg overflow-hidden transition-all duration-300 cursor-pointer"
                          onClick={() => navigate(`/movie/${popularMovie?.id}`)}
                        >
                          <div className="movie-poster h-full w-full">
                            <img
                              src={
                                popularMovie?.poster_path
                                  ? `https://image.tmdb.org/t/p/w780${popularMovie?.poster_path}`
                                  : fallBackImg
                              }
                              className="w-full h-full object-cover object-top rounded-lg group-hover:scale-105 transition-transform duration-300"
                              alt={popularMovie?.original_title}
                            />
                            <div className="img-overlay rounded-lg bg-linear-to-t from-black/85 to-transparent opacity-0 absolute inset-0 w-full transition-opacity duration-300 group-hover:opacity-100">
                              {" "}
                              <div className="movie-label absolute bottom-0 justify-center w-full items-center">
                                <div className="movie-title text-xl font-bold text-center">
                                  {popularMovie?.original_title}
                                </div>
                                <div className="flex justify-between p-4 text-lg font-light">
                                  <span className="capitalize">
                                    {popularMovie?.media_type || "Movie"}
                                  </span>
                                  <div className="ratings flex gap-2 items-center">
                                    <FaStar color="#9333ea" />
                                    <span>
                                      {popularMovie?.vote_average.toFixed(1)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
              </Swiper>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
export default Movie;
