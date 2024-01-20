import React from "react";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import {
  HttpError,
  IResourceComponentsProps,
  useApiUrl,
  useCustomMutation,
  useDelete,
  useDeleteMany,
  useInvalidate,
  useNavigation,
  usePermissions,
} from "@refinedev/core";
import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  useDataGrid,
  useAutocomplete,
} from "@refinedev/mui";

import Paper from "@mui/material/Paper";

import { CreateButton } from "@refinedev/mui";

import { Edit, Close } from "@mui/icons-material";
import { ICustomer, IFarm, Nullable } from "../../interfaces";
import { useModalForm, useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { CreateFarm } from "../../components/farm/create";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  FormControl,
  Autocomplete,
  Typography,
} from "@mui/material";
import { EditFarm } from "../../components/farm/edit";

export const FarmList: React.FC<IResourceComponentsProps> = () => {
  const { mutate: mutateDeleteMany } = useDeleteMany<IFarm>();
  const { mutate: mutateDeleteOne } = useDelete<IFarm>();

  const [isAssignDialogOpen, setAssignDialogOpen] = React.useState(false);
  const { mutate } = useCustomMutation<IFarm>();
  const { data: role } = usePermissions();
  const { show } = useNavigation();
  const apiUrl = useApiUrl();

  const {
    refineCore: { formLoading, queryResult },
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFarm, HttpError, ICustomer & { customer: ICustomer }>();

  const { autocompleteProps } = useAutocomplete<ICustomer>({
    resource: "customers",
  });

  const { dataGridProps } = useDataGrid<IFarm>({
    initialPageSize: 10,
    pagination: {
      mode: "client",
    },
    filters: {
      mode: "off",
    },
  });

  const columns = React.useMemo<GridColDef<IFarm>[]>(
    () => [
      {
        field: "name",
        headerName: "Name",
        flex: 1,
      },
      {
        field: "descriptions",
        headerName: "Descriptions",
        flex: 1,
      },
      {
        field: "location",
        headerName: "Location",
        flex: 1,
        renderCell(params) {
          return `[${params.row.location[0]}, ${params.row.location[1]}]`;
        },
      },
      {
        field: "created_at",
        headerName: "Created Time",
        flex: 1,
        renderCell: function render({ row }) {
          return <DateField value={row.created_at} format="LLL" />;
        },
      },
      {
        field: "customer",
        headerName: "Assign To",
        flex: 1,
        valueGetter: ({ value }) => value?.username,
        renderCell: function render({ row }) {
          return (
            <Typography color={"primary"}>{row.customer?.username}</Typography>
          );
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
              onClick={() => showEditDrawer(row.farm_id)}
              showInMenu
            />,
            <GridActionsCellItem
              key={2}
              label="Delete"
              icon={<Close color="error" />}
              onClick={() => {
                mutateDeleteOne({
                  resource: "farms",
                  id: row.farm_id,
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

  const invalidate = useInvalidate();
  const handleDeleteConfirmed = async () => {
    mutateDeleteMany(
      {
        resource: "farms",
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

  const createDrawerFormProps = useModalForm<IFarm, HttpError, Nullable<IFarm>>(
    {
      refineCoreProps: { action: "create" },
      syncWithLocation: true,
    }
  );

  const {
    modal: { show: showCreateDrawer },
  } = createDrawerFormProps;

  const editDrawerFormProps = useModalForm<IFarm, HttpError, Nullable<IFarm>>({
    refineCoreProps: { action: "edit" },
    syncWithLocation: true,
  });

  const {
    modal: { show: showEditDrawer },
  } = editDrawerFormProps;

  return (
    <Stack>
      {role === "tenant" && (
        <>
          <CreateFarm {...createDrawerFormProps} />
          <EditFarm {...editDrawerFormProps} />
        </>
      )}

      <List wrapperProps={{ sx: { paddingX: { xs: 2, md: 0 }, flex: 1 } }}>
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

            {isDeleteButtonVisible && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <EditButton
                  variant="contained"
                  color="info"
                  onClick={() => {
                    setAssignDialogOpen(true);
                  }}
                >
                  Assign Devices
                </EditButton>
                <DeleteButton
                  onClick={handleDelete}
                  variant="contained"
                  sx={{ marginLeft: "8px" }}
                >
                  Delete {selectedRows.length} Farms
                </DeleteButton>
              </Box>
            )}
          </Stack>
        )}

        <DataGrid
          {...dataGridProps}
          getRowId={(row) => row.farm_id}
          columns={columns}
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
            show("farms", row.id);
          }}
        />
      </List>

      {role === "tenant" && (
        <>
          {/* ASSIGN TO CUSTOMER DIALOG */}
          <Dialog
            open={isAssignDialogOpen}
            onClose={() => setAssignDialogOpen(false)}
            PaperProps={{
              sx: {
                width: "500px",
                height: "240px",
              },
            }}
          >
            <DialogTitle sx={{ marginLeft: "3px" }}>Assign Devices</DialogTitle>
            <DialogContent sx={{ flex: 1, flexDirection: "row" }}>
              <form
                onSubmit={handleSubmit((data) => {
                  selectedRows.map((row) => {
                    mutate(
                      {
                        url: `${apiUrl}/farms/${row}/customer/${data?.customer?.user_id}`,
                        method: "post",
                        values: {
                          title: "",
                        },
                        successNotification: (data, values, success) => {
                          return {
                            message: `Successfully assigned farms`,
                            type: "success",
                          };
                        },
                      },
                      {
                        onError: (error, variables, context) => {
                          console.log("Error Assigning Farms: ", error);
                        },
                        onSuccess: (data, variables, context) => {
                          setAssignDialogOpen(false);
                          invalidate({
                            resource: "farms",
                            invalidates: ["list"],
                          });
                        },
                      }
                    );
                  });
                })}
              >
                <FormControl sx={{ width: "100%", marginY: "25px" }}>
                  <Controller
                    control={control}
                    name="customer"
                    rules={{ required: "This field is required" }}
                    render={({ field }) => (
                      <Autocomplete
                        disablePortal
                        {...autocompleteProps}
                        {...field}
                        onChange={(_, value) => {
                          field.onChange(value);
                        }}
                        getOptionLabel={(item) => {
                          return item.username ? item.username : "";
                        }}
                        isOptionEqualToValue={(option, value) =>
                          value === undefined ||
                          option?.user_id === (value?.user_id ?? value)
                        }
                        aria-placeholder="Select a customer"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Assign to customer"
                            variant="outlined"
                          />
                        )}
                      />
                    )}
                  />
                </FormControl>

                <Button type="submit" color="primary" variant="contained">
                  Assign
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          {/* DELETE CONFIRMATION DIALOG */}
          <Dialog
            open={isDeleteConfirmationOpen}
            onClose={() => setDeleteConfirmationOpen(false)}
            aria-labelledby="delete-confirmation-dialog-title"
          >
            <DialogTitle id="delete-confirmation-dialog-title">
              Delete {selectedRows.length} Farms
            </DialogTitle>
            <DialogContent>
              <p>Are you sure you want to delete the selected farms?</p>
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
        </>
      )}
    </Stack>
  );
};
