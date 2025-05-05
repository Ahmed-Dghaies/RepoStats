import { faCaretDown, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Collapsible from "react-collapsible";
import { useEffect, useState } from "react";
import { extractRepositoryDetailsFromUrl } from "@/utils/general/url";
import { fetchRepositoryDetails } from "@/features/repositories/services/repositories";
import { RepositoryInfo } from "@/types/repository";
import RepositoryDetails from "./RepositoryDetails";
import { NewRepositoryDetails } from "./types";
import { Loading } from "@/components/Common";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { Input } from "@/components/ui/input";
import { DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const AddRepository = ({
  closeModal,
  initialUrl = "",
}: {
  closeModal: () => void;
  initialUrl?: string;
}) => {
  const [repositoryUrl, setRepositoryUrl] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
  const defaultRepositoryDetails: NewRepositoryDetails = {
    isValid: false,
    platform: "",
    organization: "",
    repository: "",
    projectType: "",
    defaultBranch: "",
    dependencyFile: null,
    readme: null,
  };
  const [repositoryDetails, setRepositoryDetails] = useState<NewRepositoryDetails>({
    ...defaultRepositoryDetails,
  });

  useEffect(() => {
    changeUrl(initialUrl);

    return () => {
      resetDetails();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUrl]);

  /**
   * Resets the repository details, loading state, and error message to their default values.
   */
  function resetDetails() {
    setRepositoryDetails({
      ...defaultRepositoryDetails,
    });
    setDetailsLoading(false);
    setErrorMessage("");
  }

  /**
   * Processes a repository URL by validating its format, extracting details, and fetching additional repository information.
   *
   * If the URL is invalid or repository details cannot be retrieved, resets the details and sets an appropriate error message.
   *
   * @param url - The repository URL to process.
   */
  async function changeUrl(url: string) {
    setDetailsLoading(true);
    setRepositoryUrl(url);
    if (url === "") {
      resetDetails();
      return;
    }
    const newRepositoryDetails = extractRepositoryDetailsFromUrl(url);
    if (!newRepositoryDetails) {
      resetDetails();
      setErrorMessage("Invalid URL");
      return;
    }
    const retrievedDetails: RepositoryInfo = await fetchRepositoryDetails({
      owner: newRepositoryDetails.organization,
      repository: newRepositoryDetails.repository,
    });
    if (retrievedDetails === null) {
      resetDetails();
      setErrorMessage("Could not retrieve repository details");
      return;
    }
    setRepositoryDetails((prev) => {
      return {
        ...prev,
        isValid: true,
        ...newRepositoryDetails,
        defaultBranch: retrievedDetails.defaultBranch,
        projectType: retrievedDetails.projectType,
        readme: retrievedDetails.readme,
        dependencyFile: retrievedDetails.dependencyFile,
      };
    });
    setDetailsLoading(false);
    setErrorMessage("");
  }

  /**
   * Adds the current repository to local storage and refreshes the repository list.
   *
   * Constructs a repository object from the current input and fetched details, saves it to local storage, dispatches a refresh action, and closes the modal.
   */
  function handleAddClick() {
    const existingRepositories = JSON.parse(localStorage.getItem("repositories") ?? "[]");
    const newRepository = {
      url: repositoryUrl,
      owner: repositoryDetails.organization,
      platform: repositoryDetails.platform,
      repository: repositoryDetails.repository,
      defaultBranch: repositoryDetails.defaultBranch,
      projectType: repositoryDetails.projectType,
      readme: repositoryDetails.readme,
      dependencyFile: repositoryDetails.dependencyFile,
      lastUpdated: new Date().toISOString(),
    };
    existingRepositories.push(newRepository);
    const newRepositories = JSON.stringify(existingRepositories);
    localStorage.setItem("repositories", newRepositories);
    window.dispatchEvent(new CustomEvent("repositoriesUpdated", { detail: existingRepositories }));
    closeModal();
  }

  const toggleTitle = (
    <div className="mt-4 flex">
      <span className="mr-2 underline">Repository Details</span>
      {detailsLoading && (
        <span className="h-full">
          <Loading loading={detailsLoading} content={null} />
        </span>
      )}
      {!detailsLoading && (
        <span>
          <FontAwesomeIcon icon={faCaretDown} />
        </span>
      )}
    </div>
  );

  return (
    <>
      <DialogContent className="overflow-y-auto">
        <DialogHeader className="justify-between">
          <div className="text-lg font-medium">Add Repository</div>
        </DialogHeader>
        <div className="space-y-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter GitHub repository URL (e.g., https://github.com/vercel/next.js)"
              value={repositoryUrl}
              onChange={(e) => changeUrl(e.target.value)}
              className={`pl-10 !ring-2 ${errorMessage ? "!ring-red-500" : ""}`}
            />
            <FontAwesomeIcon
              icon={faGithub}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5"
            />
          </div>
          {errorMessage && !detailsLoading && (
            <div className="flex items-center gap-2 text-red-500">
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4" />
              <div>{errorMessage}</div>
            </div>
          )}
        </div>
        {(detailsLoading || repositoryDetails.isValid) && (
          <Collapsible trigger={toggleTitle}>
            <RepositoryDetails repositoryDetails={repositoryDetails} loading={detailsLoading} />
          </Collapsible>
        )}

        <DialogFooter className="justify-center">
          <Button
            color="gray"
            className="w-full lg:max-w-[15rem] hover:cursor-pointer"
            disabled={!repositoryDetails.isValid}
            onClick={handleAddClick}
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </>
  );
};

export default AddRepository;
