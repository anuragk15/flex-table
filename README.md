

# FlexTable 

A highly customizable, responsive, and feature-rich table component for React. This component leverages the power of **TanStack Table** for handling sorting, pagination, multi-selection, and custom row rendering, among other features. It's designed to be flexible and reusable across your projects.

## Features

- **Sorting**: Supports column-wise sorting with customizable icons.
- **Searchable Fields**: Filter rows based on search query, with the option to use a custom search component.
- **Pagination**: Built-in pagination with customizable page size.
- **Multi-Select Rows**: Select multiple rows using checkboxes.
- **Custom Row Expansion**: Allow expandable rows that accept custom children.
- **Styling Options**: 
  - Hover row styling
  - Alternate row coloring
  - Customizable selected row styling
- **Customizable Buttons**: Includes customizable Next/Previous buttons for pagination.
- **Flexible Configurations**: Easily toggle features like sorting, pagination, multi-selection, and search.

## Installation

```bash
npm install https://github.com/anuragk15/flex-table
```

or

```bash
yarn add https://github.com/anuragk15/flex-table
```

## Usage

```tsx
import React from 'react';
import { DataTable } from '@your-username/data-table';

const columns = [
  { accessor: 'name', header: 'Name' },
  { accessor: 'age', header: 'Age' },
  { accessor: 'location', header: 'Location' },
];

const data = [
  { name: 'John', age: 25, location: 'New York' },
  { name: 'Jane', age: 30, location: 'Los Angeles' },
  { name: 'Doe', age: 22, location: 'Chicago' },
];

const MyTable = () => {
  return (
    <DataTable
      data={data}
      columns={columns}
      enableSearch={true}
      enableSortingForRows={true}
      showPagination={true}
      enableMultiSelect={true}
      NextButton={<button>Next</button>}
      PrevButton={<button>Previous</button>}
      onSortChange={(columnId, direction) => {
        console.log(`Sorted by ${columnId} in ${direction} direction`);
      }}
      onSelectionChange={(selectedRows) => {
        console.log('Selected rows:', selectedRows);
      }}
    />
  );
};
```

### Props

| Prop                        | Type                                               | Default Value | Description |
| --------------------------- | -------------------------------------------------- | ------------- | ----------- |
| `data`                      | `Array<T>`                                         | -             | The data to be displayed in the table |
| `columns`                   | `Array<ColumnDef<T>>`                              | -             | The column definitions |
| `enableSearch`              | `boolean`                                          | `false`       | Whether to enable the search functionality |
| `SearchComponent`           | `React.ReactElement`                               | -             | A custom search component to use |
| `enableSortingForRows`      | `boolean`                                          | `false`       | Whether to enable sorting functionality |
| `showPagination`            | `boolean`                                          | `true`        | Whether to show pagination controls |
| `enableMultiSelect`         | `boolean`                                          | `false`       | Whether to enable multi-row selection |
| `onSelectionChange`         | `(rows: T[]) => void`                              | -             | Callback fired when the selected rows change |
| `NextButton`                | `React.ReactElement`                               | -             | Custom Next button for pagination |
| `PrevButton`                | `React.ReactElement`                               | -             | Custom Previous button for pagination |
| `onSortChange`              | `(columnId: string, direction: 'asc' | 'desc') => void` | -             | Callback fired when sorting changes |

## Styling

- The component supports hover row styling, alternate row coloring, and custom row selection styling through inline styles. You can easily customize these by passing custom styles or by overriding them with CSS classes.

### Styling Example

```tsx
const MyTable = () => {
  return (
    <DataTable
      data={data}
      columns={columns}
      showPagination={true}
      enableSearch={true}
      style={{
        '--hover-color': '#f5f5f5',
        '--selected-row-color': '#d3d3d3',
      }}
    />
  );
};
```

## Customization

### Search Component

You can customize the search bar by passing a custom component for the `SearchComponent` prop.

```tsx
<DataTable
  data={data}
  columns={columns}
  enableSearch={true}
  SearchComponent={<CustomSearchComponent />}
  onSearchChange={(query) => console.log(query)}
/>
```

### Sorting Icons

You can provide your own sorting icons or keep the default ones. 

```tsx
<DataTable
  data={data}
  columns={columns}
  enableSortingForRows={true}
  sortingIcons={{
    asc: <CustomAscIcon />,
    desc: <CustomDescIcon />,
  }}
/>
```

### Custom Pagination Buttons

If you prefer to use your own pagination buttons, you can pass custom elements for the `PrevButton` and `NextButton` props.

```tsx
<DataTable
  data={data}
  columns={columns}
  showPagination={true}
  PrevButton={<CustomPrevButton />}
  NextButton={<CustomNextButton />}
/>
```

## Contributions

We welcome contributions! If you have ideas or bug fixes, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.