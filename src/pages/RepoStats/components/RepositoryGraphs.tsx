import LineGraph from "@/components/graphs/LineChart/LineGraph";
import useRepositoryStats from "../hooks/useRepositoryStats";
import { Repository } from "@/types/repository";

const RepositoryGraphs = ({ owner, name }: Partial<Repository>) => {
  const { clones, repositoryViews, punchCard } = useRepositoryStats(
    owner,
    name
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
          yAxis={{
            maximumValue: clones.maximumValue,
            minimumValue: 0,
          }}
        />
        <LineGraph
          title="Views"
          data={repositoryViews.data}
          keys={repositoryViews.keys}
          className="w-full md:w-1/2"
          description="Repository views for the last 14 days"
          yAxis={{
            maximumValue: repositoryViews.maximumValue,
            minimumValue: 0,
          }}
        />
      </div>
      <LineGraph
        title="Commits"
        data={punchCard.data}
        keys={punchCard.keys}
        className="w-full xl:w-1/3"
        description="Commits count per hour"
        yAxis={{
          maximumValue: punchCard.maximumValue,
          minimumValue: 0,
        }}
      />
    </div>
  );
};

export default RepositoryGraphs;
