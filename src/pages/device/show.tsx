import { TabContext, TabList, TabPanel } from "@mui/lab";
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
  Dialog,
  DialogTitle,
} from "@mui/material";
import { useApiUrl, useNavigation, useParsed, useShow } from "@refinedev/core";

import { IResourceComponentsProps } from "@refinedev/core/dist/contexts/resource";
import React, { useState } from "react";

import { IDevice } from "../../interfaces";
import { Breadcrumb, Show } from "@refinedev/mui";
import LatestTelemetryTable from "../../components/telemetry/LatestTelemetryTable";
import { CustomLinkField } from "../../components/customLinkField";

export const DeviceShow: React.FC<IResourceComponentsProps> = () => {
  const { id } = useParsed();
  const apiUrl = useApiUrl();
  const { show } = useNavigation();
  const [activeTab, setActiveTab] = useState("1");
  const [copiedId, setCopiedId] = useState(false);
  const [checkConnectivityDialogOpen, setCheckConnectivityDialogOpen] =
    useState(false);

  const {
    queryResult: { data: devices },
  } = useShow<IDevice>();
  const device_data = devices?.data;

  const handleTabChange = (
    event: React.SyntheticEvent,
    newTabIndex: string
  ) => {
    setActiveTab(newTabIndex);
  };

  return (
    <>
      <Show
        breadcrumb={<Breadcrumb />}
        title={
          <Box>
            <Typography sx={{ fontSize: "1.4993rem", fontWeight: "800" }}>
              {device_data?.name}
            </Typography>
            <Typography sx={{ mt: "5px" }}>Device details</Typography>
          </Box>
        }
      >
        <Paper>
          <List sx={{ paddingX: { xs: 2, md: 0 }, flex: 1 }}>
            <TabContext value={activeTab}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleTabChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Details" value="1" />
                  <Tab label="Telemetry" value="2" />
                </TabList>
              </Box>
              {/* TABS */}
              <TabPanel value="1">
                {device_data ? (
                  <Stack sx={{ maxWidth: "80%" }}>
                    <Box
                      sx={{ display: "flex", flexDirection: "row", mt: "5px" }}
                    >
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
                        Copy Device ID
                      </Button>
                      <Button
                        sx={{ marginRight: "8px" }}
                        variant="contained"
                        color="info"
                        onClick={() => setCheckConnectivityDialogOpen(true)}
                      >
                        Check Connectivity
                      </Button>
                    </Box>
                    <Box mt={2}>
                      <TextField
                        label="Asset Name"
                        focused={true}
                        value={device_data?.name}
                        fullWidth
                        variant="filled"
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <TextField
                        label="Label"
                        focused={true}
                        value={device_data?.label}
                        fullWidth
                        variant="filled"
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <CustomLinkField
                        field_name="Asset"
                        field_data_name={device_data?.asset.name}
                        onClick={() =>
                          show("assets", device_data?.asset.asset_id)
                        }
                      />
                      <CustomLinkField
                        field_name="Farm"
                        field_data_name={device_data?.asset.farm.name}
                        onClick={() =>
                          show("farms", device_data?.asset.farm.farm_id)
                        }
                      />
                      <CustomLinkField
                        field_name="Device Profile"
                        field_data_name={device_data?.device_profile.name}
                        onClick={() => {}}
                      />

                      <TextField
                        label="Created At"
                        sx={{ mt: "0" }}
                        focused={true}
                        value={device_data?.created_at}
                        fullWidth
                        variant="filled"
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Box>
                  </Stack>
                ) : (
                  <Alert severity="error">Failed to fetch device data</Alert>
                )}
              </TabPanel>

              <TabPanel value="2">
                <LatestTelemetryTable
                  entity_id={id ? id.toString() : ""}
                  entity_type={"devices"}
                />
              </TabPanel>
            </TabContext>
          </List>
        </Paper>

        {/* Copy to clipboard snackbar */}
        <Snackbar
          open={copiedId}
          autoHideDuration={5000}
          onClose={(event?: React.SyntheticEvent | Event, reason?: string) => {
            setCopiedId(false);
          }}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            Copied Device ID to clipboard
          </Alert>
        </Snackbar>
        {/*Check Conectivity Dialog*/}
        <Dialog
          open={checkConnectivityDialogOpen}
          onClose={() => setCheckConnectivityDialogOpen(false)}
        >
          <DialogTitle>Check Device Connectivity</DialogTitle>
        </Dialog>
      </Show>
    </>
  );
};
