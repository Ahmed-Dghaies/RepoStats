import LineGraph from "@/components/Graphs/LineChart/LineGraph";
import useRepositoryStats from "../hooks/useRepositoryStats";
import { Repository } from "@/types/repository";
import DonutChart from "@/components/Graphs/DonutChart";
import useRepositoryHeatMap from "../hooks/useRepositoryHeatMap";
import HeatMapChart from "@/components/Graphs/HeatMapChart";
import PullRequestsTable from "./PullRequestsTable";
import useRepositoryPullRequests from "../hooks/useRepositoryPullRequests";

const RepositoryGraphs = ({ owner, repository }: Partial<Repository>) => {
  // TODO: Add a loading state
  const { clones, repositoryViews, punchCard, languages } = useRepositoryStats(owner, repository);
  const { heatMapDetails, isLoading: heatMapIsLoading } = useRepositoryHeatMap({
    owner,
    repository,
  });
  const { pullRequestsDetails, isLoading: prIsLoading } = useRepositoryPullRequests({
    owner,
    repository,
  });

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex flex-col gap-3 w-full md:flex-row lg:w-3/4">
          <DonutChart
            title="Languages"
            data={languages.data}
            labels={languages.keys}
            className="w-full md:w-1/3 lg:w-1/3"
            description="Languages used in the repository"
          />
          <HeatMapChart
            title="Activity"
            startDate={heatMapDetails.startDate}
            endDate={heatMapDetails.endDate}
            data={heatMapDetails.data}
            className="w-full md:w-2/3 lg:w-2/3 pb-3"
            description="Repository activity during the last 6 months on the main branch"
            isLoading={heatMapIsLoading}
          />
        </div>
        <PullRequestsTable
          pullRequestsDetails={pullRequestsDetails}
          isLoading={prIsLoading}
          className="w-full lg:w-1/3 2xl:w-1/4"
          title="Pull Requests"
          description="Recently merged pull requests details"
        />
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
