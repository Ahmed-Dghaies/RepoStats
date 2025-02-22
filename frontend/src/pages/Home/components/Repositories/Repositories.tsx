import { useEffect, useMemo, useState } from "react";
import MyCard from "@/components/common/MyCard";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { Repository } from "@/types/repository";
import { fetchAllRepositories } from "@/features/repositories/services/repositories";
import ReactModal from "react-modal";
import AddRepository from "./AddRepository";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ReposTable from "./ReposTable";

const Repositories = () => {
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
    <>
      <ReactModal
        isOpen={modalIsOpen}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <AddRepository closeModal={() => setModalIsOpen(false)} />{" "}
      </ReactModal>
      <MyCard
        title="Repositories"
        className="w-full lg:w-3/4 mt-3"
        bodyClassName="overflow-hidden px-0 pt-0 pb-2 h-[400px] max-h-[400px] mx-2 flex flex-col"
        searchParams={{
          value: filterValue,
          onChange: setFilterValue,
          placeholder: "Search ...",
        }}
        actionParams={{
          icon: faPlus,
          onClick: () => setModalIsOpen(true),
          tip: "Add Repository",
        }}
        children={<ReposTable repositories={displayedRepositories} />}
      />
    </>
  );
};

export default Repositories;
