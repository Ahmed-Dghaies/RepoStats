import { Repository } from "@/types/repository";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faChartSimple, faTrash } from "@fortawesome/free-solid-svg-icons";
import { confirmAlert } from "react-confirm-alert";

const RepoActions = ({ row }: { row: Repository }) => {
  /**
   * Removes the current repository from localStorage.
   *
   * @remark
   * If the repository is not found in localStorage, no changes are made.
   */
  function deleteRepository() {
    const list = JSON.parse(localStorage.getItem("repositories") ?? "[]");
    const index = list.findIndex((repo: Repository) => repo.url === row.url);
    list.splice(index, 1);
    const newRepositories = JSON.stringify(list);
    localStorage.setItem("repositories", newRepositories);
    window.dispatchEvent(new CustomEvent("repositoriesUpdated", { detail: list }));
  }

  /**
   * Displays a confirmation dialog before deleting the selected repository.
   *
   * If the user confirms, deletes the repository and updates the application state.
   */
  function handleDeleteClick() {
    confirmAlert({
      title: "Delete repository",
      message: `Are you sure you want to delete this repository ${row.owner}/${row.repository}?`,
      overlayClassName: "center-btns px-3",
      buttons: [
        {
          label: "Yes",
          onClick: () => deleteRepository(),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  }

  return (
    <>
      <Link to={`https://github.com/${row.owner}/${row.repository}`}>
        <FontAwesomeIcon icon={faGithub} className="outline-none" />
      </Link>
      <FontAwesomeIcon
        icon={faTrash}
        className="outline-none ml-1 cursor-pointer"
        onClick={handleDeleteClick}
      />
      <Link to={`/repository/${row.owner}/${row.repository}`}>
        <FontAwesomeIcon icon={faChartSimple} className="outline-none ml-1 cursor-pointer" />
      </Link>
    </>
  );
};

export default RepoActions;
