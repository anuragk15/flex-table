import ComplexPagination from "./components/complexPagination";
import { DataTable, handleSortDirection } from "./components/table";
import { ColumnDef } from "@tanstack/react-table";

// Sample Data
export const users = [
  {
    id: 1,
    name: "John Doe",
    age: 28,
    isAccepted: true,
    groups: ["admin", "developers"],
    lastLogin: "2024-03-20",
    status: "available",
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 34,
    isAccepted: true,
    groups: ["moderator"],
    lastLogin: "2024-03-19",
    status: "busy",
  },
  {
    id: 3,
    name: "Alice Johnson",
    age: 22,
    isAccepted: false,
    groups: ["guest"],
    lastLogin: "2024-03-15",
    status: "offline",
  },
  {
    id: 4,
    name: "Michael Brown",
    age: 40,
    isAccepted: true,
    groups: ["admin", "support"],
    lastLogin: "2024-03-18",
    status: "available",
  },
  {
    id: 5,
    name: "Emily Davis",
    age: 27,
    isAccepted: false,
    groups: ["developer"],
    lastLogin: "2024-03-10",
    status: "offline",
  },
  {
    id: 6,
    name: "Chris Wilson",
    age: 29,
    isAccepted: true,
    groups: ["moderator", "support"],
    lastLogin: "2024-03-21",
    status: "busy",
  },
  {
    id: 7,
    name: "Jessica Taylor",
    age: 31,
    isAccepted: true,
    groups: ["guest", "members"],
    lastLogin: "2024-03-22",
    status: "available",
  },
  {
    id: 8,
    name: "David Martinez",
    age: 38,
    isAccepted: false,
    groups: ["administrators"],
    lastLogin: "2024-03-16",
    status: "offline",
  },
];

const CustomSortCell = ({
  value,
  sortDirection,
}: {
  value: string;
  sortDirection: "none" | "asc" | "dsc";
}) => {
  return (
    <div
      style={{
        minWidth: "70px",
      }}
    >
      <span
        style={{
          fontWeight: 200,
        }}
      >
        {value}
      </span>
      {sortDirection !== "none" && (
        <span style={{ marginLeft: "8px" }}>
          {sortDirection === "asc" ? "asc" : "dsc"}
        </span>
      )}
    </div>
  );
};

// Column Configuration
const columns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (row: any) => row.getValue()
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: (row: any) => <div>{row.getValue()}</div>,
  },
  {
    accessorKey: "age",
    header: (props) => (
      <CustomSortCell
        sortDirection={handleSortDirection(props)}
        value={"Age"}
      />
    ),
    cell: (row: any) => row.getValue(),
  },
  {
    accessorKey: "isAccepted",
    header: "Accepted",
    cell: (row: any) => (
      <div
        style={{
          padding: "4px 8px",
          borderRadius: "12px",
          backgroundColor: row.getValue() ? "#e6f4ea" : "#fce8e8",
          color: row.getValue() ? "#1e7e34" : "#d32f2f",
          display: "inline-block",
          fontSize: "14px",
          fontWeight: 500,
        }}
      >
        {row.getValue() ? "Yes" : "No"}
      </div>
    ),
  },
  {
    accessorKey: "groups",
    header: "Groups",
    cell: (row: any) => (row.getValue() as string[]).join(", "),
  },
  {
    accessorKey: "lastLogin",
    header: "Last Login",
    cell: (row: any) => row.getValue(),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (row: any) => row.getValue(),
  },
];

export default function ExampleUsage() {
  return (
    <div style={{ padding: "20px" }}>
      <DataTable
        data={users}
        columns={columns}
        enableSearch={true}
        enableSortingForRows={true}
        showPagination={true}
        enableMultiSelect
     
        expandableRowChild={(data) => {
          console.log(data);
          return (
            <div
              style={{
                width: "100%",
                textAlign: "center",
              }}
            >
              My name is {data.name}
            </div>
          );
        }}
        numberOfRowsPerPage={6}
        headlineComponent={<h1>Locofy table</h1>}
        searchComponent={
          <input
            type="text"
            placeholder="Custom search..."
            style={{
              padding: "8px 12px",
              fontSize: "14px",
              display: "flex",
              justifySelf: "flex-end",
              border: "1px solid #ddd",
              borderRadius: "6px",
              outline: "none",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          />
        }
      />
    </div>
  );
}
