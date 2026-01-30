import React from "react";
import { useParams } from "react-router-dom";
import BackButton from "../../components/BackButton/BackButton";

function MoviePlayer() {
  const { id } = useParams();
  return (
    <div className="player fixed inset-0 z-50 bg-black">
      <BackButton />
      <iframe
        src={`https://api.cinezo.net/embed/tmdb-movie-${id}&logo=false`}
        // src={`https://player.autoembed.cc/embed/movie/${id}`}
        allow="autoplay; fullscreen"
        allowFullScreen
        frameBorder="no"
        scrolling="no"
        className="w-full h-full overflow-hidden"
      ></iframe>
    </div>
  );
}

export default MoviePlayer;
