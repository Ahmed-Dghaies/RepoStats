import { Card } from "@/components/Common";
import { Repository, TreeNode } from "@/types/repository";
import { useEffect, useState } from "react";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { createTreeStructure } from "@/utils/graphs/dataPreparation";
import { fetchGitHubRepoTree } from "@/features/repositories/services/repositories";
import FolderStructureDisplay from "./FolderStructureDisplay";
import LoadingOverlay from "@achmadk/react-loading-overlay";

const RepositorySourceTree = ({ owner, repository }: Partial<Repository>) => {
  const [sourceTree, setSourceTree] = useState<TreeNode | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!owner || !repository) return;
    const fetchSourceTree = async () => {
      setLoading(true);
      await fetchGitHubRepoTree({ owner, repository }).then((tree) => {
        if (tree) {
          setSourceTree(tree);
        }
        setLoading(false);
      });
    };

    fetchSourceTree();
  }, [owner, repository]);

  function copySourceTree() {
    if (!sourceTree) return;
    const sourceTreeString = createTreeStructure(sourceTree);
    navigator.clipboard.writeText(sourceTreeString);
  }

  return (
    <Card
      title="Project structure"
      actionParams={{
        icon: faCopy,
        onClick: copySourceTree,
        tip: "Copy project structure",
      }}
      className="w-full flex flex-col h-[300px] mt-6"
      bodyClassName="p-2 overflow-y-auto mr-1 overflow-x-hidden pt-0"
    >
      <LoadingOverlay
        active={loading}
        spinner
        text="Loading repository source tree..."
        className="h-full w-full overflow-x-hidden pr-1"
      >
        {sourceTree && <FolderStructureDisplay node={sourceTree} />}
      </LoadingOverlay>
    </Card>
  );
};

export default RepositorySourceTree;
