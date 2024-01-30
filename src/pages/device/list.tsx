import React from "react";

import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import {
  HttpError,
  IResourceComponentsProps,
  useDelete,
  useDeleteMany,
  useNavigation,
  usePermissions,
} from "@refinedev/core";
import {
  CreateButton,
  DateField,
  DeleteButton,
  List,
  useDataGrid,
} from "@refinedev/mui";

import { IDevice, IDeviceCreate, Nullable } from "../../interfaces";
import { useModalForm } from "@refinedev/react-hook-form";
import { CreateDevice } from "../../components/device/create";
import { EditDevice } from "../../components/device/edit";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { Edit, Close } from "@mui/icons-material";

export const DeviceList: React.FC<IResourceComponentsProps> = () => {
  const { show } = useNavigation();
  const { mutate: mutateDeleteOne } = useDelete<IDevice>();
  const { mutate: mutateDeleteMany } = useDeleteMany<IDevice>();
  const { data: role } = usePermissions();

  const createModalFormProps = useModalForm<
    IDeviceCreate,
    HttpError,
    Nullable<IDeviceCreate>
  >({
    refineCoreProps: { action: "create" },
    syncWithLocation: true,
  });
  const {
    modal: { show: showCreateModal },
  } = createModalFormProps;

  const editDrawerFormProps = useModalForm<
    IDeviceCreate,
    HttpError,
    Nullable<IDeviceCreate>
  >({
    refineCoreProps: { action: "edit" },
    syncWithLocation: true,
  });

  const {
    modal: { show: showEditDrawer },
  } = editDrawerFormProps;

  const { dataGridProps } = useDataGrid<IDevice>({
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

  const columns = React.useMemo<GridColDef<IDevice>[]>(
    () => [
      {
        field: "name",
        headerName: "Device Name",
        flex: 1,
      },
      {
        field: "label",
        headerName: "Label",
        flex: 1,
      },
      {
        field: "is_gateway",
        headerName: "Is Gateway",
        type: "boolean",
        flex: 1,
      },
      {
        field: "asset",
        headerName: "Farm - Asset",
        flex: 1,
        valueGetter: ({ value }) => `${value?.farm.name} - ${value?.name}`,
      },
      {
        field: "device_profile",
        headerName: "Device Profile",
        flex: 1,
        valueGetter: ({ value }) => value?.name,
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
              onClick={() => showEditDrawer(row.device_id)}
              showInMenu
            />,
            <GridActionsCellItem
              key={2}
              label="Delete"
              icon={<Close color="error" />}
              onClick={() => {
                mutateDeleteOne({
                  resource: "devices",
                  id: row.device_id,
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
        resource: "devices",
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
      {role === "tenant" && (
        <>
          <CreateDevice {...createModalFormProps} />
          <EditDevice {...editDrawerFormProps} />
        </>
      )}
      <List wrapperProps={{ sx: { paddingX: { xs: 2, md: 0 } } }}>
        {role === "tenant" && (
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mb: "8px" }}
          >
            <CreateButton
              onClick={() => showCreateModal()}
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
                Delete {selectedRows.length} Devices
              </DeleteButton>
            )}
          </Stack>
        )}

        <DataGrid
          {...dataGridProps}
          columns={columns}
          getRowId={(row) => row.device_id}
          autoHeight
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={(selectionModel) => {
            handleSelectionModelChange(selectionModel.map(String));
          }}
          pageSizeOptions={[10, 25, 50]}
          density="comfortable"
          sx={{
            "& .MuiDataGrid-cell:hover": {
              cursor: "pointer",
            },
          }}
          onRowClick={(row) => {
            show("devices", row.id);
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
            Delete {selectedRows.length} Devices
          </DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete the selected devices?</p>
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
