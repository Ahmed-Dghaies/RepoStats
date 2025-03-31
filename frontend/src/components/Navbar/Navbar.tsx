import { faBars, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import navBarStyles from "./Navbar.module.css";
import TextInput from "../fields/TextInput";

interface NavBarLink {
  name: string;
  link: string;
}

const Navbar: React.FC = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [repoUrl, setRepoUrl] = useState<string>("");

  const links: NavBarLink[] = [
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
    <header className={`${navBarStyles.navbar} sticky top-0 z-10 lg:pr-1 lg:pl-1`}>
      <div className="flex items-center justify-between flex-1 h-[50px] text-[var(--navbar-font)]">
        <a href="/home">RepoStats</a>
      </div>

      <TextInput
        value={repoUrl}
        onChange={setRepoUrl}
        icon={<FontAwesomeIcon icon={faSearch} />}
        placeholder="Repository URL ..."
        width="w-2/3 sm:w-[300px]"
        containerClassName="mr-2 !h-9"
      />
      <button className="block pointer-cursor lg:hidden" onClick={toggleExpanded}>
        <FontAwesomeIcon icon={faBars} className="hover:cursor-pointer text-[var(--navbar-font)]" />
      </button>

      <div
        className={"w-full lg:flex lg:items-center lg:w-auto " + (expanded ? "" : "hidden")}
        id="menu"
      >
        <nav>
          <ul
            className={`flex flex-col text-base items-center lg:flex-row -mr-1 -ml-1 bg-[var(--navbar-background)] text-[var(--navbar-font)]`}
          >
            {links.map((link) => {
              return (
                <Link
                  key={link.name}
                  to={link.link}
                  className={`px-2 my-2 flex items-center ${navBarStyles["custom-underline-hover"]}`}
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
