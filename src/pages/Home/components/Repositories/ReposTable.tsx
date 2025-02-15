import { useMemo } from "react";
import { Repository } from "../../../../types/repository";
import MyTable from "../../../../components/common/MyTable";
import RepoActions from "./RepoActions";

const ReposTable = ({ repositories }: { repositories: Repository[] }) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "owner",
        header: "Owner",
      },
      {
        accessorKey: "lastUpdated",
        header: "Last Updated",
        hideFor: ["sm"],
      },
      {
        accessorKey: "url",
        header: "URL",
        hideFor: ["sm"],
      },
      {
        accessorKey: "actions",
        header: "Actions",
        enableSorting: false,
        cell: (props: { row: { original: Repository } }) => (
          <RepoActions row={props.row.original} />
        ),
        className: "text-center",
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

export default ReposTable;
