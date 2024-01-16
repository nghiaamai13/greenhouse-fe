import {
  Autocomplete,
  Button,
  FormControl,
  IconButton,
  Stack,
  TextField,
  Box,
  Dialog,
  DialogTitle,
} from "@mui/material";
import {
  HttpError,
  useApiUrl,
  useCustom,
  useNotification,
} from "@refinedev/core";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IDevice, IDeviceControl, Nullable } from "../../../interfaces";
import { Close, FormatAlignLeft } from "@mui/icons-material";
import { MQTT_BROKER_ADDRESS, MQTT_WS_PORT } from "../../../constant";
import mqtt from "mqtt";

interface GreenhouseControlDialogProps {
  asset_id: string;
  open: boolean;
  onClose: () => void;
}
const GreenhouseControlDialog: React.FC<GreenhouseControlDialogProps> = ({
  asset_id,
  open,
  onClose,
}) => {
  const apiUrl = useApiUrl();
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm<IDeviceControl, HttpError, Nullable<IDeviceControl>>();

  const { data: assetDeviceData, isLoading: keyIsLoading } = useCustom({
    url: `${apiUrl}/assets/${asset_id}/devices`,
    method: "get",
  });

  const { open: openNotification } = useNotification();
  const handleSendControl = (data: any) => {
    const client = mqtt.connect(
      `mqtt://${MQTT_BROKER_ADDRESS}:${MQTT_WS_PORT}`
    );

    const controlTopic = `devices/${data.device_id}/control`;
    client.subscribe(controlTopic);

    client.publish(controlTopic, data.json_data);

    client.unsubscribe(controlTopic);
    client.end();
    reset();

    onClose();
    openNotification?.({
      type: "success",
      message: "Control sent successfully",
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { minWidth: "500px" } }}
    >
      <DialogTitle fontWeight={700}>Controls</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <Close />
      </IconButton>
      <Box p={3}>
        <form onSubmit={handleSubmit(handleSendControl)}>
          <Stack gap="10px">
            <FormControl>
              <Controller
                control={control}
                name="device_id"
                defaultValue={null as any}
                rules={{ required: "Please choose a device to control" }}
                render={({ field }) => (
                  <Autocomplete
                    disablePortal
                    id="device_select"
                    options={
                      (assetDeviceData?.data || []) as readonly IDevice[]
                    }
                    onChange={(_, value) => {
                      field.onChange(value?.device_id);
                    }}
                    isOptionEqualToValue={(option, value) =>
                      value === undefined ||
                      option?.device_id === (value?.device_id ?? value)
                    }
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Device"
                        margin="normal"
                        variant="outlined"
                        error={!!errors.device_id}
                        helperText={errors.device_id?.message}
                        required
                      />
                    )}
                  />
                )}
              ></Controller>
            </FormControl>
            <FormControl sx={{ mb: 2 }}>
              <Controller
                name="json_data"
                control={control}
                defaultValue=""
                rules={{
                  validate: (value) => {
                    try {
                      JSON.parse(value);
                      return true;
                    } catch (error) {
                      return "Invalid JSON format";
                    }
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    {...register("json_data", {
                      required: "This field is required",
                    })}
                    error={!!errors.json_data}
                    helperText={errors.json_data?.message}
                    multiline
                    rows={8}
                    margin="normal"
                    fullWidth
                    label="JSON Data"
                    autoFocus
                    required
                    InputProps={{
                      endAdornment: (
                        <Stack
                          direction={"row"}
                          sx={{
                            flex: 1,
                            position: "absolute",
                            m: "7px",
                            top: 0,
                            right: 0,
                          }}
                        >
                          <IconButton
                            onClick={() => {
                              const prettifiedJson = JSON.stringify(
                                JSON.parse(field.value),
                                null,
                                2
                              );
                              setValue("json_data", prettifiedJson);
                            }}
                          >
                            <FormatAlignLeft />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              setValue("json_data", "");
                            }}
                          >
                            <Close />
                          </IconButton>
                        </Stack>
                      ),
                    }}
                  />
                )}
              />
            </FormControl>
            <Button type="submit" variant="contained">
              Send
            </Button>
          </Stack>
        </form>
      </Box>
    </Dialog>
  );
};

export default GreenhouseControlDialog;
