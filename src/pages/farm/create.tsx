import React from "react";
import axios from "axios";
import { useTranslate, useApiUrl, HttpError } from "@refinedev/core";
import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { Create, useAutocomplete } from "@refinedev/mui";

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

export const CreateFarm: React.FC<
  UseModalFormReturnType<IFarm, HttpError, Nullable<IFarm>>
> = ({
  register,
  formState: { errors },
  refineCore: { onFinish },
  handleSubmit,
  modal: { visible, close },
  saveButtonProps,
  control,
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
      <Create
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
                  <FormLabel required>Farm Name</FormLabel>
                  <OutlinedInput
                    id="name"
                    {...register("name", {
                      required: "Name is required",
                    })}
                    style={{ height: "40px" }}
                  />
                  {errors.name && (
                    <FormHelperText error>{errors.name.message}</FormHelperText>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel required>Description</FormLabel>
                  <OutlinedInput
                    id="descriptions"
                    {...register("descriptions", {
                      required: "Description is required",
                    })}
                    multiline
                    minRows={5}
                    maxRows={5}
                  />
                  {errors.descriptions && (
                    <FormHelperText error>
                      {errors.descriptions.message}
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl>
                  <Controller
                    control={control}
                    name="customer"
                    render={({ field }) => (
                      //@ts-ignore
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
                  {errors.assigned_customer && (
                    <FormHelperText error>
                      {errors.assigned_customer.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Create>
    </Drawer>
  );
};
