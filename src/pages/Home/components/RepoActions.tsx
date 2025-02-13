import { Repository } from "../../../types/repository";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faCog, faTrash } from "@fortawesome/free-solid-svg-icons";

const RepoActions = ({ row }: { row: Repository }) => {
  return (
    <>
      <Link to={`https://github.com/${row.owner}/${row.name}`}>
        <FontAwesomeIcon icon={faGithub} className="outline-none" />
      </Link>
      <FontAwesomeIcon
        icon={faTrash}
        className="outline-none ml-1 cursor-pointer"
      />
      <FontAwesomeIcon
        icon={faCog}
        className="outline-none ml-1 cursor-pointer"
      />
    </>
  );
};

export default RepoActions;
