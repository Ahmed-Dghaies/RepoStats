import MyCard from "@/components/common/MyCard";
import { Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { RepositoryInfo } from "../types/repository";
import {
  downloadRepository,
  fetchRepositoryDetails,
} from "@/features/repositories/services/repositories";
import { Repository } from "@/types/repository";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const RepositoryDetails = ({ owner, name }: Partial<Repository>) => {
  const [repositoryDetails, setRepositoryDetails] =
    useState<RepositoryInfo | null>(null);

  useEffect(() => {
    fetchRepositoryDetails({ owner, name }).then(setRepositoryDetails);
  }, [owner, name]);

  function handleDownload() {
    if (!owner || !name) return;
    downloadRepository({
      owner,
      name,
      branch: repositoryDetails?.defaultBranch ?? "main",
    });
  }

  const Property = ({ title, value }: { title: string; value: string }) => (
    <div className="flex px-3">
      <Typography variant="h6" className="mr-2">
        {title}:
      </Typography>
      <Typography>{value}</Typography>
    </div>
  );

  return (
    <MyCard
      title="Repository"
      actionParams={{
        icon: faDownload,
        onClick: handleDownload,
        tip: "Download repository (zip)",
      }}
      className="w-full sm:w-1/2 md:w-1/4 flex flex-col h-[300px] mt-3"
      bodyClassName="p-2 overflow-y-auto"
    >
      {repositoryDetails !== null && (
        <>
          <Property title="Owner" value={repositoryDetails.owner.login} />
          <Property title="Name" value={repositoryDetails.fullName} />
          <Property title="Created at" value={repositoryDetails.createdAt} />
          {repositoryDetails.description && (
            <Property
              title="Description"
              value={repositoryDetails.description}
            />
          )}
          <Property
            title="Default branch"
            value={repositoryDetails.defaultBranch}
          />

          {repositoryDetails.releases.nbReleases > 0 && (
            <>
              <Property
                title="Number of releases"
                value={repositoryDetails.releases.nbReleases.toString()}
              />
              <Property
                title="Latest release"
                value={repositoryDetails.releases.latestRelease?.tagName ?? ""}
              />
            </>
          )}
          {repositoryDetails.openIssues > 0 && (
            <Property
              title="Open issues"
              value={repositoryDetails.openIssues.toString()}
            />
          )}
        </>
      )}
    </MyCard>
  );
};

export default RepositoryDetails;
