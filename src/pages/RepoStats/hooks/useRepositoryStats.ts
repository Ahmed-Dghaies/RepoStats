import { useEffect, useState } from "react";
import {
  fetchClonesStatistics,
  fetchRepositoryPunchCard,
  fetchRepositoryViews,
  FormattedGraphComparisonData,
} from "@/features/repositories/services/repositories";
import { FormattedGraphData } from "@/types/graphs";

const useRepositoryStats = (
  owner: string | undefined,
  name: string | undefined
) => {
  const [stats, setStats] = useState<{ [key: string]: FormattedGraphData }>({
    clones: { data: [], keys: [], maximumValue: 0 },
    repositoryViews: { data: [], keys: [], maximumValue: 0 },
    punchCard: { data: [], keys: [], maximumValue: 0 },
  });

  useEffect(() => {
    if (!owner || !name) return;

    const fetchStats = async () => {
      const [clonesResult, viewsResult, punchCardResult]: [
        FormattedGraphComparisonData,
        FormattedGraphComparisonData,
        FormattedGraphData
      ] = await Promise.all([
        fetchClonesStatistics({ owner, name }),
        fetchRepositoryViews({ owner, name }),
        fetchRepositoryPunchCard({ owner, name }),
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
  }, [owner, name]);

  return stats;
};

export default useRepositoryStats;
