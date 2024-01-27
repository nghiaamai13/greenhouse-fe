/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_MQTT_BROKER_ADDRESS: string;
  readonly VITE_MQTT_PORT: string;
  readonly VITE_MQTT_WS_PORT: string;
}
