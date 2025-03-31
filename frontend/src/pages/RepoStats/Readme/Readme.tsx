import { fetchFileContent } from "@/features/repositories/services/repositories";
import { RepositoryInfo } from "@/types/repository";
import { useEffect, useState } from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";

const Readme = ({ repositoryDetails }: { repositoryDetails: RepositoryInfo }) => {
  const [readMeContent, setReadMeContent] = useState<string | null>("");

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await fetchFileContent({ repositoryDetails, path: "README.md" });
        if (response) {
          setReadMeContent(response);
          return;
        }
        setReadMeContent(null);
      } catch (error) {
        console.error("Error fetching file:", error);
      }
    };

    fetchFile();
  }, [repositoryDetails]);

  return (
    <div className="flex flex-grow-1 pl-4 pr-3 overflow-auto mr-1 justify-center">
      {readMeContent === null ? (
        <p>Readme not found</p>
      ) : (
        <MarkdownPreview
          source={readMeContent}
          style={{ padding: "20px", marginBottom: "50px", height: "fit-content", maxWidth: "100%" }}
          wrapperElement={{
            "data-color-mode": "light",
          }}
        />
      )}
    </div>
  );
};

export default Readme;
