import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const DateTimeCard: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (date: Date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    //@ts-ignore
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (date: Date) => {
    const options = { hour: "numeric", minute: "numeric", second: "numeric" };
    //@ts-ignore
    return date.toLocaleTimeString(undefined, options);
  };

  return (
    <Card
      style={{
        flexShrink: 0,
        height: "200px",
        maxWidth: "150px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "linear-gradient(to bottom, #87CEEB, #5F9EA0)",
        color: "gray",
        transition: "background 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background =
          "linear-gradient(to bottom, #63B8FF, #4682B4)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background =
          "linear-gradient(to bottom, #87CEEB, #5F9EA0)")
      }
    >
      <CardContent>
        <Typography variant="h6" fontWeight={"bold"} component="div">
          {formatDate(currentDateTime)}
        </Typography>
        <Typography
          variant="subtitle2"
          component={"div"}
          mt={5}
          color={"white"}
        >
          {formatTime(currentDateTime)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DateTimeCard;
