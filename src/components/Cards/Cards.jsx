import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Cards.scss";
import starIcon from "../../assets/star.svg";
import spinner from "../../assets/spinner.svg";
import prevIcon from "../../assets/prev-icon.svg";
import nextIcon from "../../assets/next-icon.svg";
import fallBackImg from "../../assets/fallback.jpeg";

function Cards({ movies: searchResults, noResults, isSearching }) {
  const [moviesData, setMoviesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageCount, setPageCount] = useState(1);
  const [totalPagesCount, setTotalPagesCount] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [showPagination, setShowPagination] = useState(true);

  const displayedMovies = searchResults?.length ? searchResults : moviesData;

  const navigate = useNavigate();

  const getMoviesData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        "https://api.themoviedb.org/3/movie/popular",
        {
          params: {
            api_key: import.meta.env.VITE_MOVIE_API,
            page: pageCount,
          },
        },
      );

      setMoviesData(res.data.results);
      setTotalPagesCount(res.data.total_pages);
      setIsLoading(false);
    } catch (error) {
      console.error("Some Error Occurred", error);
      toast("Some Error Occurred");
      setIsLoading(false);
    }
  };

  const handleImageLoaded = () => {
    setImagesLoaded((prev) => prev + 1);
  };

  useEffect(() => {
    if (!isSearching) {
      setShowPagination(true);
      setImagesLoaded(0);
      getMoviesData();
    } else {
      setShowPagination(false);
      setImagesLoaded(0);
      setIsLoading(false);
    }
  }, [pageCount, isSearching]);

  return (
    <>
      {isLoading && (
        <div className="loading flex justify-center mt-16 show">
          <img src={spinner} alt="" width={50} height={50} />
        </div>
      )}

      {!isLoading && noResults && (
        <div className="no-results text-center mt-20 text-gray-500 text-lg">
          No results found 😔
        </div>
      )}

      {!isLoading && !noResults && (
        <div className="flex flex-col gap-10">
          <div className="cards mt-16">
            {displayedMovies.map((movie) => (
              <div
                className={`movie-card rounded-xl border-0 cursor-pointer ${
                  imagesLoaded === displayedMovies.length ? "fade-in" : ""
                }`}
                key={movie?.id}
                onClick={() => navigate(`/movie/${movie?.id}`)}
              >
                <div className="movie-img rounded-xl hover:scale-105 transition-all duration-300">
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500/${movie?.poster_path}`
                        : fallBackImg
                    }
                    alt={movie?.title}
                    className="rounded-xl w-full object-cover"
                    onLoad={handleImageLoaded}
                  />
                </div>

                <div className="movie-details flex justify-between gap-2 mt-4">
                  <div className="movie-title font-semibold">
                    {movie?.title}
                  </div>
                </div>

                <div className="movie-rating mt-4 flex gap-2 items-center">
                  <img src={starIcon} alt="star-icon" />
                  <div className="rating font-semibold">
                    {movie?.vote_average
                      ? movie?.vote_average.toFixed(1)
                      : "N/A"}
                  </div>
                  <span>•</span>
                  <div className="movie-lang capitalize text-gray-400">
                    {movie?.original_language}
                  </div>
                  <span>•</span>
                  <div className="movie-date text-gray-400">
                    {movie?.release_date?.split("-")[0]}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showPagination && (
            <div className="pagination-footer flex mx-auto justify-between gap-10 items-center">
              <div
                className={`prev-btn cursor-pointer ${pageCount === 1 ? "first-page" : ""}`}
                onClick={() => pageCount > 1 && setPageCount(pageCount - 1)}
              >
                <img src={prevIcon} alt="prev-icon" />
              </div>

              <div className="current">
                {pageCount} .... {totalPagesCount}
              </div>

              <div
                className={`next-btn cursor-pointer ${
                  pageCount === totalPagesCount ? "last-page" : ""
                }`}
                onClick={() =>
                  pageCount < totalPagesCount && setPageCount(pageCount + 1)
                }
              >
                <img src={nextIcon} alt="next-icon" />
              </div>
            </div>
          )}
        </div>
      )}

      <ToastContainer />
    </>
  );
}

export default Cards;
