import { faCaretDown, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Collapsible from "react-collapsible";
import {
  Button,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import TextInput from "@/components/Fields/TextInput";
import { extractRepositoryDetailsFromUrl } from "@/utils/general/url";
import { fetchRepositoryDetails } from "@/features/repositories/services/repositories";
import { RepositoryInfo } from "@/types/repository";
import { Loading } from "@/components/Common";
import { refreshRepositories } from "@/features/repositories/reducers/repositoriesReducer";
import { useAppDispatch } from "@/hooks";
import RepositoryDetails from "./RepositoryDetails";
import { NewRepositoryDetails } from "./types";

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
  const dispatch = useAppDispatch();
  const [repositoryDetails, setRepositoryDetails] = useState<NewRepositoryDetails>({
    ...defaultRepositoryDetails,
  });

  useEffect(() => {
    changeUrl(initialUrl);
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
    localStorage.setItem("repositories", JSON.stringify(existingRepositories));
    dispatch(refreshRepositories());
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
      <DialogHeader className="justify-between">
        <Typography variant="h5" color="blue-gray">
          Add Repository
        </Typography>
        <FontAwesomeIcon
          icon={faClose}
          color="gray"
          className="hover:cursor-pointer"
          onClick={closeModal}
        />
      </DialogHeader>
      <DialogBody className="overflow-y-scroll">
        <TextInput
          value={repositoryUrl}
          onChange={changeUrl}
          placeholder="Repository URL ..."
          containerClassName="min-w-[400px]"
          label="Repository URL"
          errorMessage={errorMessage}
        />
        {detailsLoading ? toggleTitle : null}
        <Collapsible trigger={toggleTitle}>
          <RepositoryDetails repositoryDetails={repositoryDetails} loading={detailsLoading} />
        </Collapsible>
      </DialogBody>
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
    </>
  );
};

export default AddRepository;
