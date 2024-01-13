import React from "react";

import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import {
  HttpError,
  IResourceComponentsProps,
  useDelete,
  useNavigation,
  usePermissions,
} from "@refinedev/core";
import { CreateButton, DateField, List, useDataGrid } from "@refinedev/mui";

import { IDevice, IDeviceCreate, Nullable } from "../../interfaces";
import { useModalForm } from "@refinedev/react-hook-form";
import { CreateDevice } from "../../components/device/create";
import { EditDevice } from "../../components/device/edit";
import { Stack } from "@mui/material";
import { Edit, Close } from "@mui/icons-material";

export const DeviceList: React.FC<IResourceComponentsProps> = () => {
  const { show } = useNavigation();
  const { mutate: mutateDeleteOne } = useDelete<IDevice>();
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
          </Stack>
        )}

        <DataGrid
          {...dataGridProps}
          columns={columns}
          getRowId={(row) => row.device_id}
          autoHeight
          checkboxSelection
          disableRowSelectionOnClick
          pageSizeOptions={[10, 20, 50, 100]}
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
    </>
  );
};
