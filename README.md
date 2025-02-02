
# DataTable Component

The `DataTable` component is a highly customizable React table designed to handle data display with features like sorting, pagination, search functionality, and multi-select rows. It is built using `@tanstack/react-table` and includes flexibility to adjust the design, add custom components, and integrate with other UI elements.

## Features

- **Sorting**: Columns can be sortable, with custom sorting logic.
- **Pagination**: Supports both automatic and manual pagination.
- **Search**: Filter the table data based on search queries.
- **Multi-Select**: Allows multiple rows to be selected at once.
- **Expandable Rows**: Enables expanding rows for detailed view.
- **Customizable**: Supports custom components for pagination, sorting, and search functionality.
- **Styling**: Provides options for custom row styles, hover effects, and class names.

## Installation

```bash
npm install @tanstack/react-table clsx
```

## Usage

### Basic Example

```tsx
import React from "react";
import { DataTable } from "./DataTable"; // Path to your DataTable component

const columns = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
];

const data = [
  { id: 1, name: 'Alice', age: 24 },
  { id: 2, name: 'Bob', age: 30 },
  { id: 3, name: 'Charlie', age: 28 },
];

export default function App() {
  return (
    <DataTable
      data={data}
      columns={columns}
      enableSearch={true}
      showPagination={true}
      enableSortingForRows={true}
    />
  );
}
```


#### DataTable Props API

| **API Name**              | **Required** | **Supported Values**                                                                                                    | **Description**                                                                                                  |
|---------------------------|--------------|------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------|
| `data`                    | Yes          | `T[]` (Array of data objects, where `T` is a generic type extending `Record<string, unknown>`)                           | The array of data to be displayed in the table. Each item represents a row in the table.                        |
| `columns`                 | Yes          | `ColumnDef<T, any>[]` (Array of column definitions)                                                                     | Defines the columns for the table, including headers, accessor keys, and optional features like sorting.        |
| `enableSearch`            | No           | `boolean` (Enable or disable the search bar)                                                                             | Toggles the visibility of a search bar for filtering the data in the table.                                      |
| `searchComponent`         | No           | `React.ReactElement` (Custom search component to use)                                                                   | Allows you to specify a custom search component instead of the default one.                                      |
| `enableSortingForRows`    | No           | `boolean` (Enable or disable sorting for rows)                                                                          | Controls whether rows can be sorted based on column values.                                                     |
| `showPagination`          | No           | `boolean` (Enable or disable pagination)                                                                                | Controls whether pagination controls are visible, enabling multiple pages for large datasets.                  |
| `enableMultiSelect`       | No           | `boolean` (Enable or disable multi-row selection)                                                                       | Allows users to select multiple rows at once.                                                                   |
| `onSelectionChange`       | No           | `(rows: T[]) => void` (Callback for when row selection changes)                                                          | Callback function triggered when the selected rows change.                                                      |
| `nextButton`              | No           | `React.ReactElement` (Custom next button)                                                                                | Allows you to customize the "Next" pagination button.                                                           |
| `onSortChange`            | No           | `(data: SortingState) => void` (Callback for when sorting changes)                                                      | Callback function triggered when sorting order or column changes.                                               |
| `prevButton`              | No           | `React.ReactElement` (Custom previous button)                                                                            | Allows you to customize the "Previous" pagination button.                                                       |
| `expandableRowChild`      | No           | `(data: T) => React.ReactNode` (Callback function to render expandable row child)                                         | Renders a custom expandable row when a row is expanded.                                                         |
| `numberOfRowsPerPage`     | No           | `number` (Number of rows to display per page) Default: `10`                                                              | Defines the number of rows shown on each page of the table when pagination is enabled.                          |
| `onPaginationChange`      | No           | `(pageIndex: number, pageSize: number) => void` (Callback for pagination changes)                                        | Callback function triggered when the user changes the page or page size.                                        |
| `sortableColumns`         | No           | `string[]` (Array of column IDs that should be sortable)                                                                | Specifies which columns can be sorted by the user.                                                             |
| `searchableColumns`       | No           | `string[]` (Array of column IDs that should be searchable)                                                              | Specifies which columns should be searchable by the user.                                                      |
| `onSearch`                | No           | `(query: string) => T[]` (Custom search function)                                                                        | Custom search function to handle search logic and return filtered data.                                         |
| `styles`                  | No           | `{ alternativeRow?: React.CSSProperties, onRowHover?: React.CSSProperties, row?: React.CSSProperties, selectedRow?: React.CSSProperties, expandedRow?: React.CSSProperties }` | Allows you to customize the CSS styles for various rows and elements in the table.                              |
| `classNames`              | No           | `{ alternativeRow?: string, onRowHover?: string, row?: string, selectedRow?: string, expandedRow?: string }`          | Allows you to customize the CSS class names for various rows and elements in the table.                        |
| `headlineComponent`       | No           | `React.ReactElement`                                         | Specifies a custom component to be displayed as a headline above the table.                                     |
| `checkboxComponent`       | No           | `React.ReactElement`                                         | Specifies a custom component to be displayed for row selection

| `paginationComponent`     | No           | `(data: PaginationProps) => JSX.Element` (Custom pagination component)                                                  | Allows you to specify a custom pagination component instead of the default one.                                |

#### PaginationProps

- **`pageCount`** (`number`): Total number of pages.
- **`currentPage`** (`number`): The current page index.
- **`onPageChange`** (`(page: number) => void`): Callback to handle page change.

## Customization

You can customize several aspects of the table:

### Search

To enable a custom search input, pass a custom `searchComponent`:

```tsx
<DataTable
  data={data}
  columns={columns}
  enableSearch={true}
  searchComponent={<CustomSearchComponent />}
/>
```

### Sorting

You can control which columns are sortable using the `sortableColumns` prop:

```tsx
<DataTable
  data={data}
  columns={columns}
  sortableColumns={['name', 'age']}
/>
```

### Pagination

You can provide custom pagination buttons or use the default pagination controls:

```tsx
<DataTable
  data={data}
  columns={columns}
  showPagination={true}
  prevButton={<CustomPrevButton />}
  nextButton={<CustomNextButton />}
/>
```

## License

MIT
```

This README provides a clean and concise description of the `DataTable` component, including installation, usage examples, available props, and customization options. You can add more details based on your project requirements.