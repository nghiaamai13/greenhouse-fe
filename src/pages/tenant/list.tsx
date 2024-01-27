import React from "react";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { HttpError, IResourceComponentsProps } from "@refinedev/core";
import { CreateButton, DateField, List, useDataGrid } from "@refinedev/mui";

import { ICustomer, ICustomerCreate, Nullable } from "../../interfaces";
import { useModalForm } from "@refinedev/react-hook-form";
import { CreateTenant } from "./create";
import { Stack } from "@mui/material";

export const TenantList: React.FC<IResourceComponentsProps> = () => {
  const { dataGridProps } = useDataGrid<ICustomer>({
    initialPageSize: 10,
    initialSorter: [
      {
        field: "user_id",
        order: "desc",
      },
    ],
  });

  const columns = React.useMemo<GridColDef<ICustomer>[]>(
    () => [
      {
        field: "username",
        headerName: "Username",
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

  const createDrawerFormProps = useModalForm<
    ICustomerCreate,
    HttpError,
    Nullable<ICustomerCreate>
  >({
    refineCoreProps: { action: "create" },
  });

  const {
    modal: { show: showCreateDrawer },
  } = createDrawerFormProps;

  return (
    <>
      <CreateTenant {...createDrawerFormProps} />
      <List wrapperProps={{ sx: { paddingX: { xs: 2, md: 0 } } }}>
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

        <DataGrid
          {...dataGridProps}
          columns={columns}
          getRowId={(row) => row.user_id}
          autoHeight
          checkboxSelection
          pageSizeOptions={[10, 25, 50]}
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
