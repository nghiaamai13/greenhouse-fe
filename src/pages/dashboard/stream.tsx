import { Component } from "react";
import { Chart, registerables } from "chart.js";

import { Line } from "react-chartjs-2";
import "chartjs-adapter-luxon";
import StreamingPlugin from "chartjs-plugin-streaming";

Chart.register(...registerables);
Chart.register(StreamingPlugin);
export const Stream: React.FC = () => {
  return (
    <Line
      data={{
        datasets: [
          {
            label: "Humidity",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            borderColor: "rgb(255, 99, 132)",
            fill: true,
            data: [],
          },
        ],
      }}
      options={{
        scales: {
          x: {
            type: "realtime",
            realtime: {
              delay: 2000,
              onRefresh: (chart) => {
                chart.data.datasets.forEach((dataset) => {
                  dataset.data.push({
                    x: Date.now(),
                    y: Math.floor(Math.random() * (100 - 40 + 1)) + 40,
                  });
                });
              },
            },
          },
        },
      }}
    />
  );
};

export default Stream;
