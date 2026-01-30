import React, { useState } from "react";
import searchIcon from "../../assets/search.svg";
import "./SearchBar.scss";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

function SearchBar({ setMovies, setIsSearching, setNoResults }) {
  const [searchQuery, setSearchQuery] = useState("");

  const searchMovies = async () => {
    if (!searchQuery.trim()) {
      toast("Search query is empty");
      setIsSearching(false);
      setNoResults(false);
      setMovies([]);
      return;
    }

    setIsSearching(true);

    try {
      if (searchQuery != "") {
        const searchRes = await axios.get(
          `https://api.themoviedb.org/3/search/multi?`,
          {
            params: {
              api_key: import.meta.env.VITE_MOVIE_API,
              query: searchQuery,
            },
          },
        );
        const personRes = await axios.get(
          "https://api.themoviedb.org/3/search/person",
          {
            params: {
              api_key: import.meta.env.VITE_MOVIE_API,
              query: searchQuery,
            },
          },
        );

        // get movies from first matching person
        const personId = personRes.data.results[0]?.id;
        let castMovies = [];

        if (personId) {
          const creditsRes = await axios.get(
            `https://api.themoviedb.org/3/person/${personId}/movie_credits`,
            {
              params: {
                api_key: import.meta.env.VITE_MOVIE_API,
              },
            },
          );

          castMovies = creditsRes.data.cast;
        }
        const combined = [...searchRes.data.results, ...castMovies];
        setMovies(combined);

        if (combined.length === 0) {
          setNoResults(true);
        } else {
          setNoResults(false);
        }
      }
    } catch (error) {
      setNoResults(false);
      console.error("Some Error Occured in searching Movies", error);
    }
    setIsSearching(false);
  };

  const handleKeyDown = (e) => {
    e.key === "Enter" && searchMovies();
  };

  return (
    <div className="search-bar mt-10 w-full mx-auto">
      <div className="flex items-center relative">
        <img
          src={searchIcon}
          alt=""
          className="absolute top-1/2 left-4 w-5 transform -translate-y-1/2"
        />
        <input
          type="text"
          placeholder="Search through 300+ movies online"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input relative border-2 border-purple-600 rounded-xl w-full p-3 pl-12 focus-visible:outline-0 focus-visible:shadow-lg focus-visible:shadow-purple-500/50 ease-in-out duration-200 transition-all"
          onKeyDown={handleKeyDown}
        />
      </div>
      <ToastContainer />
    </div>
  );
}

export default SearchBar;
