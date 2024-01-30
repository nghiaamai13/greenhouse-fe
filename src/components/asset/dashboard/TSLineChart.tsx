import { Component, useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-luxon";
import StreamingPlugin from "chartjs-plugin-streaming";
import { Box, Stack, Typography } from "@mui/material";
import mqtt from "mqtt";
import { IThreshold, StreamProps } from "../../../interfaces";
import { MQTT_BROKER_ADDRESS, MQTT_WS_PORT } from "../../../constant";
import { useApiUrl, useCustom } from "@refinedev/core";

Chart.register(...registerables);
Chart.register(StreamingPlugin);

interface TSLineChartProps extends StreamProps {
  yMin?: number;
  yMax?: number;
  mqttData: { [key: string]: number };
}

export const TSLineChart: React.FC<TSLineChartProps> = ({
  asset_id,
  color,
  dataKey,
  dataUnit,
  yMin = 0,
  yMax = 100,
  mqttData,
}) => {
  const mqtt_topic = `assets/${asset_id}/telemetry`;
  const apiUrl = useApiUrl();
  const { data: dataKeyThreshold, isLoading: thresholdIsLoading } =
    useCustom<IThreshold>({
      url: `${apiUrl}/assets/${asset_id}/threshold/${dataKey}`,
      method: "get",
      queryOptions: {
        queryKey: [`${asset_id}_thresholds_${dataKey}`],
      },
    });

  //const [chartData, setChartData] = useState<{ x: number; y: any }[]>([]);

  const [chartData, setChartData] = useState<{ x: number; y: any }[]>([]);

  useEffect(() => {
    const newData =
      mqttData[dataKey] !== undefined
        ? { x: Date.now(), y: mqttData[dataKey] }
        : null;

    if (newData) {
      setChartData((prevData) => [...prevData, newData]);
    }
  }, [mqttData, dataKey]);

  // useEffect(() => {
  //   const client = mqtt.connect(
  //     `mqtt://${MQTT_BROKER_ADDRESS}:${MQTT_WS_PORT}`
  //   );

  //   client.on("connect", () => {
  //     console.log("Connected to MQTT broker");
  //     client.subscribe(mqtt_topic);
  //   });

  //   client.on("message", (topic, message) => {
  //     console.log(`Received message on topic ${topic}: ${message.toString()}`);
  //     const newData = {
  //       x: Date.now(),
  //       y: JSON.parse(message.toString())[dataKey],
  //     };
  //     setChartData((prevData) => [...prevData, newData]);
  //   });

  //   return () => {
  //     if (client.connected) {
  //       client.unsubscribe(mqtt_topic);
  //       client.end();
  //     }
  //   };
  // }, [mqtt_topic]);

  const getLineColor = () => {
    if (
      dataKeyThreshold?.data === undefined ||
      dataKeyThreshold?.data === null
    ) {
      return color;
    }
    const threshold: IThreshold = (dataKeyThreshold?.data ||
      undefined) as IThreshold;

    if (
      chartData.length > 0 &&
      (chartData[chartData.length - 1].y > threshold.threshold_max ||
        chartData[chartData.length - 1].y < threshold.threshold_min)
    ) {
      return "red";
    } else {
      return color;
    }
  };

  return (
    <Box sx={{ width: "100%", height: "auto", margin: 0 }}>
      <Line
        data={{
          datasets: [
            {
              label: !dataUnit ? dataKey : `${dataKey} (${dataUnit})`,
              borderColor: getLineColor(),
              fill: true,
              data: chartData,
            },
          ],
        }}
        options={{
          scales: {
            x: {
              type: "realtime",
              realtime: {
                delay: 2000,
              },
            },
            y: {
              min: yMin,
              max: yMax,
            },
          },
        }}
      />
      {dataKeyThreshold?.data !== undefined &&
      dataKeyThreshold?.data !== null ? (
        <Typography
          variant="subtitle2"
          textAlign={"center"}
          color={getLineColor()}
        >
          Max: {dataKeyThreshold?.data?.threshold_max}, Min:{" "}
          {dataKeyThreshold?.data?.threshold_min}, Latest Value:{" "}
          {mqttData[dataKey] ? mqttData[dataKey] : "N/A"}
        </Typography>
      ) : (
        <Typography
          variant="subtitle2"
          textAlign={"center"}
          color="text.secondary"
        >
          Threshold Unset, Latest Value:{" "}
          {mqttData[dataKey] ? mqttData[dataKey] : "N/A"}
        </Typography>
      )}
    </Box>
  );
};

export default TSLineChart;
