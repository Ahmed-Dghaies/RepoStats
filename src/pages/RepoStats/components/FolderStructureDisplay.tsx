interface TreeNode {
  name: string;
  type: "directory" | "file";
  children?: TreeNode[];
}

const FolderStructureDisplay = ({ node }: { node: TreeNode }) => {
  return (
    <div style={{ marginLeft: "20px" }}>
      <div
        style={{ fontWeight: node.type === "directory" ? "bold" : "normal" }}
      >
        {node.type === "directory" ? "📁 " : "📄 "}
        {node.name}
      </div>
      {node.children && (
        <div>
          {node.children.map((child, index) => (
            <FolderStructureDisplay
              key={`${child.name}-${index}`}
              node={child}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderStructureDisplay;
