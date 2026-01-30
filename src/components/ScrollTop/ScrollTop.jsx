import React, { useEffect, useState } from "react";
import scrollIcon from "../../assets/scroll-icon.svg";
import "./ScrollTop.scss";

function ScrollTop() {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div
      className={`scroll-top ${
        isVisible ? "show" : ""
      } bg-purple-600/50 hover:bg-purple-500/50 transition-all duration-300`}
      onClick={scrollToTop}
    >
      <img src={scrollIcon} alt="scroll-icon" width={30} height={30} />
    </div>
  );
}

export default ScrollTop;
