import LineGraph from "@/components/graphs/LineChart/LineGraph";
import useRepositoryStats from "../hooks/useRepositoryStats";
import { Repository } from "@/types/repository";
import DonutChart from "@/components/graphs/DonutChart";
import useRepositoryHeatMap from "../hooks/useRepositoryHeatMap";
import HeatMapChart from "@/components/graphs/HeatMapChart";

const RepositoryGraphs = ({ owner, repository }: Partial<Repository>) => {
  const { clones, repositoryViews, punchCard, languages } = useRepositoryStats(owner, repository);
  const heatMap = useRepositoryHeatMap(owner, repository);

  return (
    <>
      <div className="flex flex-col xl:flex-row gap-3">
        <div className="flex flex-col gap-3 w-full md:flex-row">
          <DonutChart
            title="Languages"
            data={languages.data}
            labels={languages.keys}
            className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4"
            description="Languages used in the repository"
          />
          <HeatMapChart
            title="Activity"
            startDate={heatMap.startDate}
            endDate={heatMap.endDate}
            data={heatMap.data}
            className="w-full lg:w-2/3 2xl:w-2/4 pb-3"
            description="Repository activity during the last 6 months on the main branch"
          />
        </div>
      </div>
      <div className="flex flex-col xl:flex-row gap-3">
        <div className="flex flex-col gap-3 w-full xl:w-2/3 md:flex-row">
          <LineGraph
            title="Clones"
            data={clones.data}
            keys={clones.keys}
            className="w-full md:w-1/2"
            description="Number of clones for the last 14 days"
            yAxis={{
              maximumValue: clones.maximumValue ?? 0,
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
              maximumValue: repositoryViews.maximumValue ?? 0,
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
            maximumValue: punchCard.maximumValue ?? 0,
            minimumValue: 0,
          }}
        />
      </div>
    </>
  );
};

export default RepositoryGraphs;
