import { Repository } from "@/types/repository";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faChartSimple, faTrash } from "@fortawesome/free-solid-svg-icons";

const RepoActions = ({ row }: { row: Repository }) => {
  function deleteRepository() {
    const list = JSON.parse(localStorage.getItem("repositories") ?? "[]");
    const index = list.findIndex((repo: Repository) => repo.url === row.url);
    list.splice(index, 1);
    localStorage.setItem("repositories", JSON.stringify(list));
  }

  return (
    <>
      <Link to={`https://github.com/${row.owner}/${row.repository}`}>
        <FontAwesomeIcon icon={faGithub} className="outline-none" />
      </Link>
      <FontAwesomeIcon
        icon={faTrash}
        className="outline-none ml-1 cursor-pointer"
        onClick={deleteRepository}
      />
      <Link to={`/repository/${row.owner}/${row.repository}`}>
        <FontAwesomeIcon icon={faChartSimple} className="outline-none ml-1 cursor-pointer" />
      </Link>
    </>
  );
};

export default RepoActions;
