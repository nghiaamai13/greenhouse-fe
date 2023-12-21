import React from "react";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { IResourceComponentsProps } from "@refinedev/core";
import { DateField, List, useDataGrid } from "@refinedev/mui";

import { IDeviceProfile } from "../../interfaces";

export const DeviceProfileList: React.FC<IResourceComponentsProps> = () => {
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
    <List wrapperProps={{ sx: { paddingX: { xs: 2, md: 0 } } }}>
      <DataGrid
        {...dataGridProps}
        columns={columns}
        getRowId={(row) => row.profile_id}
        autoHeight
        pageSizeOptions={[10, 20, 50, 100]}
        density="comfortable"
        sx={{
          "& .MuiDataGrid-cell:hover": {
            cursor: "pointer",
          },
        }}
      />
    </List>
  );
};
