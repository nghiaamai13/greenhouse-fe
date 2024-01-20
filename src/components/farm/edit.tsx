import React from "react";
import axios from "axios";
import { useTranslate, useApiUrl, HttpError, useParsed } from "@refinedev/core";
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
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";

import CloseOutlined from "@mui/icons-material/CloseOutlined";

import { ICustomer, IFarm, Nullable } from "../../interfaces";
import LocationPicker from "./LocationPicker";

export const EditFarm: React.FC<
  UseModalFormReturnType<IFarm, HttpError, Nullable<IFarm>>
> = ({
  register,
  formState: { errors },
  refineCore: { onFinish },
  handleSubmit,
  modal: { visible, close },
  saveButtonProps,
  control,
  getValues,
  setValue,
}) => {
  const { autocompleteProps } = useAutocomplete<ICustomer>({
    resource: "customers",
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
                  />
                </FormControl>
                <FormControl>
                  <FormLabel required>Description</FormLabel>
                  <OutlinedInput
                    id="descriptions"
                    {...register("descriptions", {
                      required: "Description is required",
                    })}
                    multiline
                    minRows={3}
                    maxRows={5}
                  />
                </FormControl>
                <FormControl>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      {...register("location.0", {
                        required: "This field is required",
                        pattern: {
                          value: /^-?\d+(\.\d+)?$/,
                          message: "Please enter a valid number",
                        },
                      })}
                      defaultValue={getValues("location.0")}
                      error={!!errors.location?.[0]}
                      helperText={errors.location?.[0]?.message}
                      label="Latitude"
                      name="location.0"
                    />
                    <TextField
                      {...register("location.1", {
                        required: "This field is required",
                        pattern: {
                          value: /^-?\d+(\.\d+)?$/,
                          message: "Please enter a valid number",
                        },
                      })}
                      defaultValue={getValues("location.1")}
                      error={!!errors.location?.[1]}
                      helperText={errors.location?.[1]?.message}
                      label="Longitude"
                      name="location.1"
                    />
                  </Stack>
                  {errors.location && (
                    <FormHelperText error>
                      {errors.location.message}
                    </FormHelperText>
                  )}
                </FormControl>
                <LocationPicker
                  lat={getValues("location.0")}
                  lng={getValues("location.1")}
                  onChange={(newLocation) => {
                    setValue("location.0", newLocation.lat);
                    setValue("location.1", newLocation.lng);
                  }}
                />
                <FormControl>
                  <Controller
                    control={control}
                    name="customer"
                    defaultValue={null as any}
                    render={({ field }) => (
                      <Autocomplete
                        disablePortal
                        {...autocompleteProps}
                        {...field}
                        onChange={(_, value) => {
                          field.onChange(value);
                        }}
                        getOptionLabel={(item) => {
                          return item.username
                            ? item.username
                            : autocompleteProps?.options?.find(
                                (p) => p.user_id.toString() === item.toString()
                              )?.username ?? "";
                        }}
                        isOptionEqualToValue={(option, value) =>
                          value === undefined ||
                          option?.user_id === (value?.user_id ?? value)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Assign to customer"
                            variant="outlined"
                            error={!!errors.customer}
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
