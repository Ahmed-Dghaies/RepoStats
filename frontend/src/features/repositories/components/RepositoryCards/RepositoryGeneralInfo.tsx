import { Card } from "@/components/Common";
import { downloadRepository } from "@/features/repositories/services/repositories";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { RepositoryInfo } from "@/types/repository";
import { useParams } from "react-router-dom";

const RepositoryGeneralInfo = ({ details }: { details: RepositoryInfo | null }) => {
  const { owner, repository } = useParams();
  /**
   * Initiates a download of the repository's default branch.
   *
   * @remark
   * If {@link owner} or {@link repository} is missing, the download is not triggered.
   */
  async function handleDownload() {
    if (!owner || !repository) return;
    try {
      await downloadRepository({
        owner,
        repository,
        branch: details?.defaultBranch ?? "main",
      });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Card
      title="Repository"
      actionParams={{
        icon: faDownload,
        onClick: handleDownload,
        tip: "Download repository (zip)",
      }}
      className="w-full sm:w-1/2 flex flex-col h-[300px] py-4"
      bodyClassName="pr-2 pl-3 overflow-y-auto"
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
    </Card>
  );
};

const Property = ({ title, value }: { title: string; value: string }) => (
  <div className="px-3 mb-1">
    <span className="font-bold">{title}:</span>
    <span className="ml-1 break-words">{value}</span>
  </div>
);

export default RepositoryGeneralInfo;
