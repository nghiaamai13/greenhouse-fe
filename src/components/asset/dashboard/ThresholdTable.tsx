import {
  HttpError,
  useApiUrl,
  useCustom,
  useCustomMutation,
  useNotification,
} from "@refinedev/core";
import React from "react";
import { IThreshold, IThresholdAdd, Nullable } from "../../../interfaces";
import { CreateButton, DateField } from "@refinedev/mui";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { Close, Delete } from "@mui/icons-material";

interface ThresholdTableProps {
  asset_id: string;
}

const ThresholdTable: React.FC<ThresholdTableProps> = ({ asset_id }) => {
  const apiUrl = useApiUrl();
  const queryClient = useQueryClient();
  const { open: openNotification } = useNotification();

  const { data: key_data, isLoading: keyIsLoading } = useCustom({
    url: `${apiUrl}/assets/${asset_id}/keys`,
    method: "get",
  });

  const { data: threshholds_data, isLoading: thresholdIsLoading } =
    useCustom<IThreshold>({
      url: `${apiUrl}/assets/${asset_id}/thresholds`,
      method: "get",
      queryOptions: {
        queryKey: ["asset_thresholds"],
      },
    });

  const thresholdColumns = React.useMemo<GridColDef<IThreshold>[]>(
    () => [
      { field: "key", headerName: "Key", flex: 1 },
      {
        field: "threshold_min",
        headerName: "Min Value",
      },
      {
        field: "threshold_max",
        headerName: "Max Value",
      },
      {
        field: "modified_at",
        headerName: "Created/Modified At",
        flex: 1,
        renderCell: function render({ row }) {
          return <DateField value={row.modified_at} format="LLL" />;
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        getActions: function render({ row }) {
          return [
            <IconButton onClick={() => handleDeleteThreshold(row)}>
              <Delete />
            </IconButton>,
          ];
        },
      },
    ],
    []
  );

  const [thresholdAddOpen, setThresholdAddOpen] = React.useState(false);
  const handleOpenThresholdAdd = () => setThresholdAddOpen(true);
  const handleCloseThresholdAdd = () => {
    setThresholdAddOpen(false);
    reset();
  };

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<IThresholdAdd, HttpError, Nullable<IThresholdAdd>>();

  const { mutate: mutateAddThreshold } = useCustomMutation<IThreshold>();
  const { mutate: mutateDeleteThreshold } = useCustomMutation<IThreshold>();

  const handleSubmitThresholdAdd = (data: any) => {
    const parsedData = {
      ...data,
      threshold_min: parseFloat(data.threshold_min.toString()),
      threshold_max: parseFloat(data.threshold_max.toString()),
    };

    mutateAddThreshold(
      {
        url: `${apiUrl}/assets/${asset_id}/threshold/${data.key}`,
        method: "post",
        values: parsedData,
      },
      {
        onError: (error, variables, context) => {
          console.log("Error Adding Threshold: ", error);
        },
        onSuccess: (data, variables, context) => {
          queryClient.invalidateQueries({ queryKey: ["asset_thresholds"] });
          handleCloseThresholdAdd();
          openNotification?.({
            type: "success",
            message: "Successfully updated threshold",
          });
        },
      }
    );
  };

  const handleDeleteThreshold = (data: IThreshold) => {
    const key = data.key;
    mutateDeleteThreshold(
      {
        values: "",
        url: `${apiUrl}/assets/${asset_id}/threshold/${key}`,
        method: "delete",
      },
      {
        onError: (error, variables, context) => {
          console.log("Error Deleting Threshold: ", error);
        },
        onSuccess: (data, variables, context) => {
          queryClient.invalidateQueries({ queryKey: ["asset_thresholds"] });
          openNotification?.({
            type: "success",
            message: `Successfully deleted threshold for ${key}`,
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
            onClick={() => handleOpenThresholdAdd()}
            variant="contained"
          >
            Set
          </CreateButton>
        </Stack>

        <DataGrid
          loading={thresholdIsLoading}
          rows={(threshholds_data?.data || []) as readonly IThreshold[]}
          getRowId={(row) => row.threshold_id}
          columns={thresholdColumns}
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
        open={thresholdAddOpen}
        onClose={handleCloseThresholdAdd}
        PaperProps={{ sx: { minWidth: 500 } }}
      >
        <DialogTitle>Set Threshold</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setThresholdAddOpen(false)}
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
          <form onSubmit={handleSubmit(handleSubmitThresholdAdd)}>
            <Stack gap="10px" marginTop="10px">
              <FormControl>
                <Controller
                  control={control}
                  name="key"
                  defaultValue={null as any}
                  rules={{ required: "Please choose a key" }}
                  render={({ field }) => (
                    <Autocomplete
                      disablePortal
                      id="key_select"
                      options={(key_data?.data || []) as readonly any[]}
                      onChange={(_, value) => {
                        field.onChange(value?.ts_key);
                      }}
                      isOptionEqualToValue={(option, value) =>
                        value === undefined ||
                        option?.ts_key === (value?.ts_key ?? value)
                      }
                      getOptionLabel={(option) => option.ts_key}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Key"
                          margin="normal"
                          variant="outlined"
                          error={!!errors.key}
                          helperText={errors.key?.message}
                          required
                        />
                      )}
                    />
                  )}
                ></Controller>
              </FormControl>
              <FormControl sx={{ mb: 3 }}>
                <TextField
                  id="min_value"
                  {...register("threshold_min", {
                    required: "This field is required",
                    pattern: {
                      value: /^-?\d+(\.\d+)?$/,
                      message: "Please enter a valid number",
                    },
                  })}
                  error={!!errors.threshold_min}
                  helperText={errors.threshold_min?.message}
                  margin="normal"
                  fullWidth
                  label="Min Value"
                  name="threshold_min"
                  autoFocus
                />
                <FormControl sx={{ mb: 1 }}>
                  <TextField
                    id="max_value"
                    {...register("threshold_max", {
                      required: "This field is required",
                      pattern: {
                        value: /^-?\d+(\.\d+)?$/,
                        message: "Please enter a valid number",
                      },
                    })}
                    error={!!errors.threshold_max}
                    helperText={errors.threshold_max?.message}
                    margin="normal"
                    fullWidth
                    label="Max Value"
                    name="threshold_max"
                    autoFocus
                  />
                </FormControl>
              </FormControl>
            </Stack>
            <Button type="submit" variant="contained">
              Set
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ThresholdTable;
