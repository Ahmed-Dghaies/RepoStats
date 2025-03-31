import { packageDetails } from "./types";

const Dependency = ({ packageInfo }: { packageInfo: packageDetails }) => {
  const dependenciesTags = [
    {
      title: "Version",
      value: packageInfo.usedVersion,
    },
    {
      title: "Latest version",
      value: packageInfo.latestVersion,
    },
    {
      title: "Last update",
      value: packageInfo.lastUpdate ? new Date(packageInfo.lastUpdate).toLocaleString() : "",
    },
    {
      title: "Description",
      value: packageInfo.description,
    },
    {
      title: "Dependency score",
      value: packageInfo.dependencyScore,
      className:
        packageInfo.dependencyScore && packageInfo.dependencyScore > 5
          ? "text-green-600"
          : "text-red-600",
    },
  ];
  return (
    <div className="h-fit rounded-2xl border border-gray-500 bg-gray-200 flex flex-col gap-3 p-2">
      <div className="h-6 text-2xl">{packageInfo.name} </div>
      <div className="flex flex-row gap-3 flex-wrap">
        {dependenciesTags.map(
          (tag) =>
            tag.value && (
              <div
                className={`flex border border-gray-500 rounded-lg p-1 text-sm bg-gray-100 ${
                  tag.className ?? ""
                }`}
                key={tag.title}
              >{`${tag.title}: ${tag.value}`}</div>
            )
        )}
      </div>
    </div>
  );
};

export default Dependency;
