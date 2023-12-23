import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useQueryClient } from "@tanstack/react-query";
import {
  Box,
  List,
  Paper,
  Tab,
  Typography,
  Button,
  Snackbar,
  Alert,
  TextField,
  Stack,
  IconButton,
} from "@mui/material";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import {
  HttpError,
  useApiUrl,
  useCustom,
  useParsed,
  usePermissions,
  useShow,
} from "@refinedev/core";
import { IResourceComponentsProps } from "@refinedev/core/dist/contexts/resource";
import React, { useState } from "react";

import { IFarm, ITelemetry, IThreshold, Nullable } from "../../interfaces";
import {
  Breadcrumb,
  CreateButton,
  DateField,
  EditButton,
  Show,
} from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useModalForm } from "@refinedev/react-hook-form";
import { EditFarm } from "./edit";
export const FarmShow: React.FC<IResourceComponentsProps> = () => {
  const { id } = useParsed();
  const { data: role } = usePermissions();
  const apiUrl = useApiUrl();
  const [activeTab, setActiveTab] = useState("1");
  const [copiedId, setCopiedId] = useState(false);
  const queryClient = useQueryClient();

  const handleTabChange = (
    event: React.SyntheticEvent,
    newTabIndex: string
  ) => {
    setActiveTab(newTabIndex);
  };

  const {
    queryResult: { data: farm },
  } = useShow<IFarm>();
  const farm_data = farm?.data;

  const { data: key_data, isLoading: keyIsLoading } = useCustom({
    url: `${apiUrl}/farms/${id}/keys`,
    method: "get",
  });

  const { data: telemetry_data, isLoading: telemetryIsLoading } =
    useCustom<ITelemetry>({
      url: `${apiUrl}/farms/${id}/telemetry/latest`,
      method: "get",
      queryOptions: {
        queryKey: ["farm_latest_telemetry"],
      },
    });

  const { data: threshholds_data, isLoading: thresholdIsLoading } =
    useCustom<IThreshold>({
      url: `${apiUrl}/farms/${id}/thresholds`,
      method: "get",
    });

  const editDrawerFormProps = useModalForm<IFarm, HttpError, Nullable<IFarm>>({
    refineCoreProps: { action: "edit", resource: "farms", redirect: false },
  });

  const {
    modal: { show: showEditDrawer },
  } = editDrawerFormProps;

  const thresholdColumns = React.useMemo<GridColDef<IThreshold>[]>(
    () => [
      { field: "key", headerName: "Key", flex: 1 },
      {
        field: "threshold_min",
        headerName: "Min Value",
        width: 120,
      },
      {
        field: "threshold_max",
        headerName: "Max Value",
        width: 120,
      },
      {
        field: "modified_at",
        headerName: "Created/Modified At",
        flex: 1,
        minWidth: 300,
        renderCell: function render({ row }) {
          return <DateField value={row.modified_at} format="LLL" />;
        },
      },
    ],
    []
  );

  const telemetryColumns = React.useMemo<GridColDef<ITelemetry>[]>(
    () => [
      { field: "key", headerName: "Key", flex: 1 },
      {
        field: "value",
        headerName: "Value",
        width: 120,
      },

      {
        field: "timestamp",
        headerName: "Timestamp",
        flex: 1,
        minWidth: 300,
        renderCell: function render({ row }) {
          return <DateField value={row.timestamp} format="LLL" />;
        },
      },
    ],
    []
  );

  return (
    <>
      <Show
        isLoading={thresholdIsLoading || keyIsLoading || telemetryIsLoading}
        breadcrumb={<Breadcrumb />}
        title={
          <Box>
            <Typography sx={{ fontSize: "1.4993rem", fontWeight: "800" }}>
              {farm_data?.name}
            </Typography>
            <Typography sx={{ mt: "5px" }}>Farm details</Typography>
          </Box>
        }
      >
        <Paper sx={{ maxWidth: "80%", minHeight: "72vh" }}>
          <List sx={{ paddingX: { xs: 2, md: 0 }, flex: 1 }}>
            <TabContext value={activeTab}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleTabChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Details" value="1" />
                  <Tab label="Thresholds" value="2" />
                  <Tab label="Telemetry" value="3" />
                </TabList>
              </Box>
              {/* TABS */}
              <TabPanel value="1">
                <Box sx={{ display: "flex", flexDirection: "row", mt: "5px" }}>
                  <Button
                    sx={{ marginRight: "8px" }}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setCopiedId(true);
                      //@ts-ignore
                      navigator.clipboard.writeText(id);
                    }}
                  >
                    Copy farm id
                  </Button>
                  <Button
                    sx={{ marginRight: "8px" }}
                    variant="contained"
                    color="primary"
                  >
                    View Dashboard
                  </Button>
                </Box>
                <Box mt={2}>
                  <TextField
                    label="Farm Name"
                    focused={true}
                    value={farm_data?.name}
                    fullWidth
                    variant="filled"
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{ outline: "none" }}
                  />
                  <TextField
                    label="Description"
                    focused={true}
                    value={farm_data?.descriptions || ""}
                    multiline
                    rows={4}
                    fullWidth
                    variant="filled"
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <TextField
                    label="Assigned Customer"
                    focused={true}
                    value={farm_data?.customer?.username}
                    fullWidth
                    variant="filled"
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <TextField
                    label="Created At"
                    focused={true}
                    value={farm_data?.created_at}
                    fullWidth
                    variant="filled"
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Box>
              </TabPanel>
              <TabPanel value="2">
                <Stack>
                  <Stack direction={"row"} marginBottom="8px">
                    <CreateButton variant="contained">Add</CreateButton>
                  </Stack>

                  <DataGrid
                    loading={thresholdIsLoading}
                    rows={
                      (threshholds_data?.data || []) as readonly IThreshold[]
                    }
                    getRowId={(row) => row.threshold_id}
                    columns={thresholdColumns}
                    autoHeight
                    pageSizeOptions={[10, 25, 50, 100]}
                    density="standard"
                    sx={{
                      "& .MuiDataGrid-cell:hover": {
                        cursor: "pointer",
                      },
                    }}
                  />
                </Stack>
              </TabPanel>
              <TabPanel value="3">
                <IconButton
                  sx={{
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "rotate(250deg)",
                    },
                  }}
                  color="success"
                  onClick={() =>
                    queryClient.invalidateQueries(["farm_latest_telemetry"])
                  }
                >
                  <ReplayOutlinedIcon />
                </IconButton>
                <DataGrid
                  loading={telemetryIsLoading}
                  rows={(telemetry_data?.data || []) as readonly ITelemetry[]}
                  getRowId={(row) => row.key}
                  columns={telemetryColumns}
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
              </TabPanel>
            </TabContext>
          </List>
        </Paper>
        {/* Copy to clipboard snackbar */}
        <Snackbar
          open={copiedId}
          autoHideDuration={6000}
          onClose={(event?: React.SyntheticEvent | Event, reason?: string) => {
            setCopiedId(false);
          }}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            Copied Farm ID to clipboard
          </Alert>
        </Snackbar>
      </Show>
    </>
  );
};
