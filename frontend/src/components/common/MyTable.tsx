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

interface MetaType {
  className?: string;
}

const MyTable = <T,>({ data, columns, tableClassName, paginationClassName }: TableProps<T>) => {
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
  });

  return (
    <>
      <div className="flex-grow overflow-auto pr-1">
        <table className={tableClassName ?? ""}>
          <thead className="sticky top-0 z-1 bg-[var(--modules-background)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={`text-left h-8 pl-2 ${
                        (header.column.columnDef.meta as MetaType)?.className
                      }`}
                    >
                      <button
                        {...{
                          className: header.column.getCanSort() ? "cursor-pointer select-none" : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </button>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id} className="table-row">
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        className={`${(cell.column.columnDef.meta as MetaType)?.className} pl-2`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className={`flex items-center pt-2 gap-2 justify-end ${paginationClassName ?? ""}`}>
        <span className="hidden sm:flex gap-2 items-center">
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
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount().toLocaleString()}
            </strong>
          </span>
          |
        </span>
        <span className="flex items-center gap-1">
          Go to page:{" "}
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
