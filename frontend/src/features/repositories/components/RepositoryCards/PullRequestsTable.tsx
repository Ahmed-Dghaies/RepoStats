import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PullRequestsDetails } from "@/features/repositories/hooks/useRepositoryPullRequests";
import { PullRequest } from "@/types/repository";
import LoadingOverlay from "@achmadk/react-loading-overlay";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PullRequestTableProps {
  pullRequestsDetails: PullRequestsDetails;
  className?: string;
  title: string;
  description?: string;
  isLoading: boolean;
}

const PullRequestsTable = ({
  pullRequestsDetails,
  className,
  title,
  description,
  isLoading,
}: PullRequestTableProps) => {
  return (
    <Card className={`${className} gap-3`}>
      <CardHeader
        color="transparent"
        className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
      >
        <div className="w-max rounded-lg bg-gray-900 p-5 text-white">
          <FontAwesomeIcon icon={faLayerGroup} className="h-6 w-6" />
        </div>
        <div>
          <div className="font-semibold text-xl">{title}</div>
          <div className="max-w-sm font-normal">{description ?? ""}</div>
        </div>
      </CardHeader>
      <CardContent className="p-2 px-3 pb-0 flex flex-col flex-grow gap-2 h-[360px]">
        <LoadingOverlay
          active={isLoading}
          spinner
          text="Loading repository source tree..."
          className="h-full w-full overflow-x-hidden pr-1"
        >
          <div className="w-full flex gap-3 mb-2">
            <div>Average time to merge:</div>
            <div>{displayTime(pullRequestsDetails.averageTimeToMergeHours)}</div>
          </div>
          <div className="flex-grow overflow-auto pr-1">
            {pullRequestsDetails.mergedPullRequests.map((pullRequest: PullRequest) => (
              <PullRequestsTableSkeleton pullRequest={pullRequest} key={pullRequest.number} />
            ))}
          </div>
        </LoadingOverlay>
      </CardContent>
    </Card>
  );
};

interface PullRequestSkeletonProps {
  pullRequest: PullRequest;
}

const PullRequestsTableSkeleton = ({ pullRequest }: PullRequestSkeletonProps) => {
  return (
    <div className="space-y-2 border-t border-gray-200 py-2">
      <div>
        <a
          href={pullRequest.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium hover:underline"
        >
          {pullRequest.title}
        </a>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={pullRequest.mergedAt ? "secondary" : "default"}>{pullRequest.state}</Badge>
        <span className="text-sm text-muted-foreground">
          #{pullRequest.number} by {pullRequest.author}
        </span>
      </div>
      <div className="text-sm text-muted-foreground">
        {new Date(pullRequest.createdAt).toLocaleDateString()} - Time to merge:{" "}
        {displayTime(pullRequest.durationInHours)}
      </div>
    </div>
  );
};

const displayTime = (time: number) => {
  const totalHours = Math.floor(time);
  const minutes = Math.round((time - totalHours) * 60);

  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}min`;
  } else {
    return `${minutes}min`;
  }
};

export default PullRequestsTable;
