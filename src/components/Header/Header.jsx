import React from "react";
import imgSrc from "../../assets/hero.png";
import "./Header.scss";

function Header() {
  return (
    <header className="mt-10">
      <div className="web-header flex justify-center items-center flex-col">
        <img src={imgSrc} alt="hero-banner" className="header-img" />
        <h1 className="header-text mt-6">
          Find <span className="text-gradient">Movies </span>You'll Love Without
          the Hassle
        </h1>
      </div>
    </header>
  );
}

export default Header;
