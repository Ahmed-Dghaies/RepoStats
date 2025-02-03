import React, { useMemo } from "react";
import { Repository } from "../../../types/repository";
import MyTable from "../../../components/common/MyTable";
import RepoActions from "./RepoActions";

const ReposTable: React.FC = () => {
  const repos: Repository[] = Array.from({ length: 200 }, () => ({
    name: "cli",
    owner: "cli",
    lastUpdated: "2023-01-01",
    url: "https://github.com/cli/cli",
  }));
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
        data: repos,
        columns,
        tableClassName: "w-full flex-grow overflow-auto",
        paginationClassName: "w-full h-8",
      }}
    />
  );
};

export default ReposTable;
