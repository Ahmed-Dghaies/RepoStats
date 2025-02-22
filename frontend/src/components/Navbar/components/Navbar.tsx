import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Navbar.module.css";
import globalStyles from "@/assets/styles/globalStyles.module.css";

const Navbar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const links = [
    {
      name: "Home",
      link: "/home",
    },
    {
      name: "Graphs",
      link: "/graphs",
    },
    {
      name: "Contact",
      link: "/contact",
    },
  ];

  function toggleExpanded() {
    setExpanded(!expanded);
  }

  return (
    <header className={`${styles.navbar} sticky top-0 z-10`}>
      <div className="flex items-center justify-between flex-1 h-[50px] text-[var(--navbar-font)]">
        <a href="/home">RepoStats</a>
      </div>

      <button
        className="block pointer-cursor lg:hidden"
        onClick={toggleExpanded}
      >
        <FontAwesomeIcon
          icon={faBars}
          className="hover:cursor-pointer text-[var(--navbar-font)]"
        />
      </button>

      <div
        className={
          "w-full lg:flex lg:items-center lg:w-auto " +
          (expanded ? "" : "hidden")
        }
        id="menu"
      >
        <nav>
          <ul className={styles["links-container"]}>
            {links.map((link) => {
              return (
                <Link
                  key={link.name}
                  to={link.link}
                  className={`px-2 my-2 flex items-center ${globalStyles["custom-underline-hover"]}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
