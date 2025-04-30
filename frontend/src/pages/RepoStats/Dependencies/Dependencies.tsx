import { RepositoryInfo } from "@/types/repository";
import Dependency from "./Dependency";
import { useFetchDependencies } from "./useFetchDependencies";
import { LoadingOverlay } from "@achmadk/react-loading-overlay";

const Dependencies = ({ repositoryDetails }: { repositoryDetails: RepositoryInfo }) => {
  const { dependenciesList, loading } = useFetchDependencies(repositoryDetails);

  return (
    <div className="flex flex-col gap-2 pl-4 pr-2 overflow-hidden justify-center flex-grow items-center">
      <LoadingOverlay
        active={loading}
        spinner
        text="Loading your content..."
        className="h-full overflow-auto flex flex-col gap-3 w-full md:w-2/3 mb-3 overflow-x-hidden pr-1"
      >
        {dependenciesList.map((dependency) => (
          <Dependency packageInfo={dependency} key={dependency.name} />
        ))}
      </LoadingOverlay>
    </div>
  );
};

export default Dependencies;
