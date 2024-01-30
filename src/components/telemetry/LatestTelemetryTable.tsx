import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DateField } from "@refinedev/mui";
import React, { useEffect } from "react";
import { ITelemetry } from "../../interfaces";
import { useApiUrl, useCustom, useNavigation } from "@refinedev/core";
import { Alert, Link, Typography } from "@mui/material";
import mqtt from "mqtt";
import { useQueryClient } from "@tanstack/react-query";
import { MQTT_BROKER_ADDRESS, MQTT_WS_PORT } from "../../constant";

interface LatestTelemetryTableProps {
  entity_type: string;
  entity_id: string;
}

const LatestTelemetryTable: React.FC<LatestTelemetryTableProps> = ({
  entity_id,
  entity_type,
}) => {
  const apiUrl = useApiUrl();
  const queryClient = useQueryClient();
  const { show } = useNavigation();

  const { data: telemetry_data, isLoading: telemetryIsLoading } =
    useCustom<ITelemetry>({
      url: `${apiUrl}/${entity_type}/${entity_id}/telemetry/latest`,
      method: "get",
      queryOptions: {
        queryKey: [`${entity_id}_latest_telemetry`],
      },
    });

  const telemetryColumns = React.useMemo<GridColDef<ITelemetry>[]>(() => {
    const commonColumns = [
      { field: "key", headerName: "Key", flex: 1, width: 200 },
      {
        field: "value",
        headerName: "Value",
        minWidth: 200,
      },
      {
        field: "timestamp",
        headerName: "Timestamp",
        flex: 1,
        renderCell: function render({ row }: { row: ITelemetry }) {
          return <DateField value={row.timestamp} format="LLL" />;
        },
      },
    ];

    const columns =
      entity_type === "devices"
        ? commonColumns
        : [
            ...commonColumns,
            {
              field: "device_name",
              headerName: "From Device",
              flex: 1,
              renderCell: function render({ row }: { row: ITelemetry }) {
                return (
                  <Link onClick={() => show("devices", row.device_id)}>
                    {row.device_name}
                  </Link>
                );
              },
            },
          ];

    return columns;
  }, [entity_type]);

  const mqtt_topic = `${entity_type}/${entity_id}/telemetry`;

  useEffect(() => {
    const client = mqtt.connect(
      `mqtt://${MQTT_BROKER_ADDRESS}:${MQTT_WS_PORT}`
    );

    client.on("connect", () => {
      client.subscribe(mqtt_topic);
    });

    client.on("message", (topic, message) => {
      console.log(`Received message on topic ${topic}: ${message.toString()}`);
      const newValue = JSON.parse(message.toString());
      if (newValue) {
        queryClient.invalidateQueries({
          queryKey: [`${entity_id}_latest_telemetry`],
        });
      } else {
        return;
      }
    });

    return () => {
      if (client.connected) {
        client.unsubscribe(mqtt_topic);
        client.end();
      }
    };
  }, [mqtt_topic]);

  return (
    <>
      <Typography
        variant="subtitle2"
        sx={{ mb: 2, fontWeight: "bold", fontSize: "18px" }}
      >
        Latest Telemetry Data
      </Typography>
      {entity_id == "" ? (
        <Alert severity="error">Failed to get entity id</Alert>
      ) : (
        <DataGrid
          loading={telemetryIsLoading}
          rows={(telemetry_data?.data || []) as readonly ITelemetry[]}
          getRowId={(row) => row.key}
          columns={telemetryColumns}
          autoHeight
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          density="standard"
          sx={{
            "& .MuiDataGrid-cell:hover": {
              cursor: "pointer",
            },
            width: "100%",
          }}
        />
      )}
    </>
  );
};

export default LatestTelemetryTable;
