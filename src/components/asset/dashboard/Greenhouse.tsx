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
import ThresholdTable from "./ThresholdTable";
import CloseIcon from "@mui/icons-material/Close";
import GreenhouseControl from "./GreenhouseControl";
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

  return (
    <Stack>
      <Paper sx={{ padding: "20px", my: "20px" }}>
        <Typography variant="h6">{name}</Typography>
        <Grid container spacing={2} columns={16} mb={"25px"}>
          <Grid item xs={16} md={8} lg={4}>
            <TSLineChart
              asset_id={asset_id}
              color="#EBE76C"
              dataKey="temperature"
              dataUnit="°C"
            />
          </Grid>
          <Grid item xs={16} md={8} lg={4}>
            <TSLineChart
              asset_id={asset_id}
              color="#F0B86E"
              dataKey="humidity"
              dataUnit="%"
            />
          </Grid>
          <Grid item xs={16} md={8} lg={4}>
            <TSLineChart
              asset_id={asset_id}
              color="#836096"
              dataKey="light intensity"
              dataUnit="Lux"
            />
          </Grid>
          <Grid item xs={16} md={8} lg={4}>
            <TSLineChart asset_id={asset_id} color="#ED7B7B" dataKey="pH" />
          </Grid>
        </Grid>

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
