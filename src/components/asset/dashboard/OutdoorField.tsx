import { Box, Link, Paper, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import DateTimeCard from "./DateTimeCard";
import TSCard from "./TSCard";
import { useApiUrl, useCustom, useNavigation } from "@refinedev/core";
import mqtt from "mqtt";
import { MQTT_BROKER_ADDRESS, MQTT_WS_PORT } from "../../../constant";
import moment from "moment";
import { useQueryClient } from "@tanstack/react-query";
import { ITelemetry, TSKey } from "../../../interfaces";
import { tsDataConfig as dataConfig } from "../../../constant";

interface OutdoorFieldProps {
  asset_id: string;
  name: string;
}

const OutdoorField: React.FC<OutdoorFieldProps> = ({ asset_id, name }) => {
  const { show } = useNavigation();
  const apiUrl = useApiUrl();
  const queryClient = useQueryClient();

  const { data: telemetry_data, isLoading: telemetryIsLoading } = useCustom<
    ITelemetry[]
  >({
    url: `${apiUrl}/assets/${asset_id}/telemetry/latest`,
    method: "get",
    queryOptions: {
      queryKey: [`field_${asset_id}_latest_telemetry`],
    },
  });

  const keys: string[] = [];

  telemetry_data?.data.forEach((data) => {
    keys.push(data.key);
  });

  const mqtt_topic = `assets/${asset_id}/telemetry`;

  useEffect(() => {
    const client = mqtt.connect(
      `mqtt://${MQTT_BROKER_ADDRESS}:${MQTT_WS_PORT}`
    );

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe(mqtt_topic);
    });

    client.on("message", (topic, message) => {
      queryClient.invalidateQueries({
        queryKey: [`field_${asset_id}_latest_telemetry`],
      });
    });

    return () => {
      if (client.connected) {
        client.unsubscribe(mqtt_topic);
        client.end();
      }
    };
  }, [mqtt_topic]);

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
        {keys.length === 0 && (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              direction: "column",
            }}
          >
            <Typography variant="body1" color={"text.secondary"}>
              Start sending data to activate timeseries cards
            </Typography>
          </Box>
        )}
        {dataConfig
          .filter((data) => keys.includes(data.dataKey))
          .map((data, index) => {
            const telemetryItem = telemetry_data?.data.find(
              (item) => item.key === data.dataKey
            );

            return (
              <TSCard
                key={index}
                dataKey={data.dataKey}
                dataUnit={data.dataUnit || ""}
                asset_id={asset_id}
                color={data.color}
                cardValue={telemetryItem?.value || null}
                lastUpdated={
                  telemetryItem?.timestamp
                    ? moment(telemetryItem.timestamp)
                    : null
                }
              />
            );
          })}
      </Stack>
    </Paper>
  );
};

export default OutdoorField;
