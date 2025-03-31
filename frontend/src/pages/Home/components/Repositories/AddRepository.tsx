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
import { useState } from "react";
import TextInput from "@/components/fields/TextInput";
import { extractRepositoryDetailsFromUrl } from "@/utils/general/url";
import { fetchRepositoryDetails } from "@/features/repositories/services/repositories";
import { RepositoryInfo } from "@/types/repository";
import LoadingDots from "@/components/common/LoadingDots";

interface NewRepositoryDetails {
  isValid: boolean;
  platform: string;
  organization: string;
  repository: string;
  projectType: string;
  defaultBranch: string;
  dependencyFile: string | null;
  readme: string | null;
}

const AddRepository = ({ closeModal }: { closeModal: () => void }) => {
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
  const couldNotBeFound = "Information could not be retrieved";

  function resetDetails() {
    setRepositoryDetails({
      ...defaultRepositoryDetails,
    });
    setDetailsLoading(false);
    setErrorMessage("");
  }

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

  const toggleTitle = (
    <div className="mt-4 flex">
      <span className="mr-2 underline">Repository Details</span>
      {detailsLoading && (
        <span className="h-full">
          <LoadingDots loading={detailsLoading || true} content={null} />
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
          containerClassName="min-w-[400px] hide-label"
          label="Repository URL"
          errorMessage={errorMessage}
        />
        {detailsLoading ? toggleTitle : null}
        {repositoryDetails.isValid && !detailsLoading && (
          <Collapsible trigger={toggleTitle}>
            <div className="flex flex-col gap-2 mx-1 mt-1 bg-gray-200 rounded-md p-2">
              <Typography>Platform: {repositoryDetails.platform}</Typography>
              <Typography>Organization: {repositoryDetails.organization}</Typography>
              <Typography>Repository: {repositoryDetails.repository}</Typography>
              <Typography>
                Default branch: {repositoryDetails.defaultBranch ?? couldNotBeFound}
              </Typography>
              <Typography>
                Project type: {repositoryDetails.projectType ?? couldNotBeFound}
              </Typography>
              <Typography>Readme: {repositoryDetails.readme ?? couldNotBeFound}</Typography>
              <Typography>
                Dependency file: {repositoryDetails.dependencyFile ?? couldNotBeFound}
              </Typography>
            </div>
          </Collapsible>
        )}
      </DialogBody>
      <DialogFooter className="justify-center">
        <Button
          color="gray"
          className="w-full lg:max-w-[15rem]"
          disabled={!repositoryDetails.isValid}
        >
          Add
        </Button>
      </DialogFooter>
    </>
  );
};

export default AddRepository;
