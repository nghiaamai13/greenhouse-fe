import React from "react";

import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import {
  HttpError,
  IResourceComponentsProps,
  useDelete,
  usePermissions,
} from "@refinedev/core";
import { CreateButton, DateField, List, useDataGrid } from "@refinedev/mui";

import { IDeviceProfile, Nullable } from "../../interfaces";
import { useModalForm } from "@refinedev/react-hook-form";
import { CreateDeviceProfile } from "../../components/device_profile/create";
import { Stack } from "@mui/material";
import { Edit, Close } from "@mui/icons-material";

export const DeviceProfileList: React.FC<IResourceComponentsProps> = () => {
  const { data: role } = usePermissions();
  const { mutate: mutateDeleteOne } = useDelete<IDeviceProfile>();

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
          </Stack>
        )}

        <DataGrid
          {...dataGridProps}
          columns={columns}
          getRowId={(row) => row.profile_id}
          autoHeight
          checkboxSelection
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 100]}
          density="comfortable"
          sx={{
            "& .MuiDataGrid-cell:hover": {
              cursor: "pointer",
            },
          }}
        />
      </List>
    </>
  );
};
