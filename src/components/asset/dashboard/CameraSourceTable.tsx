import {
  HttpError,
  useApiUrl,
  useCustom,
  useCustomMutation,
  useNotification,
} from "@refinedev/core";
import React from "react";
import { ICameraSource, ICameraSourceAdd, Nullable } from "../../../interfaces";
import { CreateButton, DateField } from "@refinedev/mui";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "@refinedev/react-hook-form";
import { Delete, Visibility, Edit, Close } from "@mui/icons-material";

interface CameraSourceTableProps {
  asset_id: string;
}

const CameraSourceTable: React.FC<CameraSourceTableProps> = ({ asset_id }) => {
  const apiUrl = useApiUrl();
  const queryClient = useQueryClient();
  const { open: openNotification } = useNotification();

  const { data: cameras_data, isLoading: cameraDataIsLoading } =
    useCustom<ICameraSource>({
      url: `${apiUrl}/assets/${asset_id}/cameras`,
      method: "get",
      queryOptions: {
        queryKey: [`${asset_id}_cameras`],
      },
    });

  const cameraSourceColumns = React.useMemo<GridColDef<ICameraSource>[]>(
    () => [
      { field: "camera_source_name", headerName: "Source Name", minWidth: 150 },
      { field: "url", headerName: "Source URL", flex: 1, minWidth: 300 },

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
            <>
              <IconButton>
                <Visibility
                  color="success"
                  onClick={() => handleOpenCameraViewDialog(row.url)}
                />
              </IconButton>
              <IconButton>
                <Delete
                  color="error"
                  onClick={() => handleDeleteCameraSource(row)}
                />
              </IconButton>
            </>,
          ];
        },
      },
    ],
    []
  );

  const [cameraSourceAddDialogOpen, setCameraSourceAddDialogOpen] =
    React.useState(false);
  const handleOpenCameraSourceAdd = () => setCameraSourceAddDialogOpen(true);
  const handleCloseCameraSourceAdd = () => {
    setCameraSourceAddDialogOpen(false);
    reset();
  };

  const [cameraViewDialogOpen, setCameraViewDialogOpen] = React.useState(false);
  const [currentCameraSource, setCurrentCameraSource] =
    React.useState<string>("");

  const handleOpenCameraViewDialog = (source: string) => {
    setCameraViewDialogOpen(true);
    setCurrentCameraSource(source);
  };

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<ICameraSourceAdd, HttpError, Nullable<ICameraSourceAdd>>();

  const { mutate: mutateAddCameraSource } = useCustomMutation<ICameraSource>();
  const { mutate: mutateDeleteCameraSource } =
    useCustomMutation<ICameraSource>();

  const handleSubmitCameraSourceAdd = (camera_data: any) => {
    mutateAddCameraSource(
      {
        url: `${apiUrl}/assets/${asset_id}/cameras`,
        method: "post",
        values: camera_data,
      },
      {
        onError: (error, variables, context) => {
          console.log("Error Adding Camera Source: ", error);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [`${asset_id}_cameras`],
          });
          handleCloseCameraSourceAdd();
          openNotification?.({
            type: "success",
            message: "Successfully add camera source",
          });
        },
      }
    );
  };

  const handleDeleteCameraSource = (data: ICameraSource) => {
    const name = data.camera_source_name;
    mutateDeleteCameraSource(
      {
        values: "",
        url: `${apiUrl}/assets/${asset_id}/cameras/${data.camera_source_id}`,
        method: "delete",
      },
      {
        onError: (error, variables, context) => {
          console.log("Error Deleting Threshold: ", error);
        },
        onSuccess: (data, variables, context) => {
          queryClient.invalidateQueries({
            queryKey: [`${asset_id}_cameras`],
          });
          openNotification?.({
            type: "success",
            message: `Successfully deleted camera source: ${name}`,
          });
        },
      }
    );
  };

  if (asset_id == "") {
    return <div>Failed to get asset_id</div>;
  }

  return (
    <>
      <Box>
        <Stack direction={"row"} marginBottom="8px" flex={1}>
          <CreateButton
            onClick={() => handleOpenCameraSourceAdd()}
            variant="contained"
          >
            Add
          </CreateButton>
        </Stack>

        <DataGrid
          loading={cameraDataIsLoading}
          rows={(cameras_data?.data || []) as readonly ICameraSource[]}
          getRowId={(row) => row.camera_source_id}
          columns={cameraSourceColumns}
          autoHeight
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          density="standard"
          sx={{
            "& .MuiDataGrid-cell:hover": {
              cursor: "pointer",
            },
          }}
        />
      </Box>
      {/* Add Threshold Dialog Form*/}
      <Dialog
        open={cameraSourceAddDialogOpen}
        onClose={handleCloseCameraSourceAdd}
        PaperProps={{ sx: { minWidth: 500 } }}
      >
        <DialogTitle>Add Source</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setCameraSourceAddDialogOpen(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        <DialogContent>
          <form onSubmit={handleSubmit(handleSubmitCameraSourceAdd)}>
            <Stack gap="10px" marginTop="10px">
              <FormControl>
                <TextField
                  id="url"
                  {...register("url", {
                    required: "This field is required",
                    pattern: {
                      value:
                        /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                      message: "Please enter a valid URL",
                    },
                  })}
                  error={!!errors.url}
                  helperText={errors.url?.message}
                  margin="normal"
                  fullWidth
                  label="Source URL"
                  name="url"
                  autoFocus
                />
              </FormControl>
              <FormControl>
                <TextField
                  id="camera_source_name"
                  {...register("camera_source_name", {
                    required: "This field is required",
                  })}
                  error={!!errors.url}
                  helperText={errors.url?.message}
                  margin="normal"
                  fullWidth
                  label="Source Name"
                  autoFocus
                  aria-autocomplete="none"
                />
              </FormControl>
            </Stack>
            <Button
              type="submit"
              variant="contained"
              sx={{ marginTop: "20px" }}
            >
              Add
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={cameraViewDialogOpen}
        onClose={() => {
          setCameraViewDialogOpen(false);
          setCurrentCameraSource("");
        }}
        PaperProps={{
          sx: {
            minWidth: 650,
          },
        }}
      >
        <DialogTitle>View</DialogTitle>
        <Box p={3}>
          <iframe
            style={{
              border: "none",
              top: "0px",
              left: "0px",
              width: "100%",
              minHeight: "480px",
            }}
            src={currentCameraSource}
            allowFullScreen
          ></iframe>
        </Box>
      </Dialog>
    </>
  );
};

export default CameraSourceTable;
