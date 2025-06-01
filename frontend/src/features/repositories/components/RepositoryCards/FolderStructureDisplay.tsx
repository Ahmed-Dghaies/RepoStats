import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, FileIcon, FolderIcon } from "lucide-react";
import { TreeItem } from "@/types/repository";

const FolderStructureDisplay = ({ tree }: { tree: TreeItem[] }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  return (
    <>
      {tree.length === 0 ? (
        <div className="text-muted-foreground">No files found in this repository.</div>
      ) : (
        <div>
          <ul>{renderTree(tree, "", expandedFolders, toggleFolder)}</ul>
        </div>
      )}
    </>
  );
};

function renderTree(
  items: TreeItem[],
  parentPath: string,
  expandedFolders: Set<string>,
  toggleFolder: (path: string) => void
) {
  return items.map((item) => {
    const fullPath = parentPath ? `${parentPath}/${item.path}` : item.path;
    const isExpanded = expandedFolders.has(fullPath);

    if (item.type === "tree") {
      return (
        <li key={fullPath}>
          <div className="flex items-center pb-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 mr-0"
              onClick={() => toggleFolder(fullPath)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            <FolderIcon className="h-4 w-4 mr-2 text-yellow-500" />
            <span>{item.path}</span>
          </div>
          {isExpanded && item.children && (
            <ul className="pl-6 space-y-1">
              {renderTree(item.children, fullPath, expandedFolders, toggleFolder)}
            </ul>
          )}
        </li>
      );
    } else {
      return (
        <li key={fullPath} className="flex items-center pb-1 pl-6">
          <FileIcon className="h-4 w-4 mr-2 text-blue-500" />
          <span className="text-sm">{item.path}</span>
        </li>
      );
    }
  });
}

export default FolderStructureDisplay;
