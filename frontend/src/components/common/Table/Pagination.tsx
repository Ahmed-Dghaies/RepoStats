import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table } from "@tanstack/react-table";

interface PaginationProps<T> {
  table: Table<T>;
  paginationClassName?: string;
}

const Pagination = <T,>({ table, paginationClassName }: PaginationProps<T>) => {
  return (
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
          icon={faAngleLeft}
          onClick={() => table.previousPage()}
          aria-disabled={!table.getCanPreviousPage()}
        />
        <FontAwesomeIcon
          className="cursor-pointer"
          icon={faAngleRight}
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
            const validatedPage = Math.max(0, Math.min(page, table.getPageCount() - 1));
            table.setPageIndex(validatedPage);
            if (validatedPage !== page) {
              e.target.value = String(validatedPage + 1);
            }
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
  );
};

export default Pagination;
