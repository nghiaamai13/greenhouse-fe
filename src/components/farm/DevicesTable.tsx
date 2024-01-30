import { useApiUrl, useCustom, useNavigation } from "@refinedev/core";
import { IDevice } from "../../interfaces";
import { Alert, Box, Button, IconButton, Typography } from "@mui/material";
import React from "react";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { CreateButton, DateField, useDataGrid } from "@refinedev/mui";
import { Delete } from "@mui/icons-material";

type farmComponentProps = {
  farm_id: string;
};

const DevicesTable: React.FC<farmComponentProps> = ({ farm_id }) => {
  const apiUrl = useApiUrl();
  const { show, list } = useNavigation();
  const { data, isLoading } = useCustom<IDevice[]>({
    url: `${apiUrl}/farms/${farm_id}/devices`,
    method: "get",
  });

  const columns = React.useMemo<GridColDef<IDevice>[]>(
    () => [
      {
        field: "name",
        headerName: "Device Name",
        flex: 1,
        minWidth: 300,
      },
      {
        field: "label",
        headerName: "Label",
        flex: 1,
        maxWidth: 50,
      },
      {
        field: "is_gateway",
        headerName: "Is Gateway",
        type: "boolean",
        flex: 1,
      },
      {
        field: "asset",
        headerName: "Asset",
        flex: 1,
        valueGetter: ({ value }) => value?.name,
      },
      {
        field: "device_profile",
        headerName: "Device Profile",
        flex: 1,
        valueGetter: ({ value }) => value?.name,
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
            <IconButton onClick={() => {}}>
              <Delete />
            </IconButton>,
          ];
        },
      },
    ],
    []
  );

  if (isLoading) {
    return <Alert severity="info">Loading...</Alert>;
  }

  return farm_id == "" ? (
    <Alert severity="error">Failed to parse farm data</Alert>
  ) : (
    <Box mt={2}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="body1" fontWeight={600}>
          Devices
        </Typography>
        <CreateButton
          variant="contained"
          color="primary"
          onClick={() => list("devices")}
        >
          Create
        </CreateButton>
      </Box>

      <DataGrid
        columns={columns}
        rows={data?.data || ([] as readonly IDevice[])}
        getRowId={(row) => row.device_id}
        disableRowSelectionOnClick
        autoHeight
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
          sorting: {
            sortModel: [{ field: "created_at", sort: "desc" }],
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        density="comfortable"
        sx={{
          "& .MuiDataGrid-cell:hover": {
            cursor: "pointer",
          },
        }}
        onRowClick={(row) => show("devices", row.row.device_id)}
      />
    </Box>
  );
};

export default DevicesTable;
