import React from "react";
import { useNavigate } from "react-router-dom";
import "../../App.scss";
import { IoIosArrowBack } from "react-icons/io";

function BackButton() {
  const navigate = useNavigate();

  return (
    <div className="home-btn flex items-center gap-5 fixed left-5 top-10 z-40">
      <button
        className="flex items-center"
        onClick={() =>
          window.history.length > 2 ? navigate(-1) : navigate("/")
        }
      >
        <IoIosArrowBack className="block" />
        {/* <span className="block lg:hidden">Go To Home</span> */}
      </button>
    </div>
  );
}

export default BackButton;
