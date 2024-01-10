import { Paper, Stack, Typography } from "@mui/material";
import React from "react";
import DateTimeCard from "./DateTimeCard";
import TSCard from "./TSCard";

interface OutdoorFieldProps {
  asset_id: string;
  name: string;
}

const OutdoorField: React.FC<OutdoorFieldProps> = ({ asset_id, name }) => {
  return (
    <Paper sx={{ padding: "20px", my: "20px" }}>
      <Typography variant="h6">{name}</Typography>
      <Stack direction={"row"} sx={{ flex: 1, gap: "20px" }}>
        <DateTimeCard />
        <TSCard />
        <TSCard />
        <TSCard />
      </Stack>
    </Paper>
  );
};

export default OutdoorField;
