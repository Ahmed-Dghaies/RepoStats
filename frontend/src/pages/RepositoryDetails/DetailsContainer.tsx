import { Navigate, Route, Routes, useParams } from "react-router-dom";
import useValidateRepository from "@/hooks/useValidateRepository";
import { useEffect, useState } from "react";
import { RepositoryInfo } from "@/types/repository";
import { fetchRepositoryDetails } from "@/features/repositories/services/repositories";
import Readme from "@/features/repositories/components/Readme";
import RepositoryTags from "./RepositoryTags";
import Sections from "./Sections";
import Dependencies from "@/features/repositories/components/Dependencies";
import RepositoryCards from "@/features/repositories/components/RepositoryCards";

const DetailsContainer = () => {
  const { owner, repository } = useParams();
  useValidateRepository({ owner, repository });

  const [repositoryDetails, setRepositoryDetails] = useState<RepositoryInfo | null>(null);

  useEffect(() => {
    if (!owner || !repository) return;

    fetchRepositoryDetails({ owner, repository }).then((details) => {
      setRepositoryDetails(details);
    });
  }, [owner, repository]);

  return (
    owner &&
    repository &&
    repositoryDetails && (
      <div className="flex flex-col pb-4">
        <div className="width-full  flex flex-col gap-3 p-4 pb-0 mb-3 md:px-[10%]">
          <div className="text-xl">{`${repositoryDetails.fullName}`}</div>
          <RepositoryTags repositoryDetails={repositoryDetails} />
        </div>
        <Sections />
        <Routes>
          <Route
            path="details"
            element={<RepositoryCards repositoryDetails={repositoryDetails} />}
          />
          <Route path="readme" element={<Readme repositoryDetails={repositoryDetails} />} />
          <Route
            path="dependencies"
            element={<Dependencies repositoryDetails={repositoryDetails} />}
          />
          <Route path="" element={<Navigate to="details" replace />} />
        </Routes>
      </div>
    )
  );
};

export default DetailsContainer;
