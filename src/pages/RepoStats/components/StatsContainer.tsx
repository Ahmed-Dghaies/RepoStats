import { useParams } from "react-router-dom";
import RepositoryDetails from "./RepositoryDetails";
import RepositoryGraphs from "./RepositoryGraphs";
import useValidateRepository from "@/hooks/useValidateRepository";
import RepositoryContributors from "./RepositoryContributors";
import RepositorySourceTree from "./RepositorySourceTree";

const StatsContainer = () => {
  const { owner, name } = useParams();
  useValidateRepository({ owner, name });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-3">
        <div className="flex flex-col gap-6 sm:gap-3 sm:flex-row w-full lg:w-2/3 xl:w-2/4">
          <RepositoryDetails owner={owner} name={name} />
          <RepositoryContributors owner={owner} name={name} />
        </div>
        <div className="w-full lg:w-1/3 xl:w-2/4">
          <RepositorySourceTree owner={owner} name={name} />
        </div>
      </div>

      <RepositoryGraphs owner={owner} name={name} />
    </div>
  );
};

export default StatsContainer;
