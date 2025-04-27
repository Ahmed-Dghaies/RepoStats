import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CardBody } from "@material-tailwind/react";
import { Card, CardHeader, Typography } from "@material-tailwind/react";
import { pullRequestsDetails } from "../hooks/useRepositoryPullRequests";
import { PullRequest } from "@/types/repository";

interface PullRequestTableProps {
  pullRequestsDetails: pullRequestsDetails;
  className?: string;
  title: string;
  description?: string;
}

const PullRequestsTable = ({
  pullRequestsDetails,
  className,
  title,
  description,
}: PullRequestTableProps) => {
  return (
    <Card className={className}>
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
      >
        <div className="w-max rounded-lg bg-gray-900 p-5 text-white">
          <FontAwesomeIcon icon={faLayerGroup} className="h-6 w-6" />
        </div>
        <div>
          <Typography variant="h6" color="blue-gray">
            {title}
          </Typography>
          <Typography variant="small" color="gray" className="max-w-sm font-normal">
            {description ?? ""}
          </Typography>
        </div>
      </CardHeader>
      <CardBody className="p-2 px-3 pb-0 flex flex-col flex-grow gap-2 h-[360px]">
        <div className="w-full flex gap-3">
          <div>Average time to merge:</div>
          <div>{displayTime(pullRequestsDetails.averageTimeToMergeHours)}</div>
        </div>
        <div className="flex-grow overflow-auto pr-1">
          {pullRequestsDetails.mergedPullRequests.map((pullRequest: PullRequest) => (
            <PullRequestsTableSkeleton pullRequest={pullRequest} key={pullRequest.number} />
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

interface PullRequestSkeletonProps {
  pullRequest: PullRequest;
}

const PullRequestsTableSkeleton = ({ pullRequest }: PullRequestSkeletonProps) => {
  return (
    <div className="w-full flex gap-3 border-t border-gray-200 py-2">
      <a
        href={pullRequest.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline text-underline-offset-2"
      >
        #{pullRequest.number}
      </a>
      <div className="flex-1 overflow-hidden line-clamp-2 font-medium">{pullRequest.title}</div>
      <div>{displayTime(pullRequest.durationInHours)}</div>
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
