import React from "react";
import TSLineChart from "./TSLineChart";
import { Button, Paper, Stack, Typography } from "@mui/material";

interface GreenhouseProps {
  asset_id: string;
  name: string;
}

const Greenhouse: React.FC<GreenhouseProps> = ({ asset_id, name }) => {
  return (
    <Paper sx={{ padding: "20px", my: "20px" }}>
      <Typography variant="h6">{name}</Typography>
      <Stack direction="row" sx={{ flex: 1, my: "20px", gap: "20px" }}>
        <TSLineChart
          asset_id={asset_id}
          color="#EBE76C"
          dataKey="temperature"
          dataUnit="°C"
        />
        <TSLineChart
          asset_id={asset_id}
          color="#F0B86E"
          dataKey="humidity"
          dataUnit="%"
        />
        <TSLineChart
          asset_id={asset_id}
          color="#836096"
          dataKey="light intensity"
          dataUnit="Lux"
        />
        <TSLineChart asset_id={asset_id} color="#ED7B7B" dataKey="pH" />
      </Stack>
      <Stack direction={"row"} sx={{ flex: 1, gap: "10px" }}>
        <Button variant="contained" sx={{ bgcolor: "#FF9843" }}>
          Thresholds
        </Button>
        <Button variant="contained" color="primary">
          Controls
        </Button>
        <Button variant="contained" color="info">
          Camera
        </Button>
      </Stack>
    </Paper>
  );
};

export default Greenhouse;
