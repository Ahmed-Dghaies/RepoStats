import { Repository } from "@/types/repository";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faChartSimple, faTrash } from "@fortawesome/free-solid-svg-icons";
import { refreshRepositories } from "@/features/repositories/reducers/repositoriesReducer";
import { useAppDispatch } from "@/hooks";
import { confirmAlert } from "react-confirm-alert";

const RepoActions = ({ row }: { row: Repository }) => {
  const dispatch = useAppDispatch();
  function deleteRepository() {
    const list = JSON.parse(localStorage.getItem("repositories") ?? "[]");
    const index = list.findIndex((repo: Repository) => repo.url === row.url);
    list.splice(index, 1);
    localStorage.setItem("repositories", JSON.stringify(list));
    dispatch(refreshRepositories());
  }

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
