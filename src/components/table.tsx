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
} from "@tanstack/react-table";

interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: ColumnDef<T, any>[];
  enableSearch?: boolean;
  onSortChange?: (data:SortingState) => void;
  SearchComponent?: React.ReactElement;
  enableSortingForRows?: boolean;
  showPagination?: boolean;
  enableMultiSelect?: boolean;
  onSelectionChange?: (rows: T[]) => void;
  NextButton?: React.ReactElement;
  PrevButton?: React.ReactElement;
  expandableRowChild?: (data: T) => React.ReactNode;
  numberOfRowsPerPage?: number;
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
  sortableColumns?: string[]; // string of column IDs
  searchableColumns?: string[]; // string of column IDs
  onSearch?:(query:string) =>T[]
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  enableSearch = false,
  SearchComponent,
  enableSortingForRows = false,
  showPagination = true,
  enableMultiSelect = false,
  onSelectionChange,
  NextButton,
  onSortChange,
  PrevButton,
  expandableRowChild,
  numberOfRowsPerPage = 10, // default value for rows per page
  onPaginationChange,
  onSearch,
  sortableColumns = [],
  searchableColumns=[]
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const newSortingState = updater as SortingState;

    if (onSortChange) {
      onSortChange(newSortingState);
    } else {
      setSorting(newSortingState);
    }
  };

  const filteredData = useMemo(() => {
    if(onSearch){
     return onSearch(searchQuery);
    }
    if (!searchQuery) return data;

    return data.filter((row) =>
      Object.entries(row).some(([key, value]) => {
        // Apply search only on columns that are in the searchableColumns array
        if (searchableColumns.length === 0 || searchableColumns.includes(key)) {
          return String(value).toLowerCase().includes(searchQuery.toLowerCase());
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
                header: ({ table }: any) => (
                  <input
                    type="checkbox"
                    checked={table.getIsAllRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                  />
                ),
                cell: ({ row }: any) => (
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
        ].filter(Boolean).map((column) => ({
          ...column,
          // Enable sorting only if the column ID is in the sortableColumns array
          enableSorting: sortableColumns.includes(column?.id || ""),
        })) as ColumnDef<T, any>[],
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
    manualPagination: onPaginationChange ? true : false, // Using manual pagination if custom pagination logic is used
    pageCount: Math.ceil(filteredData.length / numberOfRowsPerPage), // Calculate total page count
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
      onPaginationChange(table.getState().pagination.pageIndex, numberOfRowsPerPage);
    }
  }, [table.getState().pagination.pageIndex, numberOfRowsPerPage, onPaginationChange]);

  return (
    <div>
      {/* Search Bar */}
      {enableSearch && (
        <div style={{ marginBottom: "12px" }}>
          {React.isValidElement(SearchComponent) ? (
            <div>
              {React.cloneElement(SearchComponent as any, {
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

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} style={{}}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    cursor: "pointer",
                    borderBottom: ".4px solid #e0e0e0",
                  }}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}

                  {enableSortingForRows && (
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
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, index) => (
            <tr
              key={row.id || index}
              style={{ borderBottom: ".1px solid #e0e0e0" }}
              onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)} // Toggle expand on click
            >
              <React.Fragment key={row.id || index}>
              <tr
                key={row.id || index}
                style={{ borderBottom: ".1px solid #e0e0e0" }}
                onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)} // Toggle expand on click
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} style={{ padding: "10px" }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
              {expandedRow === row.id && expandableRowChild && (
                <tr>
                  <td colSpan={columns.length}>
                    {expandableRowChild(row.original)} {/* Render custom child */}
                  </td>
                </tr>
              )}
            </React.Fragment>
            </tr>
          ))}
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
          {PrevButton ? (
            React.isValidElement(PrevButton) ? (
              React.cloneElement(PrevButton as any, {
                onClick: () => table.previousPage(),
                disabled: !table.getCanPreviousPage(),
              })
            ) : (
              PrevButton
            )
          ) : (
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

          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            {Array.from({ length: table.getPageCount() }, (_, i) => {
              const pageIndex = i;
              const isCurrent =
                pageIndex === table.getState().pagination.pageIndex;
              const isNearCurrent =
                Math.abs(pageIndex - table.getState().pagination.pageIndex) <=
                1;
              const isFirstOrLast =
                pageIndex === 0 || pageIndex === table.getPageCount() - 1;

              if (isNearCurrent || isFirstOrLast) {
                return (
                  <button
                    key={pageIndex}
                    onClick={() => table.setPageIndex(pageIndex)}
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
                (pageIndex === 1 &&
                  table.getState().pagination.pageIndex > 2) ||
                (pageIndex === table.getPageCount() - 2 &&
                  table.getState().pagination.pageIndex <
                    table.getPageCount() - 3)
              ) {
                return <span key={pageIndex}>...</span>;
              }
              return null;
            })}
          </div>

          {NextButton ? (
            React.isValidElement(NextButton) ? (
              React.cloneElement(NextButton as any, {
                onClick: () => table.nextPage(),
                disabled: !table.getCanNextPage(),
              })
            ) : (
              NextButton
            )
          ) : (
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
