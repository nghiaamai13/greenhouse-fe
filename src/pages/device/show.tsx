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
  DialogContent,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";
import { useApiUrl, useNavigation, useParsed, useShow } from "@refinedev/core";

import { FileCopyOutlined } from "@mui/icons-material";
import { IResourceComponentsProps } from "@refinedev/core/dist/contexts/resource";
import React, { useState } from "react";

import { IDevice } from "../../interfaces";
import { Breadcrumb, Show } from "@refinedev/mui";
import LatestTelemetryTable from "../../components/telemetry/LatestTelemetryTable";
import { CustomLinkField } from "../../components/customLinkField";
import { MQTT_BROKER_ADDRESS, MQTT_PORT } from "../../constant";

export const DeviceShow: React.FC<IResourceComponentsProps> = () => {
  const { id } = useParsed();
  const apiUrl = useApiUrl();
  const { show } = useNavigation();
  const [detailActiveTab, setDetailActiveTab] = useState("1");
  const [connectivityActiveTab, setConnectivityActiveTab] = useState("1");
  const [copiedId, setCopiedId] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);
  const [checkConnectivityDialogOpen, setCheckConnectivityDialogOpen] =
    useState(false);

  const {
    queryResult: { data: devices },
  } = useShow<IDevice>();
  const device_data = devices?.data;

  const handleDetailTabChange = (
    event: React.SyntheticEvent,
    newTabIndex: string
  ) => {
    setDetailActiveTab(newTabIndex);
  };

  const handleConnectivityTabChange = (
    event: React.SyntheticEvent,
    newTabIndex: string
  ) => {
    setConnectivityActiveTab(newTabIndex);
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
            <TabContext value={detailActiveTab}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleDetailTabChange}
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
          open={copiedId || copiedCommand}
          autoHideDuration={3000}
          onClose={(event?: React.SyntheticEvent | Event, reason?: string) => {
            setCopiedId(false);
            setCopiedCommand(false);
          }}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            Copied to clipboard
          </Alert>
        </Snackbar>
        {/*Check Conectivity Dialog*/}
        <Dialog
          open={checkConnectivityDialogOpen}
          onClose={() => setCheckConnectivityDialogOpen(false)}
          PaperProps={{ sx: { minWidth: "800px" } }}
        >
          <DialogTitle fontWeight={700}>Check Device Connectivity</DialogTitle>
          <DialogContent>
            <Stack direction={"column"} sx={{ flex: 1 }}>
              <TabContext value={connectivityActiveTab}>
                <TabList
                  onChange={handleConnectivityTabChange}
                  aria-label="lab API tabs example 1"
                >
                  <Tab label="Windows" value="1" />
                  <Tab label="Linux" value="2" />
                </TabList>

                <TabPanel value="1" sx={{ p: 0 }}>
                  <Paper sx={{ padding: 2, my: 2 }}>
                    <Typography variant="body1" fontWeight={700} sx={{ mb: 2 }}>
                      Install necessary client tools
                    </Typography>
                    <Typography variant="subtitle2">
                      Install necessary MQTT client tools, you can use tool like
                      <Link href="https://mosquitto.org/" target="_blank">
                        {" "}
                        mosquitto{" "}
                      </Link>
                    </Typography>
                  </Paper>
                  <Paper sx={{ padding: 2, my: 2 }}>
                    <Typography variant="body1" fontWeight={700} sx={{ mb: 2 }}>
                      Execute the following command
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      defaultValue={`mosquitto_pub -d -q 1 -h ${MQTT_BROKER_ADDRESS} -p ${MQTT_PORT} -t devices/${device_data?.device_id}/telemetry -m '{"temperature":25}'`}
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `mosquitto_pub -d -q 1 -h ${MQTT_BROKER_ADDRESS} -p ${MQTT_PORT} -t devices/${device_data?.device_id}/telemetry -m '{"temperature":25}'`
                                );
                                setCopiedCommand(true);
                              }}
                              edge="end"
                            >
                              <FileCopyOutlined />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Paper>
                </TabPanel>
                <TabPanel value="2" sx={{ p: 0 }}>
                  <Paper sx={{ padding: 2, my: 2 }}>
                    <Typography variant="body1" fontWeight={700} sx={{ mb: 2 }}>
                      Install necessary client tools
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      defaultValue="sudo apt-get install curl mosquitto-clients"
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => {}} edge="end">
                              <FileCopyOutlined />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Paper>
                  <Paper sx={{ padding: 2, my: 2 }}>
                    <Typography variant="body1" fontWeight={700} sx={{ mb: 2 }}>
                      Execute the following command
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      defaultValue={`mosquitto_pub -d -q 1 -h 127.0.0.1 -p 1883 -t devices/${device_data?.device_id}/telemetry -m '{"temperature":25}'`}
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => {}} edge="end">
                              <FileCopyOutlined />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Paper>
                </TabPanel>
              </TabContext>

              <Paper sx={{ padding: 2, my: 2 }}>
                <LatestTelemetryTable
                  entity_id={id ? id.toString() : ""}
                  entity_type={"devices"}
                />
              </Paper>
            </Stack>
          </DialogContent>
        </Dialog>
      </Show>
    </>
  );
};
