import { NewRepositoryDetails } from "./types";
import { Typography } from "@material-tailwind/react";

interface RepositoryDetailsProps {
  repositoryDetails: NewRepositoryDetails;
  loading: boolean;
}

const RepositoryDetails = ({ repositoryDetails, loading }: RepositoryDetailsProps) => {
  const couldNotBeFound = "Information could not be retrieved";
  return (
    repositoryDetails.isValid &&
    !loading && (
      <div className="flex flex-col gap-2 mx-1 mt-1 bg-gray-200 rounded-md p-2">
        <Typography>Platform: {repositoryDetails.platform}</Typography>
        <Typography>Organization: {repositoryDetails.organization}</Typography>
        <Typography>Repository: {repositoryDetails.repository}</Typography>
        <Typography>
          Default branch: {repositoryDetails.defaultBranch ?? couldNotBeFound}
        </Typography>
        <Typography>Project type: {repositoryDetails.projectType ?? couldNotBeFound}</Typography>
        <Typography>Readme: {repositoryDetails.readme ?? couldNotBeFound}</Typography>
        <Typography>
          Dependencies file: {repositoryDetails.dependencyFile ?? couldNotBeFound}
        </Typography>
      </div>
    )
  );
};

export default RepositoryDetails;
