import { useMemo, useState } from "react";
import { Card } from "@/components/Common";
import { Repository } from "@/types/repository";
import AddRepository from "./AddRepository";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ReposTable from "./ReposTable";
import useRepositories from "../../hooks/useRepositories";
import { Dialog } from "@/components/ui/dialog";

const RepositoriesTable = () => {
  const [filterValue, setFilterValue] = useState<string>("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const originalRepositories: Repository[] = useRepositories();

  const displayedRepositories: Repository[] = useMemo(
    () =>
      originalRepositories.filter((repo) =>
        repo.url.toLowerCase().includes(filterValue.toLowerCase())
      ),
    [filterValue, originalRepositories]
  );

  return (
    <>
      <Dialog open={modalIsOpen} onOpenChange={setModalIsOpen}>
        <AddRepository closeModal={() => setModalIsOpen(false)} />
      </Dialog>

      <Card
        title="Repositories"
        className="w-full lg:w-3/4"
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
      </Card>
    </>
  );
};

export default RepositoriesTable;
