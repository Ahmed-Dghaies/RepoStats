import { repositoryHasDependenciesFile } from "@/features/repositories/services/repositories";
import { RepositoryInfo } from "@/types/repository";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const Sections = ({ repositoryDetails }: { repositoryDetails: RepositoryInfo }) => {
  const location = useLocation();
  const currentSection = location.pathname.split("/").pop();
  const navigate = useNavigate();
  const { owner, repository } = useParams();
  const [displayedSectionsList, setDisplayedSectionsList] = useState([
    {
      name: "General info",
      url: "details",
    },
    {
      name: "Readme",
      url: "readme",
    },
  ]);

  useEffect(() => {
    const checkForDependenciesFile = async () => {
      const alreadyAdded = displayedSectionsList.some(({ url }) => url === "dependencies");
      if (alreadyAdded) return;
      const hasDependenciesFile = await repositoryHasDependenciesFile(repositoryDetails);

      if (hasDependenciesFile) {
        setDisplayedSectionsList((prev) => {
          if (prev.some(({ url }) => url === "dependencies")) return prev;
          return [...prev, { name: "Dependencies", url: "dependencies" }];
        });
      }
    };

    checkForDependenciesFile();
  }, [repositoryDetails, displayedSectionsList]);

  return (
    <div className="flex mt-2 ">
      {displayedSectionsList.map(({ name, url }) => (
        <div
          key={url}
          className={`p-2 px-4 rounded-t-lg transition-all duration-200 ${
            currentSection === url
              ? "bg-gray-100 shadow-md shadow-gray-400"
              : "bg-gray-400 shadow-inner shadow-gray-600"
          } hover:bg-gray-200 hover:shadow-md hover:shadow-gray-500 cursor-pointer`}
          style={{
            boxShadow:
              currentSection === url
                ? "2px -2px 5px rgba(0, 0, 0, 0.2)"
                : "inset 2px -2px 5px rgba(0, 0, 0, 0.3)",
          }}
          onClick={() => navigate(`/repository/${owner}/${repository}/${url}`)}
        >
          {name}
        </div>
      ))}
    </div>
  );
};

export default Sections;
