import { HttpError } from "@refinedev/core";
import { BooleanField, SaveButton, useAutocomplete } from "@refinedev/mui";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import { UseModalFormReturnType } from "@refinedev/react-hook-form";

import { Controller } from "react-hook-form";

import {
  IDeviceCreate,
  IDeviceProfile,
  IFarm,
  Nullable,
} from "../../interfaces";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  OutlinedInput,
} from "@mui/material";

export const CreateDevice: React.FC<
  UseModalFormReturnType<IDeviceCreate, HttpError, Nullable<IDeviceCreate>>
> = ({
  saveButtonProps,
  handleSubmit,
  refineCore: { onFinish },
  modal: { visible, close, title },
  register,
  control,
  formState: { errors },
}) => {
  const { autocompleteProps: farmAutocompleteProps } = useAutocomplete<IFarm>({
    resource: "farms",
  });

  const { autocompleteProps: profileAutocompleteProps } =
    useAutocomplete<IDeviceProfile>({
      resource: "device_profiles",
    });

  return (
    <Dialog
      open={visible}
      onClose={close}
      PaperProps={{ sx: { minWidth: 500 } }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onFinish)}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <FormControl>
              <FormLabel required>Device Name</FormLabel>
              <OutlinedInput
                id="name"
                {...register("name", {
                  required: "Name is required",
                })}
                style={{ height: "50px", marginBottom: "10px" }}
              />
              {errors.name && (
                <FormHelperText error>{errors.name.message}</FormHelperText>
              )}
            </FormControl>
            <FormControl>
              <FormLabel>Label</FormLabel>
              <OutlinedInput
                id="label"
                {...register("label")}
                style={{ height: "50px", marginBottom: "10px" }}
              />
              {errors.label && (
                <FormHelperText error>{errors.label.message}</FormHelperText>
              )}
            </FormControl>
            <FormControl>
              <Controller
                control={control}
                name="farm_id"
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  //@ts-ignore
                  <Autocomplete
                    id="farm_id"
                    {...farmAutocompleteProps}
                    {...field}
                    onChange={(_, value) => {
                      console.log(value?.farm_id);
                      field.onChange(value?.farm_id);
                    }}
                    getOptionLabel={(item) => {
                      return item.name ? item.name : "";
                    }}
                    isOptionEqualToValue={(option, value) =>
                      value === undefined ||
                      option?.farm_id === (value?.farm_id ?? value)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Farm"
                        margin="normal"
                        variant="outlined"
                        error={!!errors.farm_id}
                        helperText={errors.farm_id?.message}
                      />
                    )}
                  />
                )}
              />
            </FormControl>
            <FormControl>
              <Controller
                control={control}
                name="device_profile_id"
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  //@ts-ignore
                  <Autocomplete
                    id="device_profile_id"
                    {...profileAutocompleteProps}
                    {...field}
                    onChange={(_, value) => {
                      console.log(value?.profile_id);
                      field.onChange(value?.profile_id);
                    }}
                    getOptionLabel={(item) => {
                      return item.name ? item.name : "";
                    }}
                    isOptionEqualToValue={(option, value) =>
                      value === undefined ||
                      option?.profile_id === (value?.profile_id ?? value)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Device Profile"
                        margin="normal"
                        variant="outlined"
                        error={!!errors.device_profile_id}
                        helperText={errors.device_profile_id?.message}
                      />
                    )}
                  />
                )}
              />
            </FormControl>
            <FormControl>
              <FormControlLabel
                control={
                  <Checkbox id="is_gateway" {...register("is_gateway")} />
                }
                label="Is Gateway"
              />
            </FormControl>
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Cancel</Button>
        <SaveButton {...saveButtonProps} />
      </DialogActions>
    </Dialog>
  );
};
