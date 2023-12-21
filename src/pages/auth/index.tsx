import * as React from "react";
import { AuthPage as MUIAuthPage, AuthProps } from "@refinedev/mui";
import { Link } from "react-router-dom";
import { useLogin } from "@refinedev/core";
import { Box, Container, TextField, Typography, Button } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

const authWrapperProps = {
  style: {
    background:
      "radial-gradient(50% 50% at 50% 50%,rgba(255, 255, 255, 0) 0%,rgba(0, 0, 0, 0.5) 100%),url('https://source.unsplash.com/random')",
    backgroundSize: "cover",
  },
};

type LoginVariables = {
  username: string;
  password: string;
};

export const Login = () => {
  const { mutate: login } = useLogin<LoginVariables>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const values = {
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value,
    };

    login(values);
  };

  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url('../../assets/login_bg.jpg')",
        backgroundSize: "cover",
      }}
    >
      <Container
        component="div"
        maxWidth="xs"
        sx={{
          mb: "100px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            mt: 8,
            p: 4,
            background:
              "radial-gradient(50% 50% at 50% 50%,rgba(255, 255, 255, 0) 0%,rgba(0, 0, 0, 0.5) 100%)",
            backgroundSize: "cover",
            backgroundColor: "rgba(255, 255, 255, 0)",
            borderRadius: 8,
            boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
          }}
        >
          <LockIcon sx={{ fontSize: 40, color: "#4CAF50" }} />
          <Typography
            component="h1"
            variant="h5"
            sx={{ mt: 2, color: "#4CAF50" }}
          >
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 2 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              variant="filled"
              sx={{ input: { color: "white" } }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              variant="filled"
              sx={{ input: { color: "white" } }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
              }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </Container>
  );
};
