import { fetchFileContent } from "@/features/repositories/services/repositories";
import { RepositoryInfo } from "@/types/repository";
import { useEffect, useState } from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";

const Readme = ({ repositoryDetails }: { repositoryDetails: RepositoryInfo }) => {
  const [readMeContent, setReadMeContent] = useState<string | null>("");

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const names = ["README.md", "readme.md", "Readme.md", "README.MD"];
        let content = null;
        for (const name of names) {
          const result = await fetchFileContent({ repositoryDetails, path: name });
          if (result) {
            content = result;
            break;
          }
        }
        setReadMeContent(content);
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
        <div className="w-full lg:w-2/3">
          <MarkdownPreview
            source={readMeContent}
            style={{
              padding: "20px",
              marginBottom: "50px",
              height: "fit-content",
              maxWidth: "100%",
            }}
            wrapperElement={{
              "data-color-mode": "light",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Readme;
