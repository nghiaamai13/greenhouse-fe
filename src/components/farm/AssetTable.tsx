import { useApiUrl, useCustom, useNavigation } from "@refinedev/core";
import { IAsset, IDevice } from "../../interfaces";
import { Alert, Box, IconButton, Typography } from "@mui/material";
import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { CreateButton, DateField } from "@refinedev/mui";
import { Delete } from "@mui/icons-material";

type farmComponentProps = {
  farm_id: string;
};

const AssetTable: React.FC<farmComponentProps> = ({ farm_id }) => {
  const apiUrl = useApiUrl();
  const { show, list } = useNavigation();
  const { data, isLoading } = useCustom<IAsset[]>({
    url: `${apiUrl}/farms/${farm_id}/assets`,
    method: "get",
  });

  const columns = React.useMemo<GridColDef<IAsset>[]>(
    () => [
      {
        field: "name",
        headerName: "Asset Name",
        flex: 1,
      },
      {
        field: "type",
        headerName: "Type",
        flex: 1,
      },
      {
        field: "created_at",
        headerName: "Created At",
        flex: 1,
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
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="body1" fontWeight={600}>
          Assets
        </Typography>
        <CreateButton
          variant="contained"
          color="primary"
          onClick={() => list("assets")}
        >
          Create
        </CreateButton>
      </Box>

      <DataGrid
        columns={columns}
        rows={data?.data || ([] as readonly IAsset[])}
        getRowId={(row) => row.asset_id}
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
        onRowClick={(row) => {
          show("assets", row.row.asset_id);
        }}
      />
    </Box>
  );
};

export default AssetTable;
