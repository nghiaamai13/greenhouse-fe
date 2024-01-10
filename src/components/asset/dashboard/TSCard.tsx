import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const TSCard: React.FC = () => {
  const temperature = 25;

  return (
    <Card
      style={{
        height: "200px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom, #F2994A, #EB9532)",
        color: "white",
        transition: "background 0.3s ease",

        cursor: "pointer",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background =
          "linear-gradient(to bottom, #FF9843, #4682B4)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background =
          "linear-gradient(to bottom, #F2994A, #EB9532)")
      }
    >
      <CardContent>
        <Typography variant="h6" component="div">
          Temperature
        </Typography>
        <Typography
          variant="h5"
          component="div"
          style={{ marginTop: "10px", textAlign: "center" }}
        >
          {temperature}°C
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TSCard;
