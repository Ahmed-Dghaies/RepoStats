import MyCard from "@/components/common/MyCard";
import { Repository, TreeNode } from "@/types/repository";
import { useEffect, useState } from "react";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { createTreeStructure } from "@/utils/graphs/dataPreparation";
import FolderStructureDisplay from "./FolderStructureDisplay";
import { fetchGitHubRepoTree } from "@/features/repositories/services/repositories";

const RepositorySourceTree = ({ owner, repository }: Partial<Repository>) => {
  const [sourceTree, setSourceTree] = useState<TreeNode | null>(null);

  useEffect(() => {
    if (!owner || !repository) return;
    fetchGitHubRepoTree({ owner, repository }).then((tree) => {
      if (tree) {
        setSourceTree(tree);
      }
    });
  }, [owner, repository]);

  function copySourceTree() {
    if (!sourceTree) return;
    const sourceTreeString = createTreeStructure(sourceTree);
    navigator.clipboard.writeText(sourceTreeString);
  }

  return (
    <MyCard
      title="Project structure"
      actionParams={{
        icon: faCopy,
        onClick: copySourceTree,
        tip: "Copy project structure",
      }}
      className="w-full flex flex-col h-[300px] mt-6"
      bodyClassName="p-2 overflow-y-auto mr-1"
    >
      {sourceTree && <FolderStructureDisplay node={sourceTree} />}
    </MyCard>
  );
};

export default RepositorySourceTree;
