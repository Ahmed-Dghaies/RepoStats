import { RepositoryInfo } from "@/types/repository";
import RepositoryGeneralInfo from "./RepositoryGeneralInfo";
import RepositoryContributors from "./RepositoryContributors";
import RepositorySourceTree from "./RepositorySourceTree";
import RepositoryGraphs from "./RepositoryGraphs";
import { useParams } from "react-router-dom";

const RepositoryDetails = ({ repositoryDetails }: { repositoryDetails: RepositoryInfo }) => {
  const { owner, repository } = useParams();

  return (
    owner &&
    repository && (
      <div className="flex flex-col gap-3 flex-grow-1 pl-4 pr-3 overflow-auto mr-1">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-3">
          <div className="flex flex-col gap-6 sm:gap-3 sm:flex-row w-full lg:w-2/3 xl:w-2/4">
            <RepositoryGeneralInfo details={repositoryDetails} />
            <RepositoryContributors owner={owner} repository={repository} />
          </div>
          <div className="w-full lg:w-1/3 xl:w-2/4">
            <RepositorySourceTree owner={owner} repository={repository} />
          </div>
        </div>

        <RepositoryGraphs owner={owner} repository={repository} />
      </div>
    )
  );
};

export default RepositoryDetails;
