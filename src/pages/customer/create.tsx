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

import { ICustomerCreate, Nullable } from "../../interfaces";

export const CreateCustomer: React.FC<
  UseModalFormReturnType<ICustomerCreate, HttpError, Nullable<ICustomerCreate>>
> = ({
  register,
  formState: { errors },
  refineCore: { onFinish },
  handleSubmit,
  modal: { visible, close },
  saveButtonProps,
}) => {
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
                  <FormLabel required>Customer</FormLabel>
                  <OutlinedInput
                    id="username"
                    {...register("username", {
                      required: "Username is required",
                    })}
                    style={{ height: "40px" }}
                  />
                  {errors.username && (
                    <FormHelperText error>
                      {errors.username.message}
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel required>Password</FormLabel>
                  <OutlinedInput
                    id="password"
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    style={{ height: "40px" }}
                  />
                  {errors.password && (
                    <FormHelperText error>
                      {errors.password.message}
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
