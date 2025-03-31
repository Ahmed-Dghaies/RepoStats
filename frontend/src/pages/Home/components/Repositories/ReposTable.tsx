import { useMemo } from "react";
import { Repository } from "../../../../types/repository";
import MyTable from "../../../../components/common/MyTable";
import RepoActions from "./RepoActions";
import { CellContext } from "@tanstack/react-table";

const ReposTable = ({ repositories }: { repositories: Repository[] }) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "repository",
        header: "Name",
      },
      {
        accessorKey: "owner",
        header: "Owner",
        meta: { className: "hidden sm:table-cell" },
      },
      {
        accessorKey: "lastUpdated",
        header: "Last Updated",
        meta: { className: "hidden md:table-cell" },
      },
      {
        accessorKey: "url",
        header: "URL",
        meta: { className: "hidden sm:table-cell" },
      },
      {
        accessorKey: "actions",
        header: "Actions",
        enableSorting: false,
        cell: RepoActionsCell,
        meta: { className: "!text-center" },
      },
    ],
    []
  );

  return (
    <MyTable
      {...{
        data: repositories,
        columns,
        tableClassName: "w-full flex-grow overflow-auto",
        paginationClassName: "w-full h-8 my-2",
      }}
    />
  );
};

const RepoActionsCell = ({ row }: CellContext<Repository, unknown>) => {
  return <RepoActions row={row.original} />;
};

export default ReposTable;
