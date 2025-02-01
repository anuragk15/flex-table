import { DataTable } from "./components/table";
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
    header: "Age",
    cell: (row:any) => row.getValue(),
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

// define sort based on Columns def --> showSort
//for filtering define which columns to be defined --> showFilter
// change styling based on row selection

// Requirements //

// searchable x,y,z fields based on some def
   // 3 variants for the searchable icon --> start with hidden(none prop) 'asc', 'dsc'
// (later) filtering  a,b,c, headers based on some def
  //
 
// sort  a,b,c, headers based on some def
// multiselect rows
// styling for selected rows
// styled for hover rows, not individual cells
// alternate color styling for rows
// expandable row which accepts custom child --> pass data for the row in this custom child
// pagination
// numberOfRows per page
// handleSortingRange (if they wanna customise it and use their backend)
// onPaginationChange
// 

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
        onSortChange={()=>{
          
        }}
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



