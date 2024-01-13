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
        <TSCard
          dataKey="temperature"
          dataUnit="°C"
          asset_id={asset_id}
          color="#EBE76C"
        />
        <TSCard
          dataKey="humidity"
          dataUnit="%"
          asset_id={asset_id}
          color="#AEFEBC"
        />
        <TSCard dataKey="AQI" asset_id={asset_id} color="#FFC6FF" />
        <TSCard
          dataKey="Rain"
          asset_id={asset_id}
          color="#FF0F"
          dataUnit="mm"
        />
      </Stack>
    </Paper>
  );
};

export default OutdoorField;
