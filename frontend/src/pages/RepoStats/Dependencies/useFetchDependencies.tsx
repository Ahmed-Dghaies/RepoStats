import { fetchFileContent } from "@/features/repositories/services/repositories";
import { RepositoryInfo } from "@/types/repository";
import { useEffect, useState, useRef } from "react";
import { fetchPackagesSummary } from "./service";
import { packageDetails } from "./types";

export const useFetchDependencies = (repositoryDetails: RepositoryInfo) => {
  const [dependenciesList, setDependenciesList] = useState<packageDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchedRepoRef = useRef<RepositoryInfo | null>(null);

  useEffect(() => {
    const fetchFile = async () => {
      if (fetchedRepoRef.current === repositoryDetails) return;
      setLoading(true);
      try {
        const packageFile = await fetchFileContent({ repositoryDetails, path: "package.json" });
        const packageLockFile = await fetchFileContent({
          repositoryDetails,
          path: "package-lock.json",
        });

        if (packageFile) {
          const dependencies = JSON.parse(packageFile).dependencies;
          const scoredDependencies = await fetchPackagesSummary({
            dependencies,
            lockFileContent: packageLockFile,
          });

          setDependenciesList(scoredDependencies);
          fetchedRepoRef.current = repositoryDetails; // Save reference to avoid duplicate fetches
          setLoading(false);
          return;
        }

        setDependenciesList([]);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching file:", error);
      }
    };

    fetchFile();
  }, [repositoryDetails]);

  return { dependenciesList, loading };
};
