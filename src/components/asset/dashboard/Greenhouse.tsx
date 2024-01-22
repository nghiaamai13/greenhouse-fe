import React, { useState } from "react";
import TSLineChart from "./TSLineChart";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ThresholdTable from "./ThresholdTable";
import CloseIcon from "@mui/icons-material/Close";
import GreenhouseControlDialog from "./GreenhouseControl";
import { CustomTooltip } from "../../customTooltip";

interface GreenhouseProps {
  asset_id: string;
  name: string;
}

const Greenhouse: React.FC<GreenhouseProps> = ({ asset_id, name }) => {
  const [thresholdDialogOpen, setThresholdDialogOpen] = useState(false);
  const [controlDialogOpen, setControlDialogOpen] = useState(false);
  const [cameraDialogOpen, setCameraDialogOpen] = useState(false);

  const [expanded, setExpanded] = useState(false);

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const initialData = [
    { dataKey: "temperature", color: "#EBE76C", dataUnit: "°C" },
    { dataKey: "humidity", color: "#F0B86E", dataUnit: "%" },
    { dataKey: "light_intensity", color: "#836096", dataUnit: "Lux" },
    // { dataKey: "dataKey4", color: "#FF5733", dataUnit: "Unit4" },
    // { dataKey: "dataKey5", color: "#33FF57", dataUnit: "Unit5" },
    // { dataKey: "dataKey6", color: "#5733FF", dataUnit: "Unit6" },
    // { dataKey: "dataKey7", color: "#FF33B8", dataUnit: "Unit7" },
    // { dataKey: "dataKey8", color: "#33B8FF", dataUnit: "Unit8" },
    // { dataKey: "dataKey8", color: "#33B8AA", dataUnit: "Unit9" },
  ];

  const totalCharts = initialData.length;
  const chartsToRender = expanded ? initialData : initialData.slice(0, 4);

  return (
    <Stack>
      <Paper sx={{ padding: "20px", my: "20px" }}>
        <Typography variant="h6">{name}</Typography>
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
                dataUnit={data.dataUnit}
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
    </Stack>
  );
};

export default Greenhouse;
