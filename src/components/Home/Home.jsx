import React, { useEffect, useState } from "react";
import heroBg from "../../assets/hero-bg.png";
import spinner from "../../assets/spinner.svg";
import ScrollTop from "../../components/ScrollTop/ScrollTop";
import fallBackImg from "../../assets/fallback.jpeg";
import axios from "axios";
import { SwiperSlide, Swiper } from "swiper/react";
import { FaClock, FaStar } from "react-icons/fa";
import { IoIosPlayCircle } from "react-icons/io";
import "./Home.scss";
import { Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { BASE_URL, getMoviesByGenre } from "../../services/tmdb.js";
import { HOME_GENRES } from "../../config/genres.js";
import CardSkeleton from "../CardSkeleton/CardSkeleton.jsx";
import { animate, easeIn, motion } from "framer-motion";

function Home() {
  const [topMovies, setTopMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [trendingMovie, setTrendingMovie] = useState();
  const [trendingMovieData, setTrendingMovieData] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trailerKey, setTrailerKey] = useState("");
  const [imgLoading, setImgLoading] = useState(true);
  const [showVid, setShowVid] = useState(false);
  const [trendingMovieImg, setTrendingMovieImg] = useState([]);
  const [sections, setSections] = useState([]);

  const [loading, setLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [popularLoading, setPopularLoading] = useState(true);
  const [topLoading, setTopLoading] = useState(true);
  const [genresLoading, setGenresLoading] = useState(true);

  const navigate = useNavigate();

  const containerVariant = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.2 },
    },
  };

  const cardVariant = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  const movieDets = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const movieDetsChildren = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.65, ease: "easeInOut" },
    },
  };

  const genresParent = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const genresChildren = {
    hidden: { opacity: 0, x: -20, scale: 0.85 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 250,
        damping: 18,
      },
    },
  };

  const logoImg = {
    hidden: { opacity: 0, scale: 0.6 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 18,
      },
    },
  };

  const getTopMovies = async () => {
    setTopLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/movie/top_rated`, {
        params: {
          api_key: import.meta.env.VITE_MOVIE_API,
        },
      });
      setLoading(false);
      setTopMovies(res.data.results);
      setTopLoading(false);
    } catch (error) {
      console.error("Some error occured", error);
      setTopLoading(false);
    }
  };

  const getPopuplarMovies = async () => {
    setPopularLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/movie/popular`, {
        params: {
          api_key: import.meta.env.VITE_MOVIE_API,
        },
      });
      setLoading(false);
      setPopularMovies(res.data.results);
      setPopularLoading(false);
    } catch (error) {
      console.error("Some error occured", error);
      setPopularLoading(false);
    }
  };

  const getTrendingMovies = async () => {
    setTrendingLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/trending/movie/day`, {
        params: {
          api_key: import.meta.env.VITE_MOVIE_API,
        },
      });

      const firstMovie = res.data.results[0];

      const trendingMovieImage = await axios.get(
        `${BASE_URL}/movie/${firstMovie?.id}/images`,
        {
          params: {
            api_key: import.meta.env.VITE_MOVIE_API,
          },
        },
      );

      const enLogo = trendingMovieImage?.data.logos.find(
        (logo) => logo.iso_639_1 === "en",
      ).file_path;
      const trendingImgLogo = `https://image.tmdb.org/t/p/w500${enLogo}`;
      setTrendingMovieImg(trendingImgLogo);

      const trendingMovieMetadata = await axios.get(
        `${BASE_URL}/movie/${firstMovie?.id}`,
        {
          params: {
            api_key: import.meta.env.VITE_MOVIE_API,
          },
        },
      );

      setTrendingMovieData(trendingMovieMetadata.data);

      setTrendingMovie(firstMovie);
      setTrendingMovies(res.data.results);
      setTrendingLoading(false);
      console.log("trening movies today-", res.data.results);
    } catch (error) {
      console.error("Some error occured", error);
      setTrendingLoading(false);
    }
  };

  const loadMovies = async () => {
    try {
      setGenresLoading(true);
      const data = await Promise.all(
        HOME_GENRES.map(async (genre) => {
          const movies = await getMoviesByGenre(genre?.id);

          return {
            ...genre,
            movies,
          };
        }),
      );
      console.log(data);
      setSections(data);
      setGenresLoading(false);
    } catch (error) {
      console.error("some error occured", error);
    }
  };

  const formatRuntime = (runtime) => {
    const h = Math.floor(runtime / 60);
    const m = Math.floor(runtime % 60);

    return `${h}h ${m}m`;
  };

  useEffect(() => {
    getTopMovies();
    getPopuplarMovies();
    getTrendingMovies();
    loadMovies();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{opacity: 0}}>
      <main
        className="home-hero min-h-screen relative bg-gray-100 overflow-x-hidden"
        onLoad={() => setLoading(false)}
      >
        <div className="home-header-bg absolute w-screen h-181.75 bg-center bg-no-repeat left-1/2 top-0 -translate-x-1/2"></div>
        <ScrollTop />
        <div className="pattern relative h-screen overflow-hidden">
          {imgLoading && (
            <div className="absolute inset-0 flex justify-center items-center z-10 bg-black/40">
              <img src={spinner} alt="loading" width={50} height={50} />
            </div>
          )}
          {!showVid ? (
            <img
              src={`https://image.tmdb.org/t/p/original${trendingMovie?.backdrop_path}`}
              alt="heroBg"
              className={`hero-bg-img object-center absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${imgLoading ? "opacity-0" : "opacity-100"}`}
              onLoad={() => setImgLoading(false)}
            />
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&loop=0&controls=0&showinfo=0&rel=0`}
              allow="autoplay; fullscreen"
              allowFullScreen
              frameBorder="0"
              className="absolute inset-0 w-full h-full object-cover scale-110"
            ></iframe>
          )}

          <div className="hero-bg-top-overlay"></div>
          <div className="hero-bg-overlay"></div>
          <div className="hero-content absolute bottom-4 left-0 right-0">
            <div className="inner-content flex flex-col gap-10 px-8">
              <div className="movie-container max-w-5xl flex flex-col md:flex-row gap-8">
                <motion.div
                  variants={movieDets}
                  initial="hidden"
                  animate="visible"
                  className="details flex-1 flex flex-col gap-4"
                >
                  <motion.div
                    variants={movieDetsChildren}
                    className="logo-section"
                  >
                    {trendingMovieImg ? (
                      <motion.img
                        variants={logoImg}
                        src={trendingMovieImg}
                        alt=""
                        className="w-75"
                      />
                    ) : (
                      <motion.img
                        variants={logoImg}
                        src="/fallback.jpeg"
                        alt="fallback"
                      />
                    )}
                  </motion.div>

                  <motion.p
                    variants={movieDetsChildren}
                    className="text-white text-sm font-extralight line-clamp-3 w-1/2"
                  >
                    {trendingMovie?.overview}
                  </motion.p>

                  <motion.div
                    variants={movieDetsChildren}
                    className="additional-info flex flex-wrap gap-4 text-white"
                  >
                    <span className="flex items-center gap-2">
                      <FaClock /> {formatRuntime(trendingMovieData?.runtime)}
                    </span>
                    <span>Release: {trendingMovie?.release_date}</span>
                    <span>
                      Rating: {trendingMovie?.vote_average.toFixed(1)}
                    </span>
                    <span>
                      Language: {trendingMovie?.original_language.toUpperCase()}
                    </span>
                  </motion.div>

                  <motion.div
                    variants={genresParent}
                    key={trendingMovieData?.id}
                    initial="hidden"
                    animate="visible"
                    className="genres flex gap-2 mt-2"
                  >
                    {trendingMovieData?.genres?.map((g) => (
                      <motion.span
                        variants={genresChildren}
                        key={g.id}
                        className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm"
                      >
                        {g.name}
                      </motion.span>
                    ))}
                  </motion.div>

                  <motion.div
                    className="watch-now-btn perspective-midrange"
                    variants={movieDetsChildren}
                  >
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
                      onClick={() => navigate(`/movie/${trendingMovie?.id}`)}
                    >
                      <motion.span
                        whileHover={{ y: -2 }}
                        className="flex gap-2 items-center"
                      >
                        <IoIosPlayCircle /> Watch Now
                      </motion.span>
                    </motion.button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <div className="wrapper p-8 flex flex-col relative z-10 mt-5 gap-10">
          <div className="trending-section flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, ease: "easeInOut" }}
              className="section-header"
            >
              <span className="text-2xl font-bold text-white">
                Trending Movies Today
              </span>
            </motion.div>
            <motion.div
              variants={containerVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
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
                className="trending-movie-swiper"
              >
                {trendingLoading
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <SwiperSlide key={index}>
                        <CardSkeleton />
                      </SwiperSlide>
                    ))
                  : trendingMovies.map((movie, index) => (
                      <SwiperSlide key={movie?.id}>
                        <motion.div
                          variants={cardVariant}
                          className="trending-movie-card group cursor-pointer flex rounded-md gap-5 relative w-full overflow-hidden"
                          onClick={() => navigate(`/movie/${movie?.id}`)}
                        >
                          <div className="movie-poster w-full">
                            <img
                              src={
                                movie?.poster_path
                                  ? `https://image.tmdb.org/t/p/w500${movie?.poster_path}`
                                  : fallBackImg
                              }
                              loading="lazy"
                              alt={movie?.name}
                              className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-all duration-300"
                            />
                            <div className="img-overlay rounded-lg bg-linear-to-t from-black/85 to-transparent opacity-0 absolute inset-0 w-full transition-opacity duration-300 group-hover:opacity-100">
                              {" "}
                              <div className="movie-label absolute bottom-0 justify-center w-full items-center">
                                <div className="movie-title text-xl font-bold text-center">
                                  {movie?.original_title}
                                </div>
                                <div className="flex justify-between p-4 text-md font-light">
                                  <span className="capitalize">
                                    {movie?.media_type || "Movie"}
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
                          <div className="movie-text-content pb-4 absolute bottom-0 text-center w-full bg-linear-to-t from-black/99 via-black to-purple-600/5">
                            <div className="movie-name text-md max-md:font-bold md:text-2xl md:font-semibold">
                              {movie?.name}
                            </div>
                            <div className="movie-character max-md:text-sm">
                              {movie?.character}
                            </div>
                          </div>
                        </motion.div>
                      </SwiperSlide>
                    ))}
              </Swiper>
            </motion.div>
          </div>

          <div className="popular-section flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, ease: "easeInOut" }}
              className="section-header"
            >
              <span className="text-2xl font-bold text-white">
                Popular Movies
              </span>
            </motion.div>
            <motion.div
              variants={containerVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
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
                className="popular-movie-swiper"
              >
                {popularLoading
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <SwiperSlide key={index}>
                        <CardSkeleton />
                      </SwiperSlide>
                    ))
                  : popularMovies.map((popularMovie, index) => (
                      <SwiperSlide key={popularMovie?.id}>
                        <motion.div
                          variants={cardVariant}
                          className="popular-movie-card group cursor-pointer flex rounded-md gap-5 relative w-full overflow-hidden"
                          onClick={() => navigate(`/movie/${popularMovie?.id}`)}
                        >
                          <div className="movie-poster w-full">
                            <img
                              src={
                                popularMovie?.poster_path
                                  ? `https://image.tmdb.org/t/p/w500${popularMovie?.poster_path}`
                                  : fallBackImg
                              }
                              loading="lazy"
                              alt={popularMovie?.name}
                              className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-all duration-300"
                            />
                            <div className="img-overlay rounded-lg bg-linear-to-t from-black/85 to-transparent opacity-0 absolute inset-0 w-full transition-opacity duration-300 group-hover:opacity-100">
                              {" "}
                              <div className="movie-label absolute bottom-0 justify-center w-full items-center">
                                <div className="movie-title text-xl font-bold text-center">
                                  {popularMovie?.original_title}
                                </div>
                                <div className="flex justify-between p-4 text-md font-light">
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
                          <div className="movie-text-content pb-4 absolute bottom-0 text-center w-full bg-linear-to-t from-black/99 via-black to-purple-600/5">
                            <div className="movie-name text-md max-md:font-bold md:text-2xl md:font-semibold">
                              {popularMovie?.name}
                            </div>
                            <div className="movie-character max-md:text-sm">
                              {popularMovie?.character}
                            </div>
                          </div>
                        </motion.div>
                      </SwiperSlide>
                    ))}
              </Swiper>
            </motion.div>
          </div>

          <div className="top-rated-section flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, ease: "easeInOut" }}
              className="section-header"
            >
              <span className="text-2xl font-bold text-white">
                Top Rated Movies
              </span>
            </motion.div>
            <motion.div
              variants={containerVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <Swiper
                grabCursor={true}
                freeMode={true}
                breakpoints={{
                  320: { slidesPerView: 1, spaceBetween: 12 },
                  640: { slidesPerView: 1.2, spaceBetween: 12 },
                  768: { slidesPerView: 3, spaceBetween: 12 },
                  1024: { slidesPerView: 4, spaceBetween: 20 },
                  1350: { slidesPerView: 5, spaceBetween: 22 },
                  1500: { slidesPerView: 5.5, spaceBetween: 20 },
                }}
                modules={[Navigation]}
                navigation={true}
                centeredSlides={false}
                className="popular-movie-swiper"
              >
                {topLoading
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <SwiperSlide key={index}>
                        <CardSkeleton />
                      </SwiperSlide>
                    ))
                  : topMovies.map((movie, index) => (
                      <SwiperSlide key={movie?.id}>
                        <motion.div
                          variants={cardVariant}
                          className="top-rated-movie-card group cursor-pointer flex rounded-md gap-5 relative w-full overflow-hidden"
                          onClick={() => navigate(`/movie/${movie?.id}`)}
                        >
                          <div className="movie-poster w-full">
                            <img
                              src={
                                movie.poster_path
                                  ? `https://image.tmdb.org/t/p/w500${movie?.poster_path}`
                                  : fallBackImg
                              }
                              loading="lazy"
                              alt={movie?.name}
                              className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-all duration-300"
                            />
                            <div className="img-overlay rounded-lg bg-linear-to-t from-black/85 to-transparent opacity-0 absolute inset-0 w-full transition-opacity duration-300 group-hover:opacity-100">
                              {" "}
                              <div className="movie-label absolute bottom-0 justify-center w-full items-center">
                                <div className="movie-title text-xl font-bold text-center">
                                  {movie?.original_title}
                                </div>
                                <div className="flex justify-between p-4 text-md font-light">
                                  <span className="capitalize">
                                    {movie?.media_type || "Movie"}
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
                          <div className="movie-text-content pb-4 absolute bottom-0 text-center w-full bg-linear-to-t from-black/99 via-black to-purple-600/5">
                            <div className="movie-name text-md max-md:font-bold md:text-2xl md:font-semibold">
                              {movie?.name}
                            </div>
                            <div className="movie-character max-md:text-sm">
                              {movie?.character}
                            </div>
                          </div>
                        </motion.div>
                      </SwiperSlide>
                    ))}
              </Swiper>
            </motion.div>
          </div>

          <div className="genres-section flex flex-col gap-10">
            {sections.map((section) => (
              <section
                key={section?.id}
                className={`${section.name.toLowerCase()}-section flex flex-col gap-6`}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.75, ease: "easeInOut" }}
                  className="genre-header"
                >
                  <span className="text-2xl font-bold text-white">
                    {section?.name}
                  </span>
                </motion.div>
                <motion.div
                  variants={containerVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                >
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
                    className="movie-swiper"
                  >
                    {genresLoading
                      ? Array.from({ length: 6 }).map((_, index) => (
                          <SwiperSlide key={index}>
                            <CardSkeleton />
                          </SwiperSlide>
                        ))
                      : section.movies.map((movie) => (
                          <SwiperSlide key={movie?.id}>
                            <motion.div
                              variants={cardVariant}
                              className="movie-card group cursor-pointer flex rounded-md gap-5 relative w-full overflow-hidden"
                              onClick={() => navigate(`/movie/${movie?.id}`)}
                            >
                              <div className="movie-poster w-full">
                                <img
                                  src={
                                    movie?.poster_path
                                      ? `https://image.tmdb.org/t/p/w500${movie?.poster_path}`
                                      : fallBackImg
                                  }
                                  loading="lazy"
                                  alt={movie?.name}
                                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-all duration-300"
                                />
                                <div className="img-overlay rounded-lg bg-linear-to-t from-black/85 to-transparent opacity-0 absolute inset-0 w-full transition-opacity duration-300 group-hover:opacity-100">
                                  {" "}
                                  <div className="movie-label absolute bottom-0 justify-center w-full items-center">
                                    <div className="movie-title text-xl font-bold text-center">
                                      {movie?.original_title}
                                    </div>
                                    <div className="flex justify-between p-4 text-md font-light">
                                      <span className="capitalize">
                                        {movie?.media_type || "Movie"}
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
                              <div className="movie-text-content pb-4 absolute bottom-0 text-center w-full bg-linear-to-t from-black/99 via-black to-purple-600/5">
                                <div className="movie-name text-md max-md:font-bold md:text-2xl md:font-semibold">
                                  {movie?.name}
                                </div>
                                <div className="movie-character max-md:text-sm">
                                  {movie?.character}
                                </div>
                              </div>
                            </motion.div>
                          </SwiperSlide>
                        ))}
                  </Swiper>
                </motion.div>
                {/* 
              {section.movies.map((movie) => (
               
              ))} */}
              </section>
            ))}
          </div>
        </div>
      </main>
    </motion.div>
  );
}

export default Home;
