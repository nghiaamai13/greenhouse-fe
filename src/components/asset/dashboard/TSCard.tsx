import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { StreamProps } from "../../../interfaces";
import { darken } from "@mui/material";
import mqtt from "mqtt";
import moment from "moment";
import { Box } from "@mui/system";
import { MQTT_BROKER_ADDRESS, MQTT_WS_PORT } from "../../../constant";

const TSCard: React.FC<StreamProps> = ({
  asset_id,
  dataKey,
  dataUnit,
  color,
}) => {
  const mqtt_topic = `assets/${asset_id}/telemetry`;
  const [cardValue, setCardValue] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<moment.Moment | null>(null);

  useEffect(() => {
    const client = mqtt.connect(
      `mqtt://${MQTT_BROKER_ADDRESS}:${MQTT_WS_PORT}`
    );

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe(mqtt_topic);
    });

    client.on("message", (topic, message) => {
      console.log(`Received message on topic ${topic}: ${message.toString()}`);
      const newValue = JSON.parse(message.toString())[dataKey];
      if (newValue) {
        setCardValue(newValue);
        setLastUpdated(moment());
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
    <Card
      style={{
        width: "150px",
        height: "200px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: color,
        color: "gray",
        cursor: "pointer",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = darken(color, 0.2))
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = color)}
    >
      <CardContent
        sx={{
          textAlign: "center",
          flex: 1,
          flexDirection: "column",
        }}
      >
        <Box mb={5}>
          <Typography variant="h6" component="div" fontWeight={"bold"}>
            {dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}
          </Typography>
          {cardValue === null ? (
            <Typography mt={"20px"}>No Data</Typography>
          ) : (
            <Typography
              variant="h6"
              component="div"
              style={{ marginTop: "10px", textAlign: "center" }}
            >
              {cardValue} {dataUnit}
            </Typography>
          )}
        </Box>

        {lastUpdated ? (
          <Typography variant="subtitle2" component="div" mt={"auto"}>
            Last Updated <br />
            {lastUpdated.fromNow()}
          </Typography>
        ) : (
          <Typography variant="subtitle2" component="div" mt={"auto"}>
            Not Updated
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default TSCard;
