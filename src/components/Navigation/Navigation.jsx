import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { MdFavoriteBorder } from "react-icons/md";
import newLogo from "../../assets/brand-logo.png";
import { motion } from "framer-motion";

import "./Navigation.scss";
import { IoHomeOutline } from "react-icons/io5";

function Navigation() {
  const navContainerVariant = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };
  const navItemsVariant = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: "easeInOut" },
    },
  };

  return (
    <nav>
      <div className="nav-bg fixed top-0 left-0 w-full z-30 bg-linear-to-b from-black/80 to-transparent">
        {" "}
        <div className="nav-parent p-[1.5px] rounded-full mx-auto mt-4 md:my-6 w-11/12 md:w-4/5 backdrop-blur-2xl">
          <motion.ul
            variants={navContainerVariant}
            initial="hidden"
            animate="visible"
            className="nav-container flex justify-between items-center px-4 py-2 bg-black/5 rounded-full"
          >
            <motion.li
              className="brand-logo"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <NavLink
                to="/"
                className="flex items-center gap-3"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <img
                  src={newLogo}
                  alt=""
                  className="rounded-full bg-white"
                  width={30}
                  height={30}
                />
                <span className="text-xl text-gradient font-bold">
                  MovieFlix
                </span>
              </NavLink>
            </motion.li>
            <div className="nav-items hidden md:flex gap-5">
              <motion.li
                variants={navItemsVariant}
                initial="hidden"
                animate="visible"
              >
                <NavLink
                  to="/"
                  className="nav-link text-md text-white! transition-colors"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  Home
                </NavLink>
              </motion.li>
              <motion.li
                variants={navItemsVariant}
                initial="hidden"
                animate="visible"
              >
                <NavLink
                  to="/"
                  className="nav-link text-md text-white!  transition-colors"
                >
                  About
                </NavLink>
              </motion.li>
              <motion.li
                variants={navItemsVariant}
                initial="hidden"
                animate="visible"
              >
                <NavLink
                  to="/user-library"
                  className="nav-link text-md text-white!  transition-colors"
                >
                  My Library
                </NavLink>
              </motion.li>
            </div>
            <motion.li
              variants={navItemsVariant}
              initial="hidden"
              animate="visible"
            >
              <NavLink
                to="/search"
                className="nav-link search-container text-md text-white!  flex gap-2 items-center bg-blue-500 hover:bg-white transition-all duration-300 p-3 rounded-full justify-center"
              >
                <FiSearch className="search-icon" />
                {/* Search */}
              </NavLink>
            </motion.li>
          </motion.ul>
        </div>
      </div>
      <div className="mobile-nav md:hidden fixed bottom-0 w-full h-1/12 z-30 bg-black list-none flex gap-4 justify-center items-center p-4">
        <div className="nav-items md:hidden flex gap-6 justify-between w-full">
          <li>
            <NavLink
              to="/"
              className="nav-link text-md text-white! flex flex-col gap-2 items-center"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <IoHomeOutline className="w-7 h-7" />
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/search"
              className="nav-link w-7 h-7 text-md flex flex-col gap-2 items-center p-3 rounded-full justify-center"
            >
              <FiSearch className="w-7 h-7" />
              <span className="text-white">Search</span>
            </NavLink>
          </li>
          {/* <li>
            <NavLink
              to="/"
              className="nav-link text-md text-white! flex flex-col gap-2 items-center"
            >
              About
            </NavLink>
          </li> */}
          <li>
            <NavLink
              to="/user-library"
              className="nav-link text-md text-white! flex flex-col gap-2 items-center"
            >
              <MdFavoriteBorder className="w-7 h-7" />
              Favorites
            </NavLink>
          </li>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
