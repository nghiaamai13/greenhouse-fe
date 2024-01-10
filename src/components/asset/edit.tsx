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

import { IAssetCreate, IFarm, Nullable } from "../../interfaces";
import { assetTypeOptions } from "./create";

export const EditAsset: React.FC<
  UseModalFormReturnType<IAssetCreate, HttpError, Nullable<IAssetCreate>>
> = ({
  register,
  formState: { errors },
  refineCore: { onFinish },
  handleSubmit,
  modal: { visible, close },
  saveButtonProps,
  control,
}) => {
  const { autocompleteProps } = useAutocomplete<IFarm>({
    resource: "farms",
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
                  <Controller
                    control={control}
                    name="farm_id"
                    rules={{ required: "This field is required" }}
                    defaultValue={null as any}
                    render={({ field }) => (
                      //@ts-ignore
                      <Autocomplete
                        disablePortal
                        {...autocompleteProps}
                        {...field}
                        onChange={(_, value) => {
                          field.onChange(value?.farm_id);
                        }}
                        getOptionLabel={(item) => {
                          return item.name
                            ? item.name
                            : autocompleteProps?.options?.find(
                                (p) => p.farm_id.toString() === item.toString()
                              )?.name ?? "";
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
                    name="type"
                    rules={{ required: "This field is required" }}
                    defaultValue={null as any}
                    render={({ field }) => (
                      <Autocomplete
                        disablePortal
                        getOptionLabel={(item) => {
                          return item ? item : "";
                        }}
                        options={assetTypeOptions}
                        {...field}
                        onChange={(_, value) => {
                          field.onChange(value);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Asset Type"
                            variant="outlined"
                            style={{ marginBottom: "10px" }}
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
