import React, { useEffect, useState } from "react";
import TSLineChart from "./TSLineChart";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Grid,
  IconButton,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ThresholdTable from "./ThresholdTable";
import CloseIcon from "@mui/icons-material/Close";
import GreenhouseControlDialog from "./GreenhouseControl";
import { CustomTooltip } from "../../customTooltip";
import {
  useApiUrl,
  useCustom,
  useCustomMutation,
  useNavigation,
  useNotification,
} from "@refinedev/core";
import mqtt from "mqtt";
import { MQTT_BROKER_ADDRESS, MQTT_WS_PORT } from "../../../constant";
import { TSKey } from "../../../interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { tsDataConfig as dataConfig } from "../../../constant";

interface GreenhouseProps {
  asset_id: string;
  name: string;
}

const Greenhouse: React.FC<GreenhouseProps> = ({ asset_id, name }) => {
  const { show } = useNavigation();
  const [thresholdDialogOpen, setThresholdDialogOpen] = useState(false);
  const [controlDialogOpen, setControlDialogOpen] = useState(false);
  const [cameraDialogOpen, setCameraDialogOpen] = useState(false);
  const [keyDialogOpen, setKeyDialogOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const queryClient = useQueryClient();
  const apiUrl = useApiUrl();

  const mqtt_topic = `assets/${asset_id}/telemetry`;
  const [mqttData, setMqttData] = useState<{ [dataKey: string]: number }>({});
  const { data: keyData, isLoading: keyIsLoading } = useCustom<TSKey[]>({
    url: `${apiUrl}/assets/${asset_id}/keys`,
    method: "get",
    queryOptions: {
      queryKey: [`${asset_id}_chart_keys`],
    },
  });

  const keys: string[] = keyData?.data.map((data) => data.ts_key) || [];

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
      const receivedData = JSON.parse(message.toString());
      const newKeys = Object.keys(receivedData).filter(
        (key) => !keys.includes(key)
      );
      if (newKeys.length > 0) {
        queryClient.invalidateQueries({
          queryKey: [`${asset_id}_chart_keys`],
        });
      }
      setMqttData(receivedData);
    });

    return () => {
      if (client.connected) {
        client.unsubscribe(mqtt_topic);
        client.end();
      }
    };
  }, [mqtt_topic]);

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const totalCharts = keys.length;
  const filteredDataConfig = dataConfig.filter((config) =>
    keys.includes(config.dataKey)
  );
  const chartsToRender = expanded
    ? filteredDataConfig
    : filteredDataConfig.slice(0, 4);

  const { mutate: mutateDeleteKey } = useCustomMutation<TSKey>();
  const { open: openNotification } = useNotification();

  const handleDeleteKey = (data: TSKey) => {
    const ts_key = data.ts_key;
    mutateDeleteKey(
      {
        values: "",
        url: `${apiUrl}/assets/${asset_id}/keys/${data.ts_key}`,
        method: "delete",
      },
      {
        onError: (error, variables, context) => {
          console.log("Error Deleting Threshold: ", error);
        },
        onSuccess: (data, variables, context) => {
          queryClient.invalidateQueries({
            queryKey: [`${asset_id}_chart_keys`],
          });
          openNotification?.({
            type: "success",
            message: `Successfully deleted key: ${ts_key}`,
          });
        },
      }
    );
  };

  const keyColumns = React.useMemo<GridColDef<TSKey>[]>(
    () => [
      {
        field: "ts_key",
        headerName: "Key",
        flex: 1,
      },
      {
        field: "actions",
        headerName: "Action",
        type: "actions",
        getActions: function render({ row }) {
          return [
            <IconButton onClick={() => handleDeleteKey(row)}>
              <Delete />
            </IconButton>,
          ];
        },
      },
    ],
    []
  );

  return (
    <Stack>
      <Paper sx={{ padding: "20px", my: "20px" }}>
        <Link
          onClick={() => show("assets", asset_id)}
          sx={{ cursor: "pointer", ":hover": { color: "primary.main" } }}
          underline="none"
          color={"inherit"}
        >
          <Typography variant="h6">{name}</Typography>
        </Link>
        {chartsToRender.length === 0 && (
          <Typography variant="subtitle1" mb={3}>
            Start sending data to see line charts
          </Typography>
        )}
        <Grid container spacing={2} columns={16}>
          {chartsToRender.map((data, index) => (
            <Grid
              item
              key={index}
              xs={16}
              md={8}
              lg={4}
              style={{ display: "block" }}
            >
              <TSLineChart
                key={index}
                asset_id={asset_id}
                color={data.color}
                dataKey={data.dataKey}
                dataUnit={data.dataUnit || ""}
                yMin={data.yMin || 0}
                yMax={data.yMax || 100}
                mqttData={mqttData}
              />
            </Grid>
          ))}
        </Grid>

        {totalCharts > 4 && (
          <Stack direction="row" justifyContent="flex-end">
            <IconButton onClick={handleToggleExpand} color="primary">
              {expanded ? (
                <CustomTooltip title="Show Less">
                  <ExpandLessIcon />
                </CustomTooltip>
              ) : (
                <CustomTooltip title="Show More">
                  <ExpandMoreIcon />
                </CustomTooltip>
              )}
            </IconButton>
          </Stack>
        )}

        <Stack direction={"row"} sx={{ flex: 1, gap: "10px" }}>
          <CustomTooltip title="Set Thresholds">
            <Button
              variant="contained"
              sx={{ bgcolor: "#FF9843" }}
              onClick={() => setThresholdDialogOpen(true)}
            >
              Thresholds
            </Button>
          </CustomTooltip>
          <CustomTooltip title="Keys">
            <Button
              variant="contained"
              sx={{ bgcolor: "#96E9C6" }}
              onClick={() => setKeyDialogOpen(true)}
            >
              Keys
            </Button>
          </CustomTooltip>
          <CustomTooltip title="Send Control Command">
            <Button
              variant="contained"
              color="primary"
              onClick={() => setControlDialogOpen(true)}
            >
              Controls
            </Button>
          </CustomTooltip>
          <CustomTooltip title="View Cameras">
            <Button
              variant="contained"
              color="info"
              onClick={() => setCameraDialogOpen(true)}
            >
              Camera
            </Button>
          </CustomTooltip>
        </Stack>
      </Paper>
      {/* Threshold Dialog */}
      <Dialog
        open={thresholdDialogOpen}
        onClose={() => setThresholdDialogOpen(false)}
        PaperProps={{ sx: { minWidth: "750px" } }}
      >
        <DialogTitle fontWeight={700}>Thresholds</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setThresholdDialogOpen(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box px={3} py={2}>
          <Typography variant="body1" fontWeight={600} fontSize={19} mb={2}>
            {name}
          </Typography>
          <ThresholdTable asset_id={asset_id} />
        </Box>
      </Dialog>

      <GreenhouseControlDialog
        asset_id={asset_id}
        open={controlDialogOpen}
        onClose={() => setControlDialogOpen(false)}
      />

      <Dialog
        open={cameraDialogOpen}
        onClose={() => setCameraDialogOpen(false)}
      >
        <DialogTitle fontWeight={700}>Camera View</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setCameraDialogOpen(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box p={3}>
          <img
            width="100%"
            height="auto"
            src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDUzYWZsMW9ta3VpYnY4eDJxZ3d5eHB4dmZzcHRzZnVjazZuczhjMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fMJDsRF41tKWi42K3T/giphy.gif"
          />
        </Box>
      </Dialog>
      <Dialog open={keyDialogOpen} onClose={() => setKeyDialogOpen(false)}>
        <DialogTitle fontWeight={700}>Asset Keys</DialogTitle>
        <Box p={3}>
          <Typography variant="subtitle1">
            Sending timeseries with new data key will add to this table
          </Typography>
          <DataGrid
            rows={(keyData?.data || []) as readonly TSKey[]}
            getRowId={(row) => row.ts_key}
            columns={keyColumns}
            autoHeight
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            density="standard"
            sx={{
              "& .MuiDataGrid-cell:hover": {
                cursor: "pointer",
              },
            }}
          />
        </Box>
      </Dialog>
    </Stack>
  );
};

export default Greenhouse;
