import React from "react";
import { HttpError } from "@refinedev/core";
import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { Edit, useAutocomplete } from "@refinedev/mui";

import Drawer from "@mui/material/Drawer";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import OutlinedInput from "@mui/material/OutlinedInput";
import TextField from "@mui/material/TextField";

import CloseOutlined from "@mui/icons-material/CloseOutlined";

import {
  IAsset,
  IDeviceCreate,
  IDeviceProfile,
  Nullable,
} from "../../interfaces";

export const EditDevice: React.FC<
  UseModalFormReturnType<IDeviceCreate, HttpError, Nullable<IDeviceCreate>>
> = ({
  register,
  formState: { errors },
  refineCore: { onFinish },
  handleSubmit,
  modal: { visible, close },
  saveButtonProps,
  control,
}) => {
  const { autocompleteProps: assetAutocompleteProps } = useAutocomplete<IAsset>(
    {
      resource: "assets",
    }
  );

  const { autocompleteProps: dpAutocompleteProps } =
    useAutocomplete<IDeviceProfile>({
      resource: "device_profiles",
    });

  return (
    <Drawer
      sx={{ zIndex: "1301" }}
      PaperProps={{ sx: { width: { sm: "100%", md: 500 } } }}
      open={visible}
      onClose={close}
      anchor="right"
    >
      <Edit
        saveButtonProps={saveButtonProps}
        headerProps={{
          avatar: (
            <IconButton
              onClick={() => close()}
              sx={{
                width: "30px",
                height: "30px",
                mb: "5px",
              }}
            >
              <CloseOutlined />
            </IconButton>
          ),
          action: null,
        }}
        wrapperProps={{ sx: { overflowY: "scroll", height: "100vh" } }}
      >
        <Stack>
          <Box
            paddingX="50px"
            justifyContent="center"
            alignItems="center"
            sx={{
              paddingX: {
                xs: 1,
                md: 6,
              },
            }}
          >
            <form onSubmit={handleSubmit(onFinish)}>
              <Stack gap="10px" marginTop="10px">
                <FormControl>
                  <FormLabel required>Farm</FormLabel>
                  <OutlinedInput
                    id="name"
                    {...register("name", {
                      required: "Name is required",
                    })}
                    style={{ height: "40px" }}
                    error={!!errors.name}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel required>Label</FormLabel>
                  <OutlinedInput
                    id="label"
                    {...register("label", {
                      required: "Label is required",
                    })}
                    error={!!errors.label}
                  />
                </FormControl>
                <FormControl>
                  <Controller
                    control={control}
                    name="asset_id"
                    rules={{ required: "This field is required" }}
                    defaultValue={null as any}
                    render={({ field }) => (
                      //@ts-ignore
                      <Autocomplete
                        disablePortal
                        {...assetAutocompleteProps}
                        {...field}
                        onChange={(_, value) => {
                          field.onChange(value?.asset_id);
                        }}
                        getOptionLabel={(item) => {
                          if (item.name && item.farm) {
                            return `${item.name} (${item.farm.name})`;
                          } else {
                            let asset = assetAutocompleteProps?.options?.find(
                              (p) => p.asset_id.toString() === item.toString()
                            );
                            if (asset) {
                              return `${asset.name} (${asset.farm.name})`;
                            }
                            return "";
                          }
                        }}
                        isOptionEqualToValue={(option, value) =>
                          value === undefined ||
                          option?.asset_id === (value?.asset_id ?? value)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Asset"
                            margin="normal"
                            variant="outlined"
                            error={!!errors.asset_id}
                            helperText={errors.asset_id?.message}
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
                    defaultValue={null as any}
                    render={({ field }) => (
                      //@ts-ignore
                      <Autocomplete
                        disablePortal
                        {...dpAutocompleteProps}
                        {...field}
                        onChange={(_, value) => {
                          field.onChange(value?.profile_id);
                        }}
                        getOptionLabel={(item) => {
                          return item.name
                            ? item.name
                            : dpAutocompleteProps?.options?.find(
                                (p) =>
                                  p.profile_id.toString() === item.toString()
                              )?.name ?? "";
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
                          />
                        )}
                      />
                    )}
                  />
                </FormControl>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Edit>
    </Drawer>
  );
};
