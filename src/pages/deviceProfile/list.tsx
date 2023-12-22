import React from "react";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { HttpError, IResourceComponentsProps } from "@refinedev/core";
import { CreateButton, DateField, List, useDataGrid } from "@refinedev/mui";

import { IDeviceProfile, Nullable } from "../../interfaces";
import { useModalForm } from "@refinedev/react-hook-form";
import { CreateDeviceProfile } from "./create";
import { Stack } from "@mui/material";

export const DeviceProfileList: React.FC<IResourceComponentsProps> = () => {
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
    initialSorter: [
      {
        field: "id",
        order: "desc",
      },
    ],
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
    ],
    []
  );

  return (
    <>
      <CreateDeviceProfile {...createDrawerFormProps} />
      <List wrapperProps={{ sx: { paddingX: { xs: 2, md: 0 } } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ marginBottom: "8px" }}
        >
          <CreateButton onClick={() => showCreateDrawer()} variant="contained">
            Create
          </CreateButton>
        </Stack>
        <DataGrid
          {...dataGridProps}
          columns={columns}
          getRowId={(row) => row.profile_id}
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
        />
      </List>
    </>
  );
};
