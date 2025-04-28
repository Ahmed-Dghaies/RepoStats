import { fetchMergedPullRequestsDetails } from "@/features/repositories/services/repositories";
import { PullRequest } from "@/types/repository";
import { useEffect, useState } from "react";

interface UseRepositoryPullRequestsProps {
  owner: string | undefined;
  repository: string | undefined;
}

export interface PullRequestsDetails {
  mergedPullRequests: PullRequest[];
  averageTimeToMergeHours: number;
}

const useRepositoryPullRequests = ({
  owner,
  repository,
}: UseRepositoryPullRequestsProps): {
  pullRequestsDetails: PullRequestsDetails;
  isLoading: boolean;
} => {
  const [pullRequestsDetails, setPullRequestsDetails] = useState<PullRequestsDetails>({
    mergedPullRequests: [],
    averageTimeToMergeHours: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!owner || !repository) return;
    setIsLoading(true);
    const fetchStats = async () => {
      const { averageTimeToMergeHours, mergedPullRequests } = await fetchMergedPullRequestsDetails({
        owner,
        repository,
      });
      setPullRequestsDetails((prev) => ({
        ...prev,
        mergedPullRequests,
        averageTimeToMergeHours,
      }));
      setIsLoading(false);
    };

    fetchStats();
  }, [owner, repository]);

  return { pullRequestsDetails, isLoading };
};

export default useRepositoryPullRequests;
