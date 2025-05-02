import { faBars, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import navBarStyles from "./Navbar.module.css";
import { extractRepositoryDetailsFromUrl } from "@/utils/general/url";
import AddRepository from "@/features/repositories/components/RepositoriesTable/AddRepository";
import { debounce } from "lodash";
import { fetchRepositoryDetails } from "@/features/repositories/services/repositories";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";

interface NavBarLink {
  name: string;
  link: string;
}

const Navbar: React.FC = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [repoUrl, setRepoUrl] = useState<string>("");
  const [urlIsValid, setUrlIsValid] = useState<boolean>(false);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  // Create debounced version outside component
  const debouncedFetchDetails = debounce(
    async (extractedInfo: { organization: string; repository: string }) => {
      const retrievedDetails = await fetchRepositoryDetails({
        owner: extractedInfo.organization,
        repository: extractedInfo.repository,
      });
      return retrievedDetails;
    },
    500 // 500ms delay
  );

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
      setIsLoading(true);
      try {
        const retrievedDetails = await debouncedFetchDetails(extractedInfo);

        if (!retrievedDetails) {
          setUrlIsValid(false);
          return;
        }

        setModalIsOpen(true);
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <header className={`${navBarStyles.navbar} sticky top-0 z-10 lg:pr-1 lg:pl-1`}>
      <Dialog open={modalIsOpen} onOpenChange={setModalIsOpen}>
        <AddRepository closeModal={() => setModalIsOpen(false)} initialUrl={repoUrl} />
      </Dialog>
      <div className="flex items-center justify-between flex-1 h-[50px] text-[var(--navbar-font)] ml-4">
        <Link to="/home">RepoStats</Link>
      </div>

      <div className="relative mr-3">
        <Input
          value={repoUrl}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="Repository URL ..."
          className={`pr-10 w-auto sm:w-[300px] max-w-[300px] ${
            urlIsValid || repoUrl === "" ? "" : "!ring-red-600"
          }`}
        />
        <FontAwesomeIcon
          icon={isLoading ? "spinner" : faSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5"
        />
      </div>
      <button className="block pointer-cursor lg:hidden mr-4" onClick={toggleExpanded}>
        <FontAwesomeIcon icon={faBars} className="hover:cursor-pointer text-[var(--navbar-font)]" />
      </button>

      <div
        className={`w-full lg:flex lg:items-center lg:w-auto z-30 lg:mr-4 ${
          expanded ? "" : "hidden"
        }`}
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
