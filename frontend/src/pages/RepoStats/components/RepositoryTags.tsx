import { RepositoryInfo } from "@/types/repository";
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
import { useMemo } from "react";

const RepositoryTags = ({ repositoryDetails }: { repositoryDetails: RepositoryInfo }) => {
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
  return <div className="flex flex-wrap gap-2">{displayedTags}</div>;
};

const Tag = ({ value, icon }: { value: string; icon: IconDefinition }) => {
  return (
    <div className="flex gap-2 items-center bg-gray-100 p-2 rounded w-fit pr-3 h-7 shadow-lg border border-gray-300">
      <FontAwesomeIcon icon={icon} className="w-4" />
      {value}
    </div>
  );
};

export default RepositoryTags;
