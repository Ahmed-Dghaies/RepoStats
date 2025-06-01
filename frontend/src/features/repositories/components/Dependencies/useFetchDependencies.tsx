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
        const scoredDependencies = await fetchPackagesSummary({
          repositoryDetails,
          projectType: repositoryDetails.projectType,
        });

        setDependenciesList(scoredDependencies);
        fetchedRepoRef.current = repositoryDetails;
        setLoading(false);
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
