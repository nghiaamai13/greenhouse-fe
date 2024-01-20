import React from "react";
import { Box, Stack } from "@mui/material";
import { FarmListMap } from "../../components/dashboard";

export const DashboardPage: React.FC = () => {
  return (
    <Box sx={{ height: "800px", width: "1000px" }}>
      <FarmListMap />
    </Box>
  );
};
