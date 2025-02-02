import React, { useState, useMemo, useEffect } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  OnChangeFn,
  HeaderContext,
} from "@tanstack/react-table";
import clsx from "clsx";

export interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: ColumnDef<T, any>[];
  enableSearch?: boolean;
  onSortChange?: (data: SortingState) => void;
  searchComponent?: React.ReactElement;
  enableSortingForRows?: boolean;
  showPagination?: boolean;
  enableMultiSelect?: boolean;
  onSelectionChange?: (rows: T[]) => void;
  nextButton?: React.ReactElement;
  headlineComponent?: React.ReactElement;
  prevButton?: React.ReactElement;
  paginationComponent?: (data: PaginationProps) => JSX.Element;
  expandableRowChild?: (data: T) => React.ReactNode;
  numberOfRowsPerPage?: number;
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
  sortableColumns?: string[]; // string of column IDs
  searchableColumns?: string[]; // string of column IDs
  onSearch?: (query: string) => T[];
  styles?: {
    alternativeRow?: React.CSSProperties; // Styles for alternative rows
    onRowHover?: React.CSSProperties; // Styles for rows on hover
    row?: React.CSSProperties; // Default row styles
    selectedRow?: React.CSSProperties; // Styles for selected rows,
    expandedRow?: React.CSSProperties;
  };
  classNames?: {
    alternativeRow?: string; // Class names for alternative rows
    onRowHover?: string; // Class names for rows on hover
    row?: string; // Default row Class names
    selectedRow?: string; // Class names for selected rows
    expandedRow?: string;
  };
  checkboxComponent?: React.ReactElement;
}

export interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  enableSearch = false,
  searchComponent,
  enableSortingForRows = false,
  showPagination = false,
  enableMultiSelect = false,
  onSelectionChange,
  nextButton,
  onSortChange,
  prevButton,
  expandableRowChild,
  numberOfRowsPerPage = 10, // default value for rows per page
  onPaginationChange,
  onSearch,
  sortableColumns = [],
  searchableColumns = [],
  styles = {},
  headlineComponent,
  classNames = {},
  paginationComponent,
  checkboxComponent,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const newSortingState = updater as SortingState;
    if (onSortChange) {
      onSortChange(newSortingState);
    } else {
      setSorting(newSortingState);
    }
  };

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    if (onSearch) {
      return onSearch(searchQuery);
    }
    return data.filter((row) =>
      Object.entries(row).some(([key, value]) => {
        // Apply search only on columns that are in the searchableColumns array
        if (searchableColumns.length === 0 || searchableColumns.includes(key)) {
          return String(value)
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        }
        return false;
      })
    );
  }, [data, searchQuery, searchableColumns]);

  const table = useReactTable({
    data: filteredData,
    columns: useMemo(
      () =>
        [
          enableMultiSelect
            ? {
                id: "select",
                header: ({ table }: any) =>
                  checkboxComponent ? (
                    React.cloneElement(checkboxComponent, {
                      checked: table.getIsAllRowsSelected(),
                      onChange: table.getToggleAllRowsSelectedHandler(),
                    })
                  ) : (
                    <input
                      type="checkbox"
                      checked={table.getIsAllRowsSelected()}
                      onChange={table.getToggleAllRowsSelectedHandler()}
                    />
                  ),
                cell: ({ row }: any) =>
                  checkboxComponent ? (
                    React.cloneElement(checkboxComponent, {
                      checked: table.getIsAllRowsSelected(),
                      onChange: table.getToggleAllRowsSelectedHandler(),
                    })
                  ) : (
                    <input
                      type="checkbox"
                      checked={row.getIsSelected()}
                      onChange={row.getToggleSelectedHandler()}
                    />
                  ),
                size: 40,
              }
            : null,
          ...columns,
        ]
          .filter(Boolean)
          .map((column: any) => {
            return {
              ...column,
              // Enable sorting only if the column ID is in the sortableColumns array
              enableSorting:
                sortableColumns?.length > 0
                  ? sortableColumns.includes(column?.accessorKey || "")
                  : true,
            };
          }) as ColumnDef<T, any>[],
      [columns, enableMultiSelect]
    ),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: showPagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: enableSortingForRows ? getSortedRowModel() : undefined,
    onSortingChange: handleSortingChange,
    state: {
      sorting,
      rowSelection,
    },

    enableRowSelection: enableMultiSelect,
    onRowSelectionChange: setRowSelection,

    pageCount: onPaginationChange
      ? Math.ceil(filteredData.length / numberOfRowsPerPage)
      : undefined, // Only required if manual pagination is used
    manualPagination: !!onPaginationChange, // Using manual pagination if custom pagination logic is used
  });

  useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = table
        .getSelectedRowModel()
        .rows.map((row) => row.original);
      onSelectionChange(selectedRows);
    }
  }, [rowSelection, onSelectionChange, table]);

  useEffect(() => {
    if (onPaginationChange) {
      onPaginationChange(
        table.getState().pagination.pageIndex,
        numberOfRowsPerPage
      );
    }
  }, [
    table.getState().pagination.pageIndex,
    numberOfRowsPerPage,
    onPaginationChange,
  ]);
  useEffect(() => {
    table.setPageSize(numberOfRowsPerPage);
  }, [numberOfRowsPerPage, table]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "8px",
          width: "100%",
          alignItems: "center",
        }}
      >
        {headlineComponent ? headlineComponent : null}
        {/* Search Bar */}
        {enableSearch && (
          <div style={{ flex: 1 }}>
            {React.isValidElement(searchComponent) ? (
              <div>
                {React.cloneElement(searchComponent as any, {
                  value: searchQuery,
                  onChange: (e: any) => setSearchQuery(e.target.value),
                })}
              </div>
            ) : (
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "30%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <table style={{ width: "100%" }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const sortDirection = header.column.getIsSorted() || "none";
                const isSortable =
                  sortableColumns.length > 0
                    ? sortableColumns.includes(header.id)
                    : true;
                // Get the original header content
                let headerContent =
                  typeof header.column.columnDef.header === "function"
                    ? header.column.columnDef.header({
                        column: header.column,
                        header: header,
                        table: table,
                      })
                    : header.column.columnDef.header;

                return (
                  <th
                    key={header.id}
                    onClick={
                      isSortable
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      cursor: isSortable ? "pointer" : "default",
                      borderBottom: ".4px solid #e0e0e0",
                    }}
                  >
                    {React.isValidElement(headerContent) &&
                    typeof headerContent.type !== "string"
                      ? React.cloneElement(
                          headerContent as React.ReactElement<{
                            sortDirection: string;
                          }>,
                          { sortDirection }
                        )
                      : headerContent}

                    {/* Sorting Arrows (Only if no custom header) */}
                    {!React.isValidElement(headerContent) &&
                      enableSortingForRows && (
                        <span
                          style={{
                            marginLeft: "8px",
                            display: "inline-block",
                            width: "12px",
                            height: "12px",
                          }}
                        >
                          {header.column.getIsSorted() === "asc" && (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="black"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="18 15 12 9 6 15"></polyline>
                            </svg>
                          )}
                          {header.column.getIsSorted() === "desc" && (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="black"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          )}
                        </span>
                      )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, index) => {
            return (
              <React.Fragment key={row.id || index}>
                <tr
                  className={clsx(
                    classNames.row,
                    index % 2 === 0 && classNames.alternativeRow,
                    row.getIsSelected() && classNames.selectedRow,
                    hoveredRowIndex === index && classNames.onRowHover,
                    expandedRow == row.id && classNames.expandedRow
                  )}
                  key={row.id || index}
                  onMouseEnter={() => setHoveredRowIndex(index)}
                  onMouseLeave={() => setHoveredRowIndex(null)}
                  style={{
                    cursor: expandableRowChild ? "pointer" : "default",
                    ...styles.row, // Apply row styles
                    ...(row.getIsSelected() ? styles.selectedRow : {}),
                    ...(index % 2 === 0 ? styles.alternativeRow : {}), // Apply alternative row styles for even rows
                    ...(hoveredRowIndex === index ? styles.onRowHover : {}), // Apply hover styles when row is hovered
                    ...(expandedRow == row.id ? styles.expandedRow : {}),
                  }}
                  onClick={() =>
                    setExpandedRow(expandedRow === row.id ? null : row.id)
                  } // Toggle expand on click
                >
                  <React.Fragment key={row.id || index}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} style={{ padding: "10px" }}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </React.Fragment>
                </tr>

                {expandedRow === row.id && expandableRowChild && (
                  <tr className={row.id + Date.now()}>
                    <td colSpan={columns.length + 1} style={{ width: "100%" }}>
                      {expandableRowChild(row.original)}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {showPagination && (
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {prevButton ? (
            React.isValidElement(prevButton) ? (
              React.cloneElement(prevButton as any, {
                onClick: () => table.previousPage(),
                disabled: !table.getCanPreviousPage(),
              })
            ) : (
              prevButton
            )
          ) : paginationComponent ? null : (
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              style={{
                padding: "6px 12px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "#fff",
                cursor: table.getCanPreviousPage() ? "pointer" : "not-allowed",
                opacity: table.getCanPreviousPage() ? 1 : 0.5,
              }}
            >
              Prev
            </button>
          )}

          <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
            {paginationComponent ? (
              paginationComponent({
                pageCount: table.getPageCount(),
                onPageChange: (pageIndex) => table.setPageIndex(pageIndex),
                currentPage: table.getState().pagination.pageIndex,
              })
            ) : (
              <BasicPagination
                pageCount={table.getPageCount()}
                onPageChange={(pageIndex) => table.setPageIndex(pageIndex)}
                currentPage={table.getState().pagination.pageIndex}
              />
            )}
          </div>

          {nextButton ? (
            React.isValidElement(nextButton) ? (
              React.cloneElement(nextButton as any, {
                onClick: () => table.nextPage(),
                disabled: !table.getCanNextPage(),
              })
            ) : (
              nextButton
            )
          ) : paginationComponent ? null : (
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              style={{
                padding: "6px 12px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "#fff",
                cursor: table.getCanNextPage() ? "pointer" : "not-allowed",
                opacity: table.getCanNextPage() ? 1 : 0.5,
              }}
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const BasicPagination: React.FC<PaginationProps> = ({
  pageCount,
  currentPage,
  onPageChange,
}) => {
  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
      {Array.from({ length: pageCount }, (_, i) => {
        const pageIndex = i;
        const isCurrent = pageIndex === currentPage;
        const isNearCurrent = Math.abs(pageIndex - currentPage) <= 1;
        const isFirstOrLast = pageIndex === 0 || pageIndex === pageCount - 1;

        if (isNearCurrent || isFirstOrLast) {
          return (
            <button
              key={pageIndex}
              onClick={() => onPageChange(pageIndex)}
              style={{
                padding: "8px 14px",
                border: "none",
                borderRadius: "6px",
                backgroundColor: isCurrent ? "#f0f0f0" : "transparent",
                cursor: "pointer",
                minWidth: "36px",
                color: isCurrent ? "#333" : "#666",
              }}
            >
              {pageIndex + 1}
            </button>
          );
        } else if (
          (pageIndex === 1 && currentPage > 2) ||
          (pageIndex === pageCount - 2 && currentPage < pageCount - 3)
        ) {
          return <span key={pageIndex}>...</span>;
        }
        return null;
      })}
    </div>
  );
};

export function handleSortDirection(props: HeaderContext<any, unknown>) {
  return props.column?.getIsSorted
    ? props.column.getIsSorted() == "asc"
      ? "asc"
      : "dsc"
    : "none";
}
