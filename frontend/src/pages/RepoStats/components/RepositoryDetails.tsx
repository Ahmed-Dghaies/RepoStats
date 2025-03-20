import MyCard from "@/components/common/MyCard";
import { Typography } from "@material-tailwind/react";
import { RepositoryInfo } from "../types/repository";
import { downloadRepository } from "@/features/repositories/services/repositories";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const RepositoryDetails = ({
  owner,
  repository,
  details,
}: {
  owner: string;
  repository: string;
  details: RepositoryInfo | null;
}) => {
  function handleDownload() {
    if (!owner || !repository) return;
    downloadRepository({
      owner,
      repository,
      branch: details?.defaultBranch ?? "main",
    });
  }

  return (
    <MyCard
      title="Repository"
      actionParams={{
        icon: faDownload,
        onClick: handleDownload,
        tip: "Download repository (zip)",
      }}
      className="w-full sm:w-1/2 flex flex-col h-[300px] mt-6"
      bodyClassName="p-2 overflow-y-auto"
    >
      {details !== null && (
        <>
          <Property title="Owner" value={details.owner.login} />
          <Property title="Name" value={details.fullName} />
          <Property title="Created at" value={details.createdAt} />
          {details.description && <Property title="Description" value={details.description} />}
          <Property title="Default branch" value={details.defaultBranch} />

          {details.releases.nbReleases > 0 && (
            <>
              <Property title="Number of releases" value={details.releases.nbReleases.toString()} />
              <Property
                title="Latest release"
                value={details.releases.latestRelease?.tagName ?? ""}
              />
            </>
          )}
          {details.openIssues > 0 && (
            <Property title="Open issues" value={details.openIssues.toString()} />
          )}
        </>
      )}
    </MyCard>
  );
};

const Property = ({ title, value }: { title: string; value: string }) => (
  <div className="flex px-3">
    <Typography variant="h6" className="mr-2">
      {title}:
    </Typography>
    <Typography>{value}</Typography>
  </div>
);

export default RepositoryDetails;
