import { faBars, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import navBarStyles from "./Navbar.module.css";
import TextInput from "../Fields/TextInput";
import { extractRepositoryDetailsFromUrl } from "@/utils/general/url";
import ReactModal from "react-modal";
import AddRepository from "@/pages/Home/components/Repositories/AddRepository";
import { RepositoryInfo } from "@/types/repository";
import { fetchRepositoryDetails } from "@/features/repositories/services/repositories";

interface NavBarLink {
  name: string;
  link: string;
}

const Navbar: React.FC = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [repoUrl, setRepoUrl] = useState<string>("");
  const [urlIsValid, setUrlIsValid] = useState<boolean>(false);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

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

  /**
   * Toggles the navigation menu's expanded state.
   */
  function toggleExpanded() {
    setExpanded(!expanded);
  }

  /**
   * Handles changes to the repository URL input, validating the URL and opening a modal if the repository exists.
   *
   * @param value - The new repository URL entered by the user.
   */
  async function handleUrlChange(value: string) {
    const extractedInfo = extractRepositoryDetailsFromUrl(value);
    setUrlIsValid(!!extractedInfo);
    setRepoUrl(value);
    if (extractedInfo) {
      const retrievedDetails: RepositoryInfo = await fetchRepositoryDetails({
        owner: extractedInfo.organization,
        repository: extractedInfo.repository,
      });
      if (retrievedDetails === null) {
        setUrlIsValid(false);
        return;
      }
      setModalIsOpen(true);
    }
  }

  return (
    <header className={`${navBarStyles.navbar} sticky top-0 z-10 lg:pr-1 lg:pl-1`}>
      <ReactModal
        isOpen={modalIsOpen}
        className="modal-content !w-2/3"
        overlayClassName="modal-overlay"
      >
        <AddRepository closeModal={() => setModalIsOpen(false)} initialUrl={repoUrl} />
      </ReactModal>
      <div className="flex items-center justify-between flex-1 h-[50px] text-[var(--navbar-font)] ml-4">
        <a href="/home">RepoStats</a>
      </div>

      <TextInput
        value={repoUrl}
        onChange={handleUrlChange}
        icon={<FontAwesomeIcon icon={faSearch} />}
        placeholder="Repository URL ..."
        className={`w-auto sm:w-[300px] max-w-[300px] ${
          urlIsValid || repoUrl === "" ? "" : "!border-red-600"
        }`}
        containerClassName="mr-2 !h-9 !w-auto sm:w-[300px] max-w-[300px] !border-red-600"
      />
      <button className="block pointer-cursor lg:hidden mr-4" onClick={toggleExpanded}>
        <FontAwesomeIcon icon={faBars} className="hover:cursor-pointer text-[var(--navbar-font)]" />
      </button>

      <div
        className={`w-full lg:flex lg:items-center lg:w-auto lg:mr-4 ${expanded ? "" : "hidden"}`}
        id="menu"
      >
        <nav>
          <ul
            className={`flex flex-col text-base items-center lg:flex-row -mx-1 bg-[var(--navbar-background)] text-[var(--navbar-font)]`}
          >
            {links.map((link) => {
              return (
                <Link
                  key={link.name}
                  to={link.link}
                  onClick={toggleExpanded}
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
