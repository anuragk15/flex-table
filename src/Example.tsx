import { DataTable, handleSortDirection } from "./components/table";
import { ColumnDef } from "@tanstack/react-table";

// Sample Data
export const users = [
  { 
    id: 1, 
    name: "John Doe", 
    age: 28,
    isAccepted: true,
    groups: ['admin', 'developers'],
    lastLogin: '2024-03-20',
    status: 'available'
  },
  { 
    id: 2, 
    name: "Jane Smith", 
    age: 34,
    isAccepted: true,
    groups: ['moderator'],
    lastLogin: '2024-03-19',
    status: 'busy'
  },
  { 
    id: 3, 
    name: "Alice Johnson", 
    age: 22,
    isAccepted: false,
    groups: ['guest'],
    lastLogin: '2024-03-15',
    status: 'offline'
  },
];

const CustomSortCell = ({ value, sortDirection }: { value: string; sortDirection: 'none' | 'asc' | 'dsc' }) => {
  return (
    <div>
      <span>{value}</span>
      {sortDirection !== 'none' && (
        <span style={{ marginLeft: "8px" }}>
          {sortDirection === "asc" ? (
          "asc"
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          )}
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
    cell: (row:any) => row.getValue(),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: (row:any) => <div>{row.getValue()}</div> ,
  },
  {
    accessorKey: "age",
    header: (props)=> <CustomSortCell sortDirection={handleSortDirection(props)} value={'Age'} />,
    cell: (row:any) =>row.getValue()
  },
  {
    accessorKey: "isAccepted",
    header: "Accepted",
    cell: (row:any) => (
      <div
        style={{
          padding: "4px 8px",
          borderRadius: "12px",
          backgroundColor: row.getValue() ? "#e6f4ea" : "#fce8e8",
          color: row.getValue() ? "#1e7e34" : "#d32f2f",
          display: "inline-block",
          fontSize: "14px",
          fontWeight: 500
        }}
      >
        {row.getValue() ? "Yes" : "No"}
      </div>
    ),
  },
  {
    accessorKey: "groups",
    header: "Groups",
    cell: (row:any) => (row.getValue() as string[]).join(", "),
  },
  {
    accessorKey: "lastLogin",
    header: "Last Login",
    cell: (row:any) => row.getValue(),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (row:any) => row.getValue(),
  }
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
        PrevButton={<button>hello</button>}
        SearchComponent={<input
          type="text" 
          placeholder="Custom search..."
          style={{
            width: "100%",
            padding: "8px 12px",
            fontSize: "14px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            outline: "none",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        />}
      />
    </div>
  );
}



