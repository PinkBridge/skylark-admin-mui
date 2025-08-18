'use client';

import React, { useMemo } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import {
  MaterialReactTable,
  MRT_Cell,
  useMaterialReactTable,
  type MRT_ColumnDef, //if using TypeScript (optional, but recommended)
} from 'material-react-table';

interface Person {
  name: string;
  age: number;
}

const data: Person[] = [
  {
    name: 'John',
    age: 30,
  },
  {
    name: 'Sara',
    age: 25,
  },
];

export default function AdminPage() {
  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'name', //simple recommended way to define a column
        header: 'Name',
        muiTableHeadCellProps: { style: { color: 'green' } }, //custom props
        enableHiding: false, //disable a feature for this column
      },
      {
        accessorFn: (originalRow: Person) => parseInt(originalRow.age.toString()), //alternate way
        id: 'age', //id required if you use accessorFn instead of accessorKey
        header: 'Age',
        Header: <i style={{ color: 'red' }}>Age</i>, //optional custom markup
        Cell: ({ cell }: { cell: MRT_Cell<Person> }) => <i>{cell.getValue<number>().toLocaleString()}</i>, //optional custom cell render
      },
    ],
    [],
  );
  const table = useMaterialReactTable({
    columns,
    data, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableRowSelection: true, //enable some features
    enableColumnOrdering: true, //enable a feature for all columns
    enableGlobalFilter: false, //turn off a feature
  });
  return (
    <Box className="space-y-6">
      <Box>
        <Typography variant="h4" className="font-bold text-gray-900 mb-2">
          Data Fetching
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Welcome to the Data Fetching page. This is where you can manage and
          configure your data fetching strategies.
        </Typography>
      </Box>
      <MaterialReactTable table={table} />

      <Card className="h-64 bg-gray-100">
        <CardContent>
          <Typography variant="h6" className="text-gray-700">
            Main Content Area
          </Typography>
          <Typography variant="body2" className="text-gray-600 mt-2">
            This is the main content area that should be visible below the header and to the right of the sidebar.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
