import { useEffect, useMemo, useState } from "react";
import MyCard from "@/components/common/MyCard";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { Repository } from "@/types/repository";
import ReactModal from "react-modal";
import AddRepository from "./AddRepository";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ReposTable from "./ReposTable";
import { refreshRepositories } from "@/features/repositories/reducers/repositoriesReducer";

const Repositories = () => {
  const [filterValue, setFilterValue] = useState<string>("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const originalRepositories = useAppSelector((state) => state.repositories.repositoriesList);
  const dispatch = useAppDispatch();

  const displayedRepositories: Repository[] = useMemo(
    () =>
      originalRepositories.filter((repo) =>
        repo.url.toLowerCase().includes(filterValue.toLowerCase())
      ),
    [filterValue, originalRepositories]
  );

  useEffect(() => {
    dispatch(refreshRepositories());
  }, [dispatch]);

  return (
    <>
      <ReactModal
        isOpen={modalIsOpen}
        className="modal-content !w-2/3"
        overlayClassName="modal-overlay"
      >
        <AddRepository closeModal={() => setModalIsOpen(false)} />{" "}
      </ReactModal>
      <MyCard
        title="Repositories"
        className="w-full lg:w-3/4 mt-6"
        bodyClassName="overflow-hidden px-0 pt-0 pb-2 h-[400px] max-h-[400px] mx-2 flex flex-col"
        searchParams={{
          value: filterValue,
          onChange: setFilterValue,
          placeholder: "Search ...",
          className: "max-w-[300px]",
          containerClassName: "max-w-[300px] !min-w-[100px]",
        }}
        actionParams={{
          icon: faPlus,
          onClick: () => setModalIsOpen(true),
          tip: "Add Repository",
        }}
      >
        <ReposTable repositories={displayedRepositories} />
      </MyCard>
    </>
  );
};

export default Repositories;
