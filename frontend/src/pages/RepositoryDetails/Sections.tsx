import { useLocation, useNavigate, useParams } from "react-router-dom";

const Sections = () => {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);
  const currentSection = pathParts[pathParts.length - 1] ?? "details";
  const navigate = useNavigate();
  const { owner, repository } = useParams();
  const displayedSectionsList = [
    {
      name: "General info",
      url: "details",
    },
    {
      name: "Readme",
      url: "readme",
    },
    { name: "Dependencies", url: "dependencies" },
  ];

  function handleSectionClick(url: string) {
    navigate(`/repository/${owner}/${repository}/${url}`);
  }

  return (
    <div className="sections-wrapper sticky top-0 z-20 py-3 mb-2 px-4 md:px-[10%] backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="flex gap-6">
        {displayedSectionsList.map(({ name, url }, index) => (
          <div
            key={url}
            tabIndex={index}
            onClick={() => handleSectionClick(url)}
            onKeyDown={(e) => e.key === "Enter" && handleSectionClick(url)}
            className={`select-none text-sm md:text-base font-medium px-1 pb-1.5 cursor-pointer transition-all duration-200 ${
              currentSection === url
                ? "text-black dark:text-white border-b-2 border-blue-500"
                : "text-gray-800 dark:text-gray-400 hover:text-black dark:hover:text-gray-200"
            }`}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sections;
