import { RepositoryInfo } from "@/types/repository";
import {
  faCodeBranch,
  faDatabase,
  faEye,
  faLanguage,
  faPaperclip,
  faStar,
  faTag,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";

interface Tag {
  value: string;
  icon: IconDefinition;
  unit: string;
  color: string;
}

const RepositoryTags = ({ repositoryDetails }: { repositoryDetails: RepositoryInfo }) => {
  const displayedTags = useMemo(() => {
    const hasLanguages = Object.keys(repositoryDetails?.languages ?? {}).length > 0;
    const topLanguage = hasLanguages ? Object.keys(repositoryDetails?.languages ?? {})[0] : "";

    const values: Tag[] = [
      {
        value: repositoryDetails?.releases.latestRelease?.tagName ?? "",
        icon: faTag,
        unit: "Release",
        color: "text-green-400",
      },
      {
        value: repositoryDetails?.license ?? "",
        icon: faPaperclip,
        unit: "License",
        color: "text-black-400",
      },
      {
        value: repositoryDetails?.stars.toString() ?? "",
        icon: faStar,
        unit: "Star",
        color: "text-yellow-400",
      },
      {
        value: repositoryDetails?.forkCount.toString() ?? "",
        icon: faCodeBranch,
        unit: "Fork",
        color: "text-blue-400",
      },
      {
        value: repositoryDetails?.watchersCount.toString() ?? "",
        icon: faEye,
        unit: "Watchers",
        color: "text-green-400",
      },
      {
        value: repositoryDetails?.size ?? "",
        icon: faDatabase,
        unit: "Size",
        color: "text-red-400",
      },
      {
        value: repositoryDetails?.defaultBranch ?? "",
        icon: faCodeBranch,
        unit: "Default Branch",
        color: "text-blue-400",
      },
      { value: topLanguage, icon: faLanguage, unit: "Top Language", color: "text-purple-400" },
    ].filter((item) => item.value !== "");

    return values.map((item) => <Tag key={item.value} {...item} />);
  }, [repositoryDetails]);
  return <div className="flex flex-wrap gap-4">{displayedTags}</div>;
};

const Tag = ({ value, icon, unit, color }: Tag) => {
  return (
    <>
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={icon} className={`w-4 ${color}`} />
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">{unit}</div>
        </div>
      </div>
    </>
  );
};

export default RepositoryTags;
