import React, { useState } from "react";
import heroBg from "../../assets/hero-bg.png";
import Header from "../../components/Header/Header";
import SearchBar from "../../components/SearchBar/SearchBar";
import Cards from "../../components/Cards/Cards";
import ScrollTop from "../../components/ScrollTop/ScrollTop";
import { motion } from "framer-motion";
import "../../App.scss";

function Search() {
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <main className="min-h-screen relative bg-white">
        <ScrollTop />
        <div className="pattern">
          <img src={heroBg} alt="heroBg" className="absolute z-0" />
          <div className="wrapper p-8 flex flex-col relative z-10">
            <Header />
            <SearchBar
              setMovies={setSearchResults}
              setNoResults={setNoResults}
              setIsSearching={setIsSearching}
            />
            <Cards
              movies={searchResults}
              noResults={noResults}
              isSearching={isSearching}
            />
          </div>
        </div>
      </main>
    </motion.div>
  );
}

export default Search;
