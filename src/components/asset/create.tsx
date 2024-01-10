import React from "react";
import { useApiUrl, HttpError } from "@refinedev/core";
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

import { IAssetCreate, IFarm, Nullable } from "../../interfaces";

export const assetTypeOptions = ["Outdoor Field", "Greenhouse"];

export const CreateAsset: React.FC<
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
                  <FormLabel required>Asset Name</FormLabel>
                  <OutlinedInput
                    id="name"
                    {...register("name", {
                      required: "Name is required",
                    })}
                    style={{ marginBottom: "10px" }}
                  />
                  {errors.name && (
                    <FormHelperText error>{errors.name.message}</FormHelperText>
                  )}
                </FormControl>
                <FormControl>
                  <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                      <Autocomplete
                        disablePortal
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
                <FormControl>
                  <Controller
                    control={control}
                    name="farm_id"
                    render={({ field }) => (
                      //@ts-ignore
                      <Autocomplete
                        disablePortal
                        id="farm_id"
                        {...autocompleteProps}
                        {...field}
                        onChange={(_, value) => {
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
                            variant="outlined"
                            error={!!errors.farm_id}
                            helperText={errors.farm_id?.message}
                          />
                        )}
                      />
                    )}
                  />
                  {errors.farm_id && (
                    <FormHelperText error>
                      {errors.farm_id.message}
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
