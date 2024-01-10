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
  Autocomplete,
  FormControl,
  DialogTitle,
  Dialog,
  DialogContent,
} from "@mui/material";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import {
  HttpError,
  useApiUrl,
  useCustom,
  useCustomMutation,
  useParsed,
  useShow,
} from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

import { IResourceComponentsProps } from "@refinedev/core/dist/contexts/resource";
import React, { useState } from "react";

import {
  IFarm,
  ITelemetry,
  IThreshold,
  IThresholdAdd,
  Nullable,
} from "../../interfaces";
import { Breadcrumb, CreateButton, DateField, Show } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Controller } from "react-hook-form";

export const AssetShow: React.FC<IResourceComponentsProps> = () => {
  const { id } = useParsed();
  const apiUrl = useApiUrl();
  const [activeTab, setActiveTab] = useState("1");
  const [copiedId, setCopiedId] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<IThresholdAdd, HttpError, Nullable<IThresholdAdd>>();

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
      queryOptions: {
        queryKey: ["farm_thresholds"],
      },
    });

  const handleTabChange = (
    event: React.SyntheticEvent,
    newTabIndex: string
  ) => {
    setActiveTab(newTabIndex);
  };

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
                  <Tab label="Dashboard" value="2" />
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
                Dashboard
                {/* <FarmDeviceTable
                  apiUrl={apiUrl}
                  farm_id={farm_data?.farm_id || ""}
                /> */}
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
