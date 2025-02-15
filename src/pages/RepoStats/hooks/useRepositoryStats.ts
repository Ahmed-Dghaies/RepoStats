import { useEffect, useState } from "react";
import {
  fetchClonesStatistics,
  fetchRepositoryPunchCard,
  fetchRepositoryViews,
  formattedGraphComparisonData,
} from "@/features/repositories/services/repositories";
import { formattedGraphData } from "@/types/graphs";

const useRepositoryStats = (
  owner: string | undefined,
  repository: string | undefined
) => {
  const [stats, setStats] = useState<{ [key: string]: formattedGraphData }>({
    clones: { data: [], keys: [], maximumValue: 0 },
    repositoryViews: { data: [], keys: [], maximumValue: 0 },
    punchCard: { data: [], keys: [], maximumValue: 0 },
  });

  useEffect(() => {
    if (!owner || !repository) return;

    const fetchStats = async () => {
      const [clonesResult, viewsResult, punchCardResult]: [
        formattedGraphComparisonData,
        formattedGraphComparisonData,
        formattedGraphData
      ] = await Promise.all([
        fetchClonesStatistics({ owner, name: repository }),
        fetchRepositoryViews({ owner, name: repository }),
        fetchRepositoryPunchCard({ owner, name: repository }),
      ]);

      setStats({
        clones: {
          data: [clonesResult.count, clonesResult.uniquesCount],
          keys: clonesResult.keys,
          maximumValue: clonesResult.maximumValue,
        },
        repositoryViews: {
          data: [viewsResult.count, viewsResult.uniquesCount],
          keys: viewsResult.keys,
          maximumValue: viewsResult.maximumValue,
        },
        punchCard: punchCardResult,
      });
    };

    fetchStats();
  }, [owner, repository]);

  return stats;
};

export default useRepositoryStats;
