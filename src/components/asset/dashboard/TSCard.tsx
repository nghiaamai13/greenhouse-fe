import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { StreamProps } from "../../../interfaces";
import { darken } from "@mui/material";
import mqtt from "mqtt";
import moment from "moment";
import { Box } from "@mui/system";

const TSCard: React.FC<
  StreamProps & { cardValue: number | null; lastUpdated: moment.Moment | null }
> = ({ dataKey, dataUnit, color, cardValue, lastUpdated }) => {
  const [formattedLastUpdated, setFormattedLastUpdated] = useState<
    string | null
  >(lastUpdated?.fromNow() || "Not Updated");

  // Update the last updated time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setFormattedLastUpdated(lastUpdated?.fromNow() || "Not Updated");
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [lastUpdated]);

  return (
    <Card
      style={{
        flexShrink: 0,
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
            {dataKey.charAt(0).toUpperCase() +
              dataKey.slice(1).replace("_", " ")}
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
            {formattedLastUpdated}
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
