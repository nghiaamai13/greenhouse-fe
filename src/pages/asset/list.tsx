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

import { IAsset, IAssetCreate, Nullable } from "../../interfaces";
import { useModalForm } from "@refinedev/react-hook-form";
import { CreateAsset } from "../../components/asset/create";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { Edit, Close } from "@mui/icons-material";
import { EditAsset } from "../../components/asset/edit";

export const AssetList: React.FC<IResourceComponentsProps> = () => {
  const { show } = useNavigation();
  const { mutate: mutateDeleteOne } = useDelete<IAsset>();
  const { mutate: mutateDeleteMany } = useDeleteMany<IAsset>();
  const { data: role } = usePermissions();

  const createDrawerFormProps = useModalForm<
    IAssetCreate,
    HttpError,
    Nullable<IAssetCreate>
  >({
    refineCoreProps: { action: "create" },
    syncWithLocation: true,
  });

  const {
    modal: { show: showCreateDrawer },
  } = createDrawerFormProps;

  const editDrawerFormProps = useModalForm<
    IAssetCreate,
    HttpError,
    Nullable<IAssetCreate>
  >({
    refineCoreProps: { action: "edit" },
    syncWithLocation: true,
  });

  const {
    modal: { show: showEditDrawer },
  } = editDrawerFormProps;

  const { dataGridProps } = useDataGrid<IAsset>({
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
        field: "farm",
        headerName: "Farm",
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
              onClick={() => showEditDrawer(row.asset_id)}
              showInMenu
            />,
            <GridActionsCellItem
              key={2}
              label="Delete"
              icon={<Close color="error" />}
              onClick={() => {
                mutateDeleteOne({
                  resource: "assets",
                  id: row.asset_id,
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

  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] =
    React.useState<boolean>(false);

  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);
  const handleSelectionModelChange = (selectionModel: string[]) => {
    setSelectedRows(selectionModel);
  };

  const isDeleteButtonVisible = selectedRows.length > 0;

  const handleDelete = async () => {
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    mutateDeleteMany(
      {
        resource: "assets",
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
          <CreateAsset {...createDrawerFormProps} />
          <EditAsset {...editDrawerFormProps} />
        </>
      )}
      <List wrapperProps={{ sx: { paddingX: { xs: 2, md: 0 } } }}>
        {role === "tenant" && (
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ marginBottom: "8px" }}
          >
            <CreateButton
              onClick={() => showCreateDrawer()}
              variant="contained"
              sx={{ marginBottom: "8px" }}
            >
              Create
            </CreateButton>
            {isDeleteButtonVisible && (
              <DeleteButton
                onClick={handleDelete}
                variant="contained"
                sx={{ marginLeft: "8px" }}
              >
                Delete {selectedRows.length} Assets
              </DeleteButton>
            )}
          </Stack>
        )}
        <DataGrid
          {...dataGridProps}
          columns={columns}
          getRowId={(row) => row.asset_id}
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
            show("assets", row.id);
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
            Delete {selectedRows.length} Assets
          </DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete the selected assets?</p>
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
