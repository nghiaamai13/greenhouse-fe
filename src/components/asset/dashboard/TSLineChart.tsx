import { Component, useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-luxon";
import StreamingPlugin from "chartjs-plugin-streaming";
import { Box, Stack } from "@mui/material";
import mqtt from "mqtt";

Chart.register(...registerables);
Chart.register(StreamingPlugin);

interface StreamProps {
  color: string;
  dataKey: string;
  dataUnit?: string;
  asset_id: string;
}
const MQTT_BROKER_ADDRESS = "mqtt://127.0.0.1:8080";

export const TSLineChart: React.FC<StreamProps> = ({
  asset_id,
  color,
  dataKey,
  dataUnit,
}) => {
  const mqtt_topic = `asset/${asset_id}/telemetry`;

  const [chartData, setChartData] = useState<{ x: number; y: any }[]>([]);

  useEffect(() => {
    const client = mqtt.connect(MQTT_BROKER_ADDRESS);

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe(mqtt_topic);
    });

    client.on("message", (topic, message) => {
      console.log(`Received message on topic ${topic}: ${message.toString()}`);
      const newData = {
        x: Date.now(),
        y: JSON.parse(message.toString())[dataKey],
      };
      setChartData((prevData) => [...prevData, newData]);
    });

    return () => {
      if (client.connected) {
        client.unsubscribe(mqtt_topic);
        client.end();
      }
    };
  }, [mqtt_topic]);

  return (
    <Box sx={{ width: "25%", height: "auto", margin: 0 }}>
      <Line
        data={{
          datasets: [
            {
              label: !dataUnit ? dataKey : `${dataKey} (${dataUnit})`,
              borderColor: color,
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
          },
        }}
      />
    </Box>
  );
};

export default TSLineChart;