import React from "react";

import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import {
  HttpError,
  IResourceComponentsProps,
  useDelete,
  useDeleteMany,
  usePermissions,
} from "@refinedev/core";
import {
  CreateButton,
  DateField,
  DeleteButton,
  List,
  useDataGrid,
} from "@refinedev/mui";

import { IDeviceProfile, Nullable } from "../../interfaces";
import { useModalForm } from "@refinedev/react-hook-form";
import { CreateDeviceProfile } from "../../components/device_profile/create";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { Edit, Close } from "@mui/icons-material";

export const DeviceProfileList: React.FC<IResourceComponentsProps> = () => {
  const { data: role } = usePermissions();
  const { mutate: mutateDeleteOne } = useDelete<IDeviceProfile>();
  const { mutate: mutateDeleteMany } = useDeleteMany<IDeviceProfile>();

  const createDrawerFormProps = useModalForm<
    IDeviceProfile,
    HttpError,
    Nullable<IDeviceProfile>
  >({
    refineCoreProps: { action: "create" },
  });

  const {
    modal: { show: showCreateDrawer },
  } = createDrawerFormProps;

  const { dataGridProps } = useDataGrid<IDeviceProfile>({
    initialPageSize: 10,
    pagination: {
      mode: "client",
    },
    filters: {
      mode: "off",
    },
    sorters: {
      initial: [
        {
          field: "created_at",
          order: "desc",
        },
      ],
    },
  });

  const columns = React.useMemo<GridColDef<IDeviceProfile>[]>(
    () => [
      {
        field: "name",
        headerName: "Profile Name",
        flex: 1,
        minWidth: 200,
      },
      {
        field: "created_at",
        headerName: "Created At",
        flex: 1,
        minWidth: 300,
        renderCell: function render({ row }) {
          return <DateField value={row.created_at} format="LLL" />;
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        getActions: function render({ row }) {
          return [
            <GridActionsCellItem
              key={1}
              label="Edit"
              icon={<Edit color="success" />}
              onClick={() => {}}
              showInMenu
            />,
            <GridActionsCellItem
              key={2}
              label="Delete"
              icon={<Close color="error" />}
              onClick={() => {
                mutateDeleteOne({
                  resource: "device_profiles",
                  id: row.profile_id,
                });
              }}
              showInMenu
            />,
          ];
        },
      },
    ],
    []
  );

  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);
  const handleSelectionModelChange = (selectionModel: string[]) => {
    setSelectedRows(selectionModel);
  };
  const isDeleteButtonVisible = selectedRows.length > 0;

  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] =
    React.useState<boolean>(false);

  const handleDelete = async () => {
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    mutateDeleteMany(
      {
        resource: "device_profiles",
        ids: selectedRows.map(String),
      },
      {
        onSuccess: () => {
          setSelectedRows([]);
        },
      }
    );
    setDeleteConfirmationOpen(false);
    setSelectedRows([]);
  };

  return (
    <>
      <CreateDeviceProfile {...createDrawerFormProps} />
      <List wrapperProps={{ sx: { paddingX: { xs: 2, md: 0 } } }}>
        {role === "tenant" && (
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mb: "8px" }}
          >
            <CreateButton
              onClick={() => showCreateDrawer()}
              variant="contained"
              sx={{ mb: "8px" }}
            >
              Create
            </CreateButton>
            {isDeleteButtonVisible && (
              <DeleteButton
                onClick={handleDelete}
                variant="contained"
                sx={{ marginLeft: "8px" }}
              >
                Delete {selectedRows.length} Device Profiles
              </DeleteButton>
            )}
          </Stack>
        )}

        <DataGrid
          {...dataGridProps}
          columns={columns}
          getRowId={(row) => row.profile_id}
          autoHeight
          checkboxSelection
          onRowSelectionModelChange={(selectionModel) => {
            handleSelectionModelChange(selectionModel.map(String));
          }}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          density="comfortable"
          sx={{
            "& .MuiDataGrid-cell:hover": {
              cursor: "pointer",
            },
          }}
        />
      </List>
      {role == "tenant" && (
        <Dialog
          open={isDeleteConfirmationOpen}
          onClose={() => setDeleteConfirmationOpen(false)}
          aria-labelledby="delete-confirmation-dialog-title"
        >
          <DialogTitle id="delete-confirmation-dialog-title">
            Delete {selectedRows.length} Device Profiles
          </DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete the selected device profiles?</p>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteConfirmationOpen(false)}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirmed}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};
