import { fetchFileContent } from "@/features/repositories/services/repositories";
import { RepositoryInfo } from "@/types/repository";
import { useEffect, useState } from "react";

const Dependencies = ({ repositoryDetails }: { repositoryDetails: RepositoryInfo }) => {
  const [dependenciesList, setDependenciesList] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await fetchFileContent({ repositoryDetails, path: "package.json" });
        if (response) {
          const dependencies = JSON.parse(response).dependencies;
          setDependenciesList(dependencies);
          return;
        }
        setDependenciesList({});
      } catch (error) {
        console.error("Error fetching file:", error);
      }
    };

    fetchFile();
  }, [repositoryDetails]);

  return (
    <div className="flex flex-col gap-1flex-grow-1 pl-4 pr-3 overflow-auto mr-1 justify-center">
      Dependencies{" "}
      {Object.entries(dependenciesList).length > 0 &&
        Object.keys(dependenciesList).map((dependency: string) => (
          <div>{`${dependency}: ${dependenciesList[dependency]}`}</div>
        ))}
    </div>
  );
};

export default Dependencies;
