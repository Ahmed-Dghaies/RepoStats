import { RepositoryInfo } from "@/types/repository";
import Dependency from "./Dependency";
import { useFetchDependencies } from "./useFetchDependencies";
import { LoadingOverlay } from "@achmadk/react-loading-overlay";
import { useEffect, useState } from "react";
import { repositoryHasDependenciesFile } from "@/features/repositories/services/repositories";
import UnderConstruction from "@/pages/UnderConstruction/UnderConstruction";

const Dependencies = ({ repositoryDetails }: { repositoryDetails: RepositoryInfo }) => {
  const [dependenciesCheckIsAvailable, setDependenciesCheckIsAvailable] = useState<boolean | null>(
    null
  );
  const { dependenciesList, loading } = useFetchDependencies(
    dependenciesCheckIsAvailable ? repositoryDetails : null
  );

  useEffect(() => {
    const checkForDependenciesFile = async () => {
      const hasDependenciesFile = await repositoryHasDependenciesFile(repositoryDetails);

      setDependenciesCheckIsAvailable(hasDependenciesFile);
    };

    checkForDependenciesFile();
  }, [repositoryDetails]);

  return (
    <div className="flex flex-col gap-2 pl-4 pr-2 overflow-hidden justify-center flex-grow items-center">
      <LoadingOverlay
        active={loading}
        spinner
        text="Loading your content..."
        className="h-full overflow-auto flex flex-col gap-3 w-full md:w-2/3 mb-3 overflow-x-hidden pr-1 min-h-96"
      >
        {dependenciesCheckIsAvailable === false ? (
          <UnderConstruction content="For the time being, this feature is only available for node repositories" />
        ) : (
          dependenciesList.map((dependency) => (
            <Dependency packageInfo={dependency} key={dependency.name} />
          ))
        )}
      </LoadingOverlay>
    </div>
  );
};

export default Dependencies;
