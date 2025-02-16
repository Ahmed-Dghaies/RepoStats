import { useParams } from "react-router-dom";
import RepositoryDetails from "./RepositoryDetails";
import RepositoryGraphs from "./RepositoryGraphs";
import useValidateRepository from "@/hooks/useValidateRepository";
import RepositoryContributors from "./RepositoryContributors";

const StatsContainer = () => {
  const { owner, name } = useParams();
  useValidateRepository({ owner, name });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-3">
        <RepositoryDetails owner={owner} name={name} />
        <RepositoryContributors owner={owner} name={name} />
      </div>

      <RepositoryGraphs owner={owner} name={name} />
    </div>
  );
};

export default StatsContainer;
