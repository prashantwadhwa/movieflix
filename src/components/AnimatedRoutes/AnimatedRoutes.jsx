import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Movie from "../../pages/Movie/Movie";
import Home from "../../components/Home/Home";
import Search from "../../pages/Search/Search";
import MoviePlayer from "../../pages/MoviePlayer/MoviePlayer";
import UserLibrary from "../../pages/UserLibrary/UserLibrary";
import { AnimatePresence } from "framer-motion";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/movie/:id" element={<Movie />} />
        <Route path="/movie/:id/player" element={<MoviePlayer />} />
        <Route path="/user-library" element={<UserLibrary />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
