'use client'
import { lazy, Suspense, useMemo, useState } from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import {
  MaterialReactTable,
  MRT_EditActionButtons,
  MRT_Row,
  MRT_TableOptions,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from 'material-react-table'
import { Avatar, Box, Button, DialogActions, DialogContent, DialogTitle, IconButton, Link, Tooltip, Dialog, Chip } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import SecurityIcon from '@mui/icons-material/Security'
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { api } from '../../../../lib/api'

type Role = {
  id: string
  name: string
  code: string
  status: string
  sort: number
  description: string
  createdAt: Date
  updatedAt: Date
}

type RoleApiResponse = {
  data: {
    list: Array<Role>
    total: number
    page: number
    pageSize: number
  }
}

const queryClient = new QueryClient()

export function RolesTable() {
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [sorting, setSorting] = useState<MRT_SortingState>([])
  const [pagination, setPagination] = useState<MRT_PaginationState>({ pageIndex: 0, pageSize: 10 })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)
  const [batchDeleteDialogOpen, setBatchDeleteDialogOpen] = useState(false)
  const [rolesToDelete, setRolesToDelete] = useState<Role[]>([])
  const [selectedRoleIdsForDelete, setSelectedRoleIdsForDelete] = useState<string[]>([])
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({})
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const { mutateAsync: deleteRole, isPending: isDeletingRole } = useDeleteRole()
  const { mutateAsync: createRole, isPending: isCreatingRole } = useCreateRole()
  const { mutateAsync: updateRole, isPending: isUpdatingRole } = useUpdateRole()
  const { mutateAsync: batchDeleteRoles, isPending: isBatchDeletingRoles } = useBatchDeleteRoles()

  // columns
  const columns = useMemo<MRT_ColumnDef<Role>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'id',
        header: 'ID',
        enableEditing: false,
        Edit: () => null,
        size: 5,
      },
      {
        id: 'code',
        accessorKey: 'code',
        header: 'Role Code',
        enableEditing: true,
        muiEditTextFieldProps: ({ cell, column, row, table }) => ({
          required: true,
          disabled: !!row.original.id,
          error: !!validationErrors?.code,
          helperText: validationErrors?.code,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              code: undefined,
            }),
        }),
        size: 50,
      },
      {
        id: 'name',
        accessorKey: 'name',
        header: 'Role Name',
        enableEditing: true,
        muiEditTextFieldProps: ({ cell, column, row, table }) => ({
          required: true,
          error: !!validationErrors?.name,
          helperText: validationErrors?.name,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              name: undefined,
            }),
        }),
        size: 50,
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        enableEditing: true,
        Cell: ({ row }) => {
          return row.original.status === "Normal" ? 
            <Chip label="Normal"  size="small" /> :
            <Chip label="Forbidden" size="small" />
        },
        enableSorting: false,
        filterVariant: 'select',
        filterSelectOptions: [
          "Normal",
          "Forbidden",
        ],
        editSelectOptions: [
          "Normal",
          "Forbidden",
        ],
        muiEditTextFieldProps: {
          required: true,
          select: true,
          error: !!validationErrors?.status,
          helperText: validationErrors?.status,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              status: undefined,
            }),
        },
        size: 10,
      },
      {
        id: 'sort',
        accessorKey: 'sort',
        header: 'Sort',
        enableEditing: true,
        muiEditTextFieldProps: {
          type: 'number',
          error: !!validationErrors?.sort,
          helperText: validationErrors?.sort,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              sort: undefined,
            }),
          onChange: (e) => {
            // 确保转换为数字类型
            const value = parseInt(e.target.value) || 0;
            e.target.value = value.toString();
          },
        },
        size: 5,
      },
      {
        id: 'description',
        accessorKey: 'description',
        header: 'Description',
        enableEditing: true,
        muiEditTextFieldProps: {
          multiline: true,
          rows: 2,
          error: !!validationErrors?.description,
          helperText: validationErrors?.description,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              description: undefined,
            }),
        },
        size: 400,
      },
      {
        id: 'createdAt',
        accessorFn: (originalRow) => new Date(originalRow.createdAt),
        accessorKey: 'createdAt',
        enableEditing: false,
        Edit: () => null,
        header: 'Created At',
        filterVariant: 'datetime-range',
        Cell: ({ cell }) =>
          `${cell.getValue<Date>().toLocaleDateString()} ${cell
            .getValue<Date>()
            .toLocaleTimeString()}`,
        size: 150,
      },
    ],
    [validationErrors],
  )

  /**
   * get roles list
   */
  const {
    data: { data = { list: [], total: 0, page: 0, pageSize: 10 } } = {},
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery<RoleApiResponse>({
    queryKey: [
      'roles-list',
      {
        columnFilters,
        globalFilter,
        pagination,
        sorting,
      },
    ],
    queryFn: async () => {
      // GET roles list
      const params = {
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
        filters: JSON.stringify(columnFilters ?? []),
        globalFilter: globalFilter,
        sorting: JSON.stringify(sorting ?? []),
      }
      const result = await api('/api/roles', {
        method: 'GET',
        params: params
      })

      return result as RoleApiResponse
    },
    placeholderData: keepPreviousData,
  })

  const validateRequired = (value: string) => !!value.length
  function validateRole(role: Role) {
    const sortValue = typeof role.sort === 'string' ? parseInt(role.sort) || 0 : role.sort;
    return {
      name: !validateRequired(role.name)
        ? 'Role name is Required'
        : '',
      code: !validateRequired(role.code) ? 'Code is Required' : '',
      description: !validateRequired(role.description) ? 'Description is Required' : '',
      sort: sortValue < 0 ? 'Sort must be >= 0' : '',
      status: role.status !== "Normal" && role.status !== "Forbidden" ? 'Status must be Normal or Forbidden' : '',
    };
  }

  const openDeleteConfirmModal = (row: MRT_Row<Role>) => {
    setRoleToDelete(row.original)
    setDeleteDialogOpen(true)
  };

  /**
   * delete role
   */
  const handleDeleteConfirm = () => {
    if (roleToDelete) {
      try {
        deleteRole(roleToDelete.id);
        setDeleteDialogOpen(false);
        setRoleToDelete(null);
      } catch (error) {
        console.error('Failed to delete role:', error);
      }
    }
  }
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setRoleToDelete(null);
  }

  /**
   * batch delete roles
   */
  const handleBatchDelete = () => {
    const selectedRoleIds = Object.keys(rowSelection).filter(key => rowSelection[key]);
    if (selectedRoleIds.length === 0) {
      return;
    }

    const selectedRoles = data.list.filter((role) =>
      selectedRoleIds.includes(role.id)
    );

    setSelectedRoleIdsForDelete(selectedRoleIds);
    setRolesToDelete(selectedRoles);
    setBatchDeleteDialogOpen(true);
  }

  const handleBatchDeleteConfirm = async () => {
    try {
      await batchDeleteRoles(selectedRoleIdsForDelete);
      setBatchDeleteDialogOpen(false);
      setRolesToDelete([]);
      setSelectedRoleIdsForDelete([]);
      setRowSelection({});
    } catch (error) {
      console.error('Failed to batch delete roles:', error);
    }
  }

  const handleBatchDeleteCancel = () => {
    setBatchDeleteDialogOpen(false);
    setRolesToDelete([]);
    setSelectedRoleIdsForDelete([]);
  }
  function useDeleteRole() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (roleId: string) => {
        console.log('deleting role', roleId)
        try {
          const response = await api(`/api/roles/${roleId}`, {
            method: 'DELETE',
          })
          return response;
        } catch (error) {
          console.error('Error deleting role:', error);
          throw error;
        }
      },
      onMutate: (deletedRoleId: string) => {
        queryClient.setQueryData(
          ['roles-list'],
          (prevData: any) => {
            if (!prevData?.data?.data?.list) {
              return prevData;
            }
            return {
              ...prevData,
              data: {
                ...prevData.data,
                data: {
                  ...prevData.data.data,
                  list: prevData.data.data.list.filter((role: Role) => role.id !== deletedRoleId),
                  total: prevData.data.data.total - 1,
                },
              },
            };
          },
        );
      },
      onSettled: () => queryClient.invalidateQueries({ queryKey: ['roles-list'] }),
    });
  }

  /**
   * create role
   */
  const handleCreateRole: MRT_TableOptions<Role>['onCreatingRowSave'] = async ({
    values,
    table,
  }) => {
    const processedValues = {
      ...values,
      sort: typeof values.sort === 'string' ? parseInt(values.sort) || 0 : values.sort,
    };
    
    const newValidationErrors = validateRole(processedValues);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    console.log('values', processedValues)
    try {
      await createRole(processedValues)
      table.setCreatingRow(null)
    } catch (error) {
      console.error('Failed to create role:', error);
    }
  }

  function useCreateRole() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (role: Role) => {
        console.log('role', role)
        try {
          const response = await api('/api/roles', {
            method: 'POST',
            body: JSON.stringify(role),
          })
          console.log('Role created successfully:', response);
          return response;
        } catch (error) {
          console.error('Error creating role:', error);
          throw error;
        }
      },
      onMutate: (newRoleInfo: Role) => {
        queryClient.setQueryData(
          ['roles-list'],
          (prevData: any) => {
            if (!prevData?.data?.data?.list) {
              return prevData;
            }
            return {
              ...prevData,
              data: {
                ...prevData.data,
                data: {
                  ...prevData.data.data,
                  list: [
                    ...prevData.data.data.list,
                    {
                      ...newRoleInfo,
                      id: (Math.random() + 1).toString(36).substring(7),
                      createdAt: new Date(),
                      updatedAt: new Date(),
                    },
                  ],
                  total: prevData.data.data.total + 1,
                },
              },
            };
          },
        );
      },
      onSettled: () => queryClient.invalidateQueries({ queryKey: ['roles-list'] }),
    });
  }

  /**
   * update role
   */
  const handleEditRole: MRT_TableOptions<Role>['onEditingRowSave'] = async ({
    values,
    table,
  }) => {
    const processedValues = {
      ...values,
      sort: typeof values.sort === 'string' ? parseInt(values.sort) || 0 : values.sort,
    };
    
    const newValidationErrors = validateRole(processedValues);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    try {
      await updateRole(processedValues);
      table.setEditingRow(null);
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  }

  function useUpdateRole() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (role: Role) => {
        console.log('updating role', role)
        try {
          const response = await api(`/api/roles/${role.id}`, {
            method: 'PUT',
            body: JSON.stringify(role),
          })
          return response;
        } catch (error) {
          console.error('Error updating role:', error);
          throw error;
        }
      },
      onMutate: (updatedRole: Role) => {
        queryClient.setQueryData(
          ['roles-list'],
          (prevData: any) => {
            if (!prevData?.data?.data?.list) {
              return prevData;
            }
            return {
              ...prevData,
              data: {
                ...prevData.data,
                data: {
                  ...prevData.data.data,
                  list: prevData.data.data.list.map((role: Role) =>
                    role.id === updatedRole.id ? updatedRole : role
                  ),
                },
              },
            };
          },
        );
      },
             onSettled: () => queryClient.invalidateQueries({ queryKey: ['roles-list'] }),
     });
   }

   function useBatchDeleteRoles() {
     const queryClient = useQueryClient();
     return useMutation({
       mutationFn: async (roleIds: string[]) => {
         console.log('batch deleting roles:', roleIds)
         try {
           const response = await api('/api/roles/batch', {
             method: 'DELETE',
             body: JSON.stringify({ ids: roleIds }),
           })
           return response;
         } catch (error) {
           console.error('Error batch deleting roles:', error);
           throw error;
         }
       },
       onMutate: (deletedRoleIds: string[]) => {
         queryClient.setQueryData(
           ['roles-list'],
           (prevData: any) => {
             if (!prevData?.data?.data?.list) {
               return prevData;
             }
             return {
               ...prevData,
               data: {
                 ...prevData.data,
                 data: {
                   ...prevData.data.data,
                   list: prevData.data.data.list.filter((role: Role) => !deletedRoleIds.includes(role.id)),
                   total: prevData.data.data.total - deletedRoleIds.length,
                 },
               },
             };
           },
         );
       },
       onSettled: () => queryClient.invalidateQueries({ queryKey: ['roles-list'] }),
     });
   }

  // table
  const table = useMaterialReactTable({
    columns,
    data: data.list,
    enableRowActions: true,
    enableRowSelection: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableColumnActions: false,
    positionToolbarAlertBanner: 'bottom',
    paginationDisplayMode: 'pages',
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateRole,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleEditRole,
    getRowId: (row) => row.id,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,

    initialState: {
      showColumnFilters: false, columnPinning: {
        left: ['mrt-row-expand', 'mrt-row-select'],
        right: ['mrt-row-actions'],
      },
    },

    muiToolbarAlertBannerProps: isError
      ? {
        color: 'error',
        children: 'Error loading data',
      }
      : undefined,

    muiSearchTextFieldProps: {
      size: 'small',
      variant: 'outlined',
    },

    muiPaginationProps: {
      color: 'primary',
      rowsPerPageOptions: [10, 20, 30],
      shape: 'rounded',
      showFirstButton: true,
      showLastButton: true,
    },

    rowCount: data.total ?? 0,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      rowSelection,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },

    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Tooltip arrow title="Refresh Data">
          <IconButton onClick={() => refetch()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <Button size="small" variant="contained" color="primary" startIcon={<AddIcon />}
          onClick={() => {
            table.setCreatingRow(true);
          }}>
          New Role
        </Button>
        <Button
          size="small"
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleBatchDelete}
          disabled={Object.keys(rowSelection).filter(key => rowSelection[key]).length === 0}
        >
          Delete Selected ({Object.keys(rowSelection).filter(key => rowSelection[key]).length})
        </Button>
      </Box>
    ),

    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle>New Role</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),

    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle>Edit Role</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),

    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  });

  return (
    <>
      <MaterialReactTable table={table} />

       <Dialog
         open={deleteDialogOpen}
         onClose={handleDeleteCancel}
         aria-labelledby="delete-dialog-title"
         aria-describedby="delete-dialog-description"
       >
         <DialogTitle id="delete-dialog-title">
           Confirm Delete Role
         </DialogTitle>
         <DialogContent>
           <Box sx={{ mt: 1 }}>
             Are you sure you want to delete role <strong>{roleToDelete?.name}</strong>?
             <br />
             This action cannot be undone.
           </Box>
         </DialogContent>
         <DialogActions>
           <Button onClick={handleDeleteCancel} color="primary">
             Cancel
           </Button>
           <Button
             onClick={handleDeleteConfirm}
             variant="contained"
             color="error"
           >
             Delete
           </Button>
         </DialogActions>
       </Dialog>

       {/* Batch delete confirmation dialog */}
       <Dialog
         open={batchDeleteDialogOpen}
         onClose={handleBatchDeleteCancel}
         aria-labelledby="batch-delete-dialog-title"
         aria-describedby="batch-delete-dialog-description"
       >
         <DialogTitle id="batch-delete-dialog-title">
           Confirm Batch Delete Roles
         </DialogTitle>
         <DialogContent>
           <Box sx={{ mt: 1 }}>
             Are you sure you want to delete the following roles?
             <br />
             <Box sx={{ mt: 2, maxHeight: 200, overflow: 'auto' }}>
               {rolesToDelete.map((role, index) => (
                 <Box key={role.id} sx={{ py: 0.5 }}>
                   • {role.name} ({role.code})
                 </Box>
               ))}
               {selectedRoleIdsForDelete.length > rolesToDelete.length && (
                 <Box sx={{ py: 0.5, color: 'text.secondary', fontStyle: 'italic' }}>
                   • ... and {selectedRoleIdsForDelete.length - rolesToDelete.length} more roles from other pages
                 </Box>
               )}
             </Box>
             <br />
             This action cannot be undone.
           </Box>
         </DialogContent>
         <DialogActions>
           <Button onClick={handleBatchDeleteCancel} color="primary">
             Cancel
           </Button>
           <Button
             onClick={handleBatchDeleteConfirm}
             variant="contained"
             color="error"
             disabled={isBatchDeletingRoles}
           >
             {isBatchDeletingRoles ? 'Deleting...' : 'Delete All'}
           </Button>
         </DialogActions>
       </Dialog>
     </>
   )
}

const ReactQueryDevtoolsProduction = lazy(() =>
  import('@tanstack/react-query-devtools/build/modern/production.js').then(
    (d) => ({
      default: d.ReactQueryDevtools,
    }),
  ),
);

export default function RolesPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <RolesTable />
        <Suspense fallback={null}>
          <ReactQueryDevtoolsProduction />
        </Suspense>
      </LocalizationProvider>
    </QueryClientProvider>
  );
}