import React from "react";

import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import {
  HttpError,
  IResourceComponentsProps,
  useDelete,
  useNavigation,
  usePermissions,
  useTranslate,
} from "@refinedev/core";
import { CreateButton, DateField, List, useDataGrid } from "@refinedev/mui";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import Close from "@mui/icons-material/Close";
import Edit from "@mui/icons-material/Edit";

import { IDevice, IDeviceCreate, Nullable } from "../../interfaces";
import { useModalForm } from "@refinedev/react-hook-form";
import { CreateDevice } from "./create";

export const DeviceList: React.FC<IResourceComponentsProps> = () => {
  const { show, edit } = useNavigation();
  const { mutate: mutateDelete } = useDelete();
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

  const { dataGridProps } = useDataGrid<IDevice>({
    initialPageSize: 10,
    initialSorter: [
      {
        field: "id",
        order: "desc",
      },
    ],
  });

  const columns = React.useMemo<GridColDef<IDevice>[]>(
    () => [
      {
        field: "name",
        headerName: "Device Name",
        flex: 1,
        minWidth: 200,
      },
      {
        field: "label",
        headerName: "Label",
        flex: 1,
        minWidth: 200,
      },
      {
        field: "is_gateway",
        headerName: "Is Gateway",
        type: "boolean",
        flex: 1,
        minWidth: 200,
      },
      {
        field: "farm",
        headerName: "Farm",
        flex: 1,
        valueGetter: ({ value }) => value.name,
      },
      {
        field: "device_profile",
        headerName: "Device Profile",
        flex: 1,
        valueGetter: ({ value }) => value.name,
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
      {role === "tenant" && <CreateDevice {...createModalFormProps} />}
      <List wrapperProps={{ sx: { paddingX: { xs: 2, md: 0 } } }}>
        <CreateButton
          onClick={() => showCreateModal()}
          variant="contained"
          sx={{ marginBottom: "8px" }}
        >
          Create
        </CreateButton>
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
        />
      </List>
    </>
  );
};
