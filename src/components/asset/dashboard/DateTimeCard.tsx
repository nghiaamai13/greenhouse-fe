import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const DateTimeCard: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Update currentDateTime every second
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Cleanup the interval on component unmount
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
        height: "200px",
        maxWidth: "150px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "linear-gradient(to bottom, #87CEEB, #5F9EA0)",
        color: "white",
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
        <Typography variant="h5" component="div">
          {formatDate(currentDateTime)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatTime(currentDateTime)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DateTimeCard;