import LineGraph from "@/components/graphs/LineChart/LineGraph";
import useValidateRepository from "@/hooks/useValidateRepository";
import useRepositoryStats from "../hooks/useRepositoryStats";
import { useParams } from "react-router-dom";

const RepoStats = () => {
  const { owner, repository } = useParams();
  useValidateRepository({ owner, repository });

  const { clones, repositoryViews, punchCard } = useRepositoryStats(
    owner,
    repository
  );

  return (
    <div className="flex flex-col xl:flex-row gap-3">
      <div className="flex flex-col gap-3 w-full xl:w-2/3 md:flex-row">
        <LineGraph
          title="Clones"
          data={clones.data}
          keys={clones.keys}
          className="w-full md:w-1/2"
          description="Number of clones for the last 14 days"
          maximumValue={clones.maximumValue}
        />
        <LineGraph
          title="Views"
          data={repositoryViews.data}
          keys={repositoryViews.keys}
          className="w-full md:w-1/2"
          description="Repository views for the last 14 days"
          maximumValue={repositoryViews.maximumValue}
        />
      </div>
      <LineGraph
        title="Commits"
        data={punchCard.data}
        keys={punchCard.keys}
        className="w-full xl:w-1/3"
        description="Commits count per hour"
        maximumValue={punchCard.maximumValue}
      />
    </div>
  );
};

export default RepoStats;
