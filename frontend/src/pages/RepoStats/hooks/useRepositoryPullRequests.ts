import { fetchMergedPullRequestsDetails } from "@/features/repositories/services/repositories";
import { PullRequest } from "@/types/repository";
import { useEffect, useState } from "react";

interface useRepositoryPullRequestsProps {
  owner: string | undefined;
  repository: string | undefined;
}

export interface pullRequestsDetails {
  mergedPullRequests: PullRequest[];
  averageTimeToMergeHours: number;
}

const useRepositoryPullRequests = ({
  owner,
  repository,
}: useRepositoryPullRequestsProps): pullRequestsDetails => {
  const [pullRequestsDetails, setPullRequestsDetails] = useState<pullRequestsDetails>({
    mergedPullRequests: [],
    averageTimeToMergeHours: 0,
  });

  useEffect(() => {
    if (!owner || !repository) return;

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
    };

    fetchStats();
  }, [owner, repository]);

  return pullRequestsDetails;
};

export default useRepositoryPullRequests;
