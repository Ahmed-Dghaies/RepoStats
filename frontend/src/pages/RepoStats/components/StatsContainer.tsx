import { useParams } from "react-router-dom";
import RepositoryDetails from "./RepositoryDetails";
import RepositoryGraphs from "./RepositoryGraphs";
import useValidateRepository from "@/hooks/useValidateRepository";
import RepositoryContributors from "./RepositoryContributors";
import RepositorySourceTree from "./RepositorySourceTree";
import { useEffect, useMemo, useState } from "react";
import { RepositoryInfo } from "@/types/repository";
import { fetchRepositoryDetails } from "@/features/repositories/services/repositories";
import {
  faCodeBranch,
  faDatabase,
  faLanguage,
  faPaperclip,
  faStar,
  faTag,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StatsContainer = () => {
  const { owner, repository } = useParams();
  useValidateRepository({ owner, repository });

  const [repositoryDetails, setRepositoryDetails] = useState<RepositoryInfo | null>(null);

  useEffect(() => {
    fetchRepositoryDetails({ owner, repository }).then((details) => {
      setRepositoryDetails(details);
    });
  }, [owner, repository]);

  const displayedTags = useMemo(() => {
    const hasLanguages = Object.keys(repositoryDetails?.languages ?? {}).length > 0;
    const topLanguage = hasLanguages ? Object.keys(repositoryDetails?.languages ?? {})[0] : "";
    interface Tag {
      value: string;
      icon: IconDefinition;
    }
    const values: Tag[] = [
      { value: repositoryDetails?.releases.latestRelease?.tagName ?? "", icon: faTag },
      { value: repositoryDetails?.license ?? "", icon: faPaperclip },
      { value: repositoryDetails?.stars.toString() ?? "", icon: faStar },
      { value: repositoryDetails?.size ?? "", icon: faDatabase },
      { value: repositoryDetails?.defaultBranch ?? "", icon: faCodeBranch },
      { value: topLanguage, icon: faLanguage },
    ].filter((item) => item.value !== "");

    return values.map((item) => <Tag key={item.value} value={item.value} icon={item.icon} />);
  }, [repositoryDetails]);

  return (
    owner &&
    repository &&
    repositoryDetails && (
      <div className="flex flex-col max-h-full overflow-hidden">
        <div className="width-full bg-gray-300 flex flex-col gap-3 p-4 mb-3 md:px-[10%]">
          <div className="text-xl">{`${repositoryDetails.fullName}`}</div>
          <div className="flex flex-wrap gap-2">{displayedTags}</div>
        </div>
        <div className="flex flex-col gap-3 flex-grow-1 pl-4 pr-3 overflow-auto mr-1">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-3">
            <div className="flex flex-col gap-6 sm:gap-3 sm:flex-row w-full lg:w-2/3 xl:w-2/4">
              <RepositoryDetails
                owner={owner}
                repository={repository}
                details={repositoryDetails}
              />
              <RepositoryContributors owner={owner} repository={repository} />
            </div>
            <div className="w-full lg:w-1/3 xl:w-2/4">
              <RepositorySourceTree owner={owner} repository={repository} />
            </div>
          </div>

          <RepositoryGraphs owner={owner} repository={repository} />
        </div>
      </div>
    )
  );
};

const Tag = ({ value, icon }: { value: string; icon: IconDefinition }) => {
  return (
    <div className="flex gap-2 items-center bg-gray-100 p-2 rounded w-fit pr-3 h-7">
      <FontAwesomeIcon icon={icon} className="w-4" />
      {value}
    </div>
  );
};

export default StatsContainer;
