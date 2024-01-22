import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useApiUrl, useNavigation } from "@refinedev/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { CustomTooltip } from "../../customTooltip";

interface StatsCardProps {
  entity_type: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ entity_type }) => {
  const title = `Total ${
    entity_type.charAt(0).toUpperCase() + entity_type.slice(1)
  }`;

  const [total, setTotal] = useState(null);
  const [tooltipTitle, setTooltipTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { list } = useNavigation();

  const apiUrl = useApiUrl();
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchData = async () => {
      // Check if entity_type is valid
      if (["farms", "assets", "devices"].includes(entity_type)) {
        setTooltipTitle(`View your ${entity_type}`);
        try {
          const accessToken = localStorage.getItem("access_token");
          const response = await axios.get(`${apiUrl}/${entity_type}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const totalCountHeader = response.headers["x-total-count"];

          setTotal(totalCountHeader);
          console.log(`Total Count for ${entity_type}:`, totalCountHeader);
        } catch (error) {
          console.error(`Error fetching ${entity_type}:`, error);
        } finally {
          setIsLoading(false);
        }
      } else if (entity_type === "messages") {
        setTooltipTitle("Total Device Messages");
        try {
          const response = await axios.get(`${apiUrl}/telemetry/count`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          setTotal(response.data);
        } catch (error) {
          console.error(`Error fetching ${entity_type}:`, error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.error(`Invalid entity_type: ${entity_type}`);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [entity_type]);

  return (
    <CustomTooltip title={tooltipTitle}>
      <Box
        onClick={() => {
          if (entity_type === "messages") {
            list("devices");
          } else {
            list(entity_type);
          }
        }}
      >
        <Card
          sx={{
            borderRadius: 2,
            ":hover": {
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
            },
            "& pre": {
              m: 0,
              p: "16px !important",
              fontSize: "0.75rem",
            },
          }}
        >
          <CardHeader
            title={title}
            titleTypographyProps={{
              variant: "subtitle1",
              color: "text.secondary",
            }}
            sx={{
              p: 2.5,
              "& .MuiCardHeader-action": { m: "0px auto", alignSelf: "center" },
            }}
          ></CardHeader>
          <CardContent>
            {isLoading ? (
              <CircularProgress size={20} />
            ) : (
              <Typography variant="h5" fontWeight={700} color="inherit">
                {total}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </CustomTooltip>
  );
};
