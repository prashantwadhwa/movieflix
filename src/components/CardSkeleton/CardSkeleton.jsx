import React from "react";
import "./CardSkeleton.scss";

const CardSkeleton = () => {
  return (
    <div className="movie-card skeleton flex rounded-md relative w-full overflow-hidden">
      <div className="w-full h-[420px] rounded-lg skeleton-box" />
    </div>
  );
};

export default CardSkeleton;
