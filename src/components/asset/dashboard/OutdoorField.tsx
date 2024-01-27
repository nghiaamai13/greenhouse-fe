import { Link, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import DateTimeCard from "./DateTimeCard";
import TSCard from "./TSCard";
import { useNavigation } from "@refinedev/core";

interface OutdoorFieldProps {
  asset_id: string;
  name: string;
}

const OutdoorField: React.FC<OutdoorFieldProps> = ({ asset_id, name }) => {
  const { show } = useNavigation();

  return (
    <Paper sx={{ padding: "20px", my: "20px" }}>
      <Link
        onClick={() => show("assets", asset_id)}
        sx={{ cursor: "pointer", ":hover": { color: "#7FC7D9" } }}
        color={"inherit"}
        underline="none"
      >
        <Typography variant="h6">{name}</Typography>
      </Link>
      <Stack
        direction={"row"}
        sx={{
          flex: 1,
          gap: "20px",
          overflowX: "auto",
          flexWrap: "nowrap",
          maxWidth: "100vw",
        }}
      >
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
        <TSCard dataKey="pH" asset_id={asset_id} color="#F0B86E" />
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
