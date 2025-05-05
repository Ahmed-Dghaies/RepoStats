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
  error: Error | null;
} => {
  const [pullRequestsDetails, setPullRequestsDetails] = useState<PullRequestsDetails>({
    mergedPullRequests: [],
    averageTimeToMergeHours: 0,
  });
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!owner || !repository) return;
    setIsLoading(true);
    setError(null);

    const controller = new AbortController();
    const fetchStats = async () => {
      try {
        const { averageTimeToMergeHours, mergedPullRequests } =
          await fetchMergedPullRequestsDetails({
            owner,
            repository,
            signal: controller.signal,
          });
        setPullRequestsDetails((prev) => ({
          ...prev,
          mergedPullRequests,
          averageTimeToMergeHours,
        }));
      } catch (err: any) {
        // Ignore AbortError which happens on cleanup
        if (err.name !== "AbortError") {
          setError(err instanceof Error ? err : new Error("Failed to fetch pull requests"));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();

    return () => {
      controller.abort();
    };
  }, [owner, repository]);

  return { pullRequestsDetails, isLoading, error };
};

export default useRepositoryPullRequests;
