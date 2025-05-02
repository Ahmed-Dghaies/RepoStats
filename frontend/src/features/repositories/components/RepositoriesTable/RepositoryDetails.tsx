import { NewRepositoryDetails } from "./types";

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
        <div>Platform: {repositoryDetails.platform}</div>
        <div>Organization: {repositoryDetails.organization}</div>
        <div>Repository: {repositoryDetails.repository}</div>
        <div>Default branch: {repositoryDetails.defaultBranch ?? couldNotBeFound}</div>
        <div>Project type: {repositoryDetails.projectType ?? couldNotBeFound}</div>
        <div>Readme: {repositoryDetails.readme ?? couldNotBeFound}</div>
        <div>Dependencies file: {repositoryDetails.dependencyFile ?? couldNotBeFound}</div>
      </div>
    )
  );
};

export default RepositoryDetails;
