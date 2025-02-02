import { Repository } from "../../../types/repository";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const RepoActions = ({ row }: { row: Repository }) => {
  return (
    <Link to={`https://github.com/${row.owner}/${row.name}`}>
      <FontAwesomeIcon icon={faGithub} />
    </Link>
  );
};

export default RepoActions;
