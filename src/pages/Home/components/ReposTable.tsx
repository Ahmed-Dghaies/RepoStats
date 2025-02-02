import React, { useMemo } from "react";
import { Repository } from "../../../types/repository";
import MyTable from "../../../components/common/MyTable";
import RepoActions from "./RepoActions";

const ReposTable: React.FC = () => {
  const repos: Repository[] = [
    {
      name: "cli",
      owner: "cli",
      lastUpdated: "2023-01-01",
      url: "https://github.com/cli/cli",
    },
    {
      name: "repo",
      owner: "owner",
      lastUpdated: "2024-01-01",
      url: "https://github.com/owner/repo",
    },
    {
      name: "repo 2",
      owner: "owner",
      lastUpdated: "2024-01-01",
      url: "https://github.com/owner/repo_2",
    },
  ];
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

  return <MyTable {...{ data: repos, columns, tableClassName: "w-full" }} />;
};

export default ReposTable;
