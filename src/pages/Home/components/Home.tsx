import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import ReposTable from "./ReposTable";
import { fetchAllRepositories } from "../../../features/repositories/services/repositories";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Repository } from "../../../types/repository";
import ReactModal from "react-modal";
import AddRepository from "../modals/AddRepository";
import homeStyle from "../styles/Home.module.css";
import TextInput from "../../../components/fields/TextInput";

const Home: React.FC = () => {
  const [filterValue, setFilterValue] = useState<string>("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const originalRepositories = useAppSelector(
    (state) => state.repositories.repositoriesList
  );
  const dispatch = useAppDispatch();

  const displayedRepositories: Repository[] = useMemo(
    () =>
      originalRepositories.filter((repo) =>
        repo.url.toLowerCase().includes(filterValue.toLowerCase())
      ),
    [filterValue, originalRepositories]
  );

  useEffect(() => {
    dispatch(fetchAllRepositories());
  }, [dispatch]);

  return (
    <div className="grow overflow-x-hidden overflow-y-auto p-5">
      <ReactModal
        isOpen={modalIsOpen}
        className={homeStyle.customContent}
        overlayClassName={homeStyle.customOverlay}
      >
        <AddRepository closeModal={() => setModalIsOpen(false)} />{" "}
      </ReactModal>
      <Card className="w-3/4 mt-3">
        <CardHeader
          variant="gradient"
          color="gray"
          className="mb-8 p-6 flex justify-between"
        >
          <Typography variant="h6" color="white">
            <div>Repositories</div>
          </Typography>
          <div className="flex gap-3">
            <TextInput
              value={filterValue}
              onChange={(value) => setFilterValue(value)}
              icon={<FontAwesomeIcon icon={faSearch} />}
              placeholder="Search ..."
              width="!w-[300px]"
            />
            <div
              className="h-full flex items-center"
              data-tooltip-content="Add Repository"
              data-tooltip-id="global-tooltip"
            >
              <FontAwesomeIcon
                icon={faPlus}
                className="color-white hover:cursor-pointer text-xl font-bold"
                onClick={() => setModalIsOpen(true)}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-hidden px-0 pt-0 pb-2 h-[400px] max-h-[400px] mx-2 flex flex-col">
          <ReposTable repositories={displayedRepositories} />
        </CardBody>
      </Card>
    </div>
  );
};

export default Home;
