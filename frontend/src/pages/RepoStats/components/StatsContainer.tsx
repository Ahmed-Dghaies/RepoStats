import { Navigate, Route, Routes, useParams } from "react-router-dom";
import useValidateRepository from "@/hooks/useValidateRepository";
import { useEffect, useState } from "react";
import { RepositoryInfo } from "@/types/repository";
import { fetchRepositoryDetails } from "@/features/repositories/services/repositories";
import Readme from "../Readme";
import RepositoryTags from "./RepositoryTags";
import Sections from "./Sections";
import Dependencies from "../Dependencies";
import RepositoryDetails from "../RepositoryDetails";

const StatsContainer = () => {
  const { owner, repository } = useParams();
  useValidateRepository({ owner, repository });

  const [repositoryDetails, setRepositoryDetails] = useState<RepositoryInfo | null>(null);

  useEffect(() => {
    if (!owner || !repository) return;

    fetchRepositoryDetails({ owner, repository }).then((details) => {
      console.log(details);
      setRepositoryDetails(details);
    });
  }, [owner, repository]);

  return (
    owner &&
    repository &&
    repositoryDetails && (
      <div className="flex flex-col max-h-full overflow-hidden">
        <div className="width-full bg-gradient-to-b to-gray-100 from-gray-400 flex flex-col gap-3 p-4 pb-0 mb-3 md:px-[10%]">
          <div className="text-xl">{`${repositoryDetails.fullName}`}</div>
          <RepositoryTags repositoryDetails={repositoryDetails} />
          <Sections repositoryDetails={repositoryDetails} />
        </div>
        <Routes>
          <Route
            path="details"
            element={<RepositoryDetails repositoryDetails={repositoryDetails} />}
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

export default StatsContainer;
