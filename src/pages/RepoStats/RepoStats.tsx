import LineGraph from "@/components/graphs/LineChart/LineGraph";
import useValidateRepository from "@/hooks/useValidateRepository";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fetchClonesStatistics,
  fetchRepositoryPunchCard,
  fetchRepositoryViews,
} from "@/features/repositories/services/repositories";
import { formattedGraphData } from "@/types/graphs";

const RepoStats = () => {
  const { owner, repository } = useParams();
  useValidateRepository({ owner, repository });
  const [punchCard, setPunchCard] = useState<formattedGraphData>({
    data: [],
    keys: [],
    maximumValue: 0,
  });
  const [clones, setClone] = useState<formattedGraphData>({
    data: [],
    keys: [],
    maximumValue: 0,
  });
  const [repositoryViews, setRepositoryViews] = useState<formattedGraphData>({
    data: [],
    keys: [],
    maximumValue: 0,
  });

  useEffect(() => {
    if (!owner || !repository) return;
    fetchClonesStatistics({ owner, name: repository }).then((result) => {
      setClone({
        data: [result.count, result.uniquesCount],
        keys: result.keys,
        maximumValue: result.maximumValue,
      });
    });
  }, [owner, repository]);

  useEffect(() => {
    if (!owner || !repository) return;
    fetchRepositoryViews({ owner, name: repository }).then((result) => {
      setRepositoryViews({
        data: [result.count, result.uniquesCount],
        keys: result.keys,
        maximumValue: result.maximumValue,
      });
    });
  }, [owner, repository]);

  useEffect(() => {
    if (!owner || !repository) return;
    fetchRepositoryPunchCard({ owner, name: repository }).then((result) => {
      setPunchCard(result);
    });
  }, [owner, repository]);

  return (
    <div className="grow overflow-x-hidden overflow-y-auto p-5">
      <div className="flex flex-col md:flex-row gap-3">
        <LineGraph
          title="Clones"
          data={clones.data}
          keys={clones.keys}
          className="w-full md:w-1/3"
          description="Number of clones for the last 14 days"
          maximumValue={clones.maximumValue}
        />
        <LineGraph
          title="Views"
          data={repositoryViews.data}
          keys={repositoryViews.keys}
          className="w-full md:w-1/3"
          description="Repository views for the last 14 days"
          maximumValue={repositoryViews.maximumValue}
        />
        <LineGraph
          title="Commits"
          data={punchCard.data}
          keys={punchCard.keys}
          className="w-full md:w-1/3"
          description="Commits count per week"
          maximumValue={punchCard.maximumValue}
        />
      </div>
    </div>
  );
};

export default RepoStats;
