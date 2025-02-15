import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import TextInput from "@/components/fields/TextInput";

const AddRepository = ({ closeModal }: { closeModal: () => void }) => {
  const [repositoryUrl, setRepositoryUrl] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  function changeUrl(url: string) {
    setRepositoryUrl(url);
    setErrorMessage("");
  }

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
      </DialogBody>
      <DialogFooter className="justify-center">
        <Button color="gray" className="w-full lg:max-w-[15rem]">
          Add
        </Button>
      </DialogFooter>
    </>
  );
};

export default AddRepository;
