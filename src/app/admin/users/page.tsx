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
import { Avatar, Box, Button, DialogActions, DialogContent, DialogTitle, IconButton, Link, Tooltip, Dialog } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import GirlIcon from '@mui/icons-material/Female'
import BoyIcon from '@mui/icons-material/Male'
import UnknownIcon from '@mui/icons-material/QuestionMark'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import ResetPasswordIcon from '@mui/icons-material/LockReset'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { api } from '../../../../lib/api'

type User = {
  id: string
  username: string
  nickname: string
  email: string
  phone: string
  realName: string
  sex: string
  avatar: string
  roles: string
  createdAt: Date
  isActive: boolean
  lastLoginAt: Date
};

type UserApiResponse = {
  data: {
    list: Array<User>
    total: number
    page: number
    pageSize: number
  }
}

const queryClient = new QueryClient()

export function UsersTable() {
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [sorting, setSorting] = useState<MRT_SortingState>([])
  const [pagination, setPagination] = useState<MRT_PaginationState>({ pageIndex: 0, pageSize: 10 })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)
  const [usersToResetPassword, setUsersToResetPassword] = useState<User[]>([])
  const [selectedUserIdsForReset, setSelectedUserIdsForReset] = useState<string[]>([])
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const { mutateAsync: deleteUser, isPending: isDeletingUser } = useDeleteUser()
  const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUser()
  const { mutateAsync: updateUser, isPending: isUpdatingUser } = useUpdateUser()
  const { mutateAsync: resetPassword, isPending: isResettingPassword } = useResetPassword()
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({})

  // columns
  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        id: 'username',
        accessorKey: 'username',
        header: 'Username',
        Cell: ({ row }) => {
          return <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
            <Avatar alt="User" src={row.original.avatar || "/user.jpg"} sx={{ display: 'inline-block' }} />
            <Link href={`/admin/users/${row.original.id}`} className="text-gray-600 hover:text-gray-900 text-sm">{row.original.username}</Link>
          </Box>
        },
        enableEditing: true,
        muiEditTextFieldProps: ({ cell, column, row, table }) => ({
          required: true,
          disabled: !!row.original.id,
          error: !!validationErrors?.username,
          helperText: validationErrors?.username,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              username: undefined,
            }),
        }),
      },
      {
        id: 'nickname',
        accessorKey: 'nickname',
        header: 'NickName',
        size: 20,
        muiEditTextFieldProps: {
          error: !!validationErrors?.nickname,
          helperText: validationErrors?.nickname,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              nickname: undefined,
            }),
        },
      },
      {
        id: 'sex',
        accessorKey: 'sex',
        header: 'Sex',
        enableSorting: false,
        Cell: ({ row }) => {
          if (row.original.sex == "Female") {
            return <GirlIcon sx={{ color: '#8b5cf6' }} />
          } else if (row.original.sex == "Male") {
            return <BoyIcon sx={{ color: '#8b5cf6' }} />
          } else {
            return <UnknownIcon sx={{ color: '#8b5cf6' }} />
          }
        },
        filterVariant: 'select',
        filterSelectOptions: [
          "Male",
          "Female",
          "Unknown",
        ],
        size: 15,
        editSelectOptions: [
          "Male",
          "Female",
          "Unknown",
        ],
        muiEditTextFieldProps: {
          required: true,
          select: true,
          error: !!validationErrors?.sex,
          helperText: validationErrors?.sex,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              sex: undefined,
            }),
        },
      },
      {
        id: 'isActive',
        accessorKey: 'isActive',
        header: 'Active',
        enableEditing: false,
        Cell: ({ row }) => {
          return row.original.isActive ? <CheckIcon sx={{ color: '#8b5cf6', fontSize: 20 }} />
            : <CloseIcon sx={{ color: '#8b5cf6', fontSize: 20 }} />
        },
        size: 15,
        enableSorting: false,
        Edit: () => null,
      },
      {
        id: 'email',
        accessorKey: 'email',
        header: 'Email',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.email,
          helperText: validationErrors?.email,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              email: undefined,
            }),
        },
      },
      {
        id: 'phone',
        accessorKey: 'phone',
        header: 'Phone',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.phone,
          helperText: validationErrors?.phone,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              phone: undefined,
            }),
        },
      },
      {
        id: 'roles',
        accessorKey: 'roles',
        header: 'Roles',
        enableSorting: false,
        filterVariant: 'select',
        editSelectOptions: [
          "super_admin",
          "admin",
          "user",
          "visitor",
        ],
        size: 15,
        muiEditTextFieldProps: {
          required: true,
          select: true,
          error: !!validationErrors?.roles,
          helperText: validationErrors?.roles,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              roles: undefined,
            }),
        },
      },
      {
        id: 'lastLoginAt',
        accessorFn: (originalRow) => new Date(originalRow.lastLoginAt),
        accessorKey: 'lastLoginAt',
        enableEditing: false,
        Edit: () => null,
        header: 'Last Login At',
        filterVariant: 'datetime-range',
        Cell: ({ cell }) =>
          `${cell.getValue<Date>().toLocaleDateString()} ${cell
            .getValue<Date>()
            .toLocaleTimeString()}`,
        size: 10,
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
      },
    ],
    [validationErrors],
  )

  /**
   * get users list
   */
  const {
    data: { data = { list: [], total: 0, page: 0, pageSize: 10 } } = {},
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery<UserApiResponse>({
    queryKey: [
      'users-list',
      {
        columnFilters,
        globalFilter,
        pagination,
        sorting,
      },
    ],
    queryFn: async () => {
      // GET users list
      const params = {
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
        filters: JSON.stringify(columnFilters ?? []),
        globalFilter: globalFilter,
        sorting: JSON.stringify(sorting ?? []),
      }
      const result = await api('/api/users', {
        method: 'GET',
        params: params
      })

      return result as UserApiResponse
    },
    placeholderData: keepPreviousData,
  })

  const validateRequired = (value: string) => !!value.length
  function validateUser(user: User) {
    return {
      username: !validateRequired(user.username)
        ? 'Username is Required'
        : '',
      nickname: !validateRequired(user.nickname) ? 'Nickname is Required' : '',
      email: !validateRequired(user.email) ? 'Email is Required' : '',
      phone: !validateRequired(user.phone) ? 'Phone is Required' : '',
      roles: !validateRequired(user.roles) ? 'Roles is Required' : '',
      sex: !validateRequired(user.sex) ? 'Sex is Required' : '',
    };
  }

  const openDeleteConfirmModal = (row: MRT_Row<User>) => {
    setUserToDelete(row.original)
    setDeleteDialogOpen(true)
  };

  /**
   * delete user
   */
  const handleDeleteConfirm = () => {
    if (userToDelete) {
      try {
        deleteUser(userToDelete.id);
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  }
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  }
  function useDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (userId: string) => {
        console.log('deleting user', userId)
        try {
          const response = await api(`/api/users/${userId}`, {
            method: 'DELETE',
          })
          return response;
        } catch (error) {
          console.error('Error deleting user:', error);
          throw error;
        }
      },
      onMutate: (deletedUserId: string) => {
        queryClient.setQueryData(
          ['users-list'],
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
                  list: prevData.data.data.list.filter((user: User) => user.id !== deletedUserId),
                  total: prevData.data.data.total - 1,
                },
              },
            };
          },
        );
      },
      onSettled: () => queryClient.invalidateQueries({ queryKey: ['users-list'] }),
    });
  }

  /**
   * create user
   */
  const handleCreateUser: MRT_TableOptions<User>['onCreatingRowSave'] = async ({
    values,
    table,
  }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    console.log('values', values)
    try {
      await createUser(values)
      table.setCreatingRow(null)
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  }

  function useCreateUser() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (user: User) => {
        console.log('user', user)
        try {
          const response = await api('/api/users', {
            method: 'POST',
            body: JSON.stringify(user),
          })
          console.log('User created successfully:', response);
          return response;
        } catch (error) {
          console.error('Error creating user:', error);
          throw error;
        }
      },
      onMutate: (newUserInfo: User) => {
        queryClient.setQueryData(
          ['users-list'],
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
                      ...newUserInfo,
                      id: (Math.random() + 1).toString(36).substring(7),
                      createdAt: new Date(),
                      lastLoginAt: new Date(),
                    },
                  ],
                  total: prevData.data.data.total + 1,
                },
              },
            };
          },
        );
      },
      onSettled: () => queryClient.invalidateQueries({ queryKey: ['users-list'] }), //refetch users after mutation
    });
  }

  /**
   * update user
   */
  const handleEditUser: MRT_TableOptions<User>['onEditingRowSave'] = async ({
    values,
    table,
  }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    try {
      await updateUser(values);
      table.setEditingRow(null);
    } catch (error) {
      console.error('Failed to update user:', error);
      // 错误已经在 api.ts 中通过 toast 显示了
    }
  }

  function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (user: User) => {
        console.log('updating user', user)
        try {
          const response = await api(`/api/users/${user.id}`, {
            method: 'PUT',
            body: JSON.stringify(user),
          })
          return response;
        } catch (error) {
          console.error('Error updating user:', error);
          throw error;
        }
      },
      onMutate: (updatedUser: User) => {
        queryClient.setQueryData(
          ['users-list'],
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
                  list: prevData.data.data.list.map((user: User) =>
                    user.id === updatedUser.id ? updatedUser : user
                  ),
                },
              },
            };
          },
        );
      },
      onSettled: () => queryClient.invalidateQueries({ queryKey: ['users-list'] }),
    });
  }

  /**
   * reset password
   */
  const handleResetPassword = () => {
    const selectedUserIds = Object.keys(rowSelection).filter(key => rowSelection[key]);
    if (selectedUserIds.length === 0) {
      return;
    }

    const selectedUsers = data.list.filter((user) =>
      selectedUserIds.includes(user.id)
    );

    setSelectedUserIdsForReset(selectedUserIds);
    setUsersToResetPassword(selectedUsers);
    setResetPasswordDialogOpen(true);
  }

  const handleResetPasswordConfirm = async () => {
    try {
      await resetPassword(selectedUserIdsForReset);
      setResetPasswordDialogOpen(false);
      setUsersToResetPassword([]);
      setSelectedUserIdsForReset([]);
      setRowSelection({});
    } catch (error) {
      console.error('Failed to reset password:', error);
    }
  }

  const handleResetPasswordCancel = () => {
    setResetPasswordDialogOpen(false);
    setUsersToResetPassword([]);
    setSelectedUserIdsForReset([]);
  }
  function useResetPassword() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (userIds: string[]) => {
        console.log('resetting password for users:', userIds)
        try {
          const response = await api('/api/users/password', {
            method: 'PUT',
            body: JSON.stringify({ ids: userIds }),
          })
          return response;
        } catch (error) {
          console.error('Error resetting password:', error);
          throw error;
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users-list'] });
      },
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
    onCreatingRowSave: handleCreateUser,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleEditUser,
    getRowId: (row) => row.id,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,

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
          New User
        </Button>
        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<ResetPasswordIcon />}
          onClick={handleResetPassword}
          disabled={Object.keys(rowSelection).length === 0}
          loading={isResettingPassword}
        >
          Reset Password
        </Button>
      </Box>
    ),

    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle>New User</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {internalEditComponents} { }
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),

    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {internalEditComponents} { }
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),

    onRowSelectionChange: setRowSelection,

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

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Delete User
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            Are you sure you want to delete user <strong>{userToDelete?.username}</strong>?
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

      {/* Reset password confirmation dialog */}
      <Dialog
        open={resetPasswordDialogOpen}
        onClose={handleResetPasswordCancel}
        aria-labelledby="reset-password-dialog-title"
        aria-describedby="reset-password-dialog-description"
      >
        <DialogTitle id="reset-password-dialog-title">
          Confirm Reset Password
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            Are you sure you want to reset password for the following users?
            <br />
            <Box sx={{ mt: 2, maxHeight: 200, overflow: 'auto' }}>
              {usersToResetPassword.map((user, index) => (
                <Box key={user.id} sx={{ py: 0.5 }}>
                  • {user.username} {user.nickname && `(${user.nickname})`}
                </Box>
              ))}
              {selectedUserIdsForReset.length > usersToResetPassword.length && (
                <Box sx={{ py: 0.5, color: 'text.secondary', fontStyle: 'italic' }}>
                  • ... and {selectedUserIdsForReset.length - usersToResetPassword.length} more users from other pages
                </Box>
              )}
            </Box>
            <br />
            This action will reset their passwords to default values.
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetPasswordCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleResetPasswordConfirm}
            variant="contained"
            sx={{
              backgroundColor: '#000000',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#333333',
              }
            }}
            disabled={isResettingPassword}
          >
            {isResettingPassword ? 'Resetting...' : 'Reset Password'}
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

export default function UsersPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <UsersTable />
        <Suspense fallback={null}>
          <ReactQueryDevtoolsProduction />
        </Suspense>
      </LocalizationProvider>
    </QueryClientProvider>
  );
}