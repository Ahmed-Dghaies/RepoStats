import { fetchFileContent } from "@/features/repositories/services/repositories";
import { RepositoryInfo } from "@/types/repository";
import { useEffect, useState, useRef } from "react";
import { fetchPackagesSummary } from "./service";
import { PackageDetails } from "./types";

export const useFetchDependencies = (repositoryDetails: RepositoryInfo | null) => {
  const [dependenciesList, setDependenciesList] = useState<PackageDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchedRepoRef = useRef<RepositoryInfo | null>(null);

  useEffect(() => {
    const fetchFile = async () => {
      if (!repositoryDetails) return;
      if (fetchedRepoRef.current === repositoryDetails) return;
      setLoading(true);
      try {
        const packageFile = await fetchFileContent({ repositoryDetails, path: "package.json" });
        const packageLockFile = await fetchFileContent({
          repositoryDetails,
          path: "package-lock.json",
        });

        if (packageFile) {
          let dependencies = {};
          try {
            dependencies = JSON.parse(packageFile).dependencies;
          } catch (error) {
            console.error("Error parsing package.json:", error);
          }
          const lockFileContent = packageLockFile || "{}";
          const scoredDependencies = await fetchPackagesSummary({
            dependencies,
            lockFileContent,
          });

          setDependenciesList(scoredDependencies);
          fetchedRepoRef.current = repositoryDetails;
          setLoading(false);
          return;
        }

        setDependenciesList([]);
        fetchedRepoRef.current = repositoryDetails;
      } catch (error) {
        setLoading(false);
        fetchedRepoRef.current = null;
        console.error("Error fetching file:", error);
      }
    };

    fetchFile();
  }, [repositoryDetails]);

  return { dependenciesList, loading };
};
