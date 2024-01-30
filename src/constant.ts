export const MQTT_BROKER_ADDRESS =
  import.meta.env.VITE_MQTT_BROKER_ADDRESS || "127.0.0.1";
export const MQTT_PORT = import.meta.env.VITE_MQTT_PORT || "1883";
export const MQTT_WS_PORT = import.meta.env.VITE_MQTT_WS_PORT || "8080";
export const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export const tsDataConfig =
  [
    {
      dataKey: "temperature",
      color: "#EBE76C",
      dataUnit: "°C",
      yMin: 0,
      yMax: 100,
    },
    {
      dataKey: "humidity",
      color: "#F0B86E",
      dataUnit: "%",
      yMin: 0,
      yMax: 100,
    },
    {
      dataKey: "light_intensity",
      color: "#FFD0EC",
      dataUnit: "Lux",
      yMin: 100,
      yMax: 1000,
    },
    {
      dataKey: "pH",
      color: "#E1F0DA",
      yMin: 0.0,
      yMax: 10.0,
    },
    { dataKey: "AQI", color: "#33FF57" },
    // { dataKey: "dataKey6", color: "#5733FF", dataUnit: "Unit6" },
    // { dataKey: "dataKey7", color: "#FF33B8", dataUnit: "Unit7" },
    // { dataKey: "dataKey8", color: "#33B8FF", dataUnit: "Unit8" },
    // { dataKey: "dataKey8", color: "#33B8AA", dataUnit: "Unit9" },
  ] || [];
