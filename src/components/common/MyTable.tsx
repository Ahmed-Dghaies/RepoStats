import React from "react";
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesLeft,
  faAnglesRight,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

interface TableProps<T> {
  data: Array<T>;
  columns: ColumnDef<T>[];
  tableClassName?: string;
  paginationClassName?: string;
}

const MyTable = <T,>({
  data,
  columns,
  tableClassName,
  paginationClassName,
}: TableProps<T>) => {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const table = useReactTable({
    columns,
    data,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering
  });

  return (
    <>
      <div className="flex-grow overflow-auto pr-1">
        <table className={tableClassName ?? ""}>
          <thead className="sticky top-0 z-10 bg-[var(--modules-background)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className="text-left h-8"
                    >
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => {
              return (
                <tr
                  key={row.id}
                  className={`h-8 ${
                    index % 2 === 0
                      ? "bg-[var(--modules-background-darker)]"
                      : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div
        className={`flex items-center pt-2 gap-2 justify-end ${
          paginationClassName ?? ""
        }`}
      >
        <FontAwesomeIcon
          className="cursor-pointer"
          icon={faAnglesLeft}
          onClick={() => table.firstPage()}
          aria-disabled={!table.getCanPreviousPage()}
        />
        <FontAwesomeIcon
          className="cursor-pointer"
          icon={faChevronLeft}
          onClick={() => table.previousPage()}
          aria-disabled={!table.getCanPreviousPage()}
        />
        <FontAwesomeIcon
          className="cursor-pointer"
          icon={faChevronRight}
          onClick={() => table.nextPage()}
          aria-disabled={!table.getCanNextPage()}
        />
        <FontAwesomeIcon
          className="cursor-pointer"
          icon={faAnglesRight}
          onClick={() => table.lastPage()}
          aria-disabled={!table.getCanNextPage()}
        />
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default MyTable;
