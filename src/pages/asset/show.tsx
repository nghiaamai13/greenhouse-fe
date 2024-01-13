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
} from "@mui/material";
import { useApiUrl, useNavigation, useParsed, useShow } from "@refinedev/core";

import { IResourceComponentsProps } from "@refinedev/core/dist/contexts/resource";
import React, { useContext, useState } from "react";

import { IAsset } from "../../interfaces";
import { Breadcrumb, Show } from "@refinedev/mui";
import LatestTelemetryTable from "../../components/telemetry/LatestTelemetryTable";
import { CustomLinkField } from "../../components/customLinkField";
import ThresholdTable from "../../components/asset/dashboard/ThresholdTable";

export const AssetShow: React.FC<IResourceComponentsProps> = () => {
  const { id } = useParsed();
  const apiUrl = useApiUrl();
  const [activeTab, setActiveTab] = useState("1");
  const [copiedId, setCopiedId] = useState(false);
  const { show } = useNavigation();

  const {
    queryResult: { data: asset },
  } = useShow<IAsset>();
  const asset_data = asset?.data;

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
              {asset_data?.name}
            </Typography>
            <Typography sx={{ mt: "5px" }}>Asset details</Typography>
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
                  <Tab label="Threshold" value="3" />
                </TabList>
              </Box>
              {/* TABS */}
              <TabPanel value="1">
                {asset_data ? (
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
                        Copy asset id
                      </Button>
                    </Box>
                    <Box mt={2}>
                      <TextField
                        label="Asset Name"
                        focused={true}
                        value={asset_data?.name}
                        fullWidth
                        variant="filled"
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <TextField
                        label="Type"
                        focused={true}
                        value={asset_data?.type || ""}
                        multiline
                        rows={4}
                        fullWidth
                        variant="filled"
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <CustomLinkField
                        field_name="Farm"
                        field_data_name={asset_data?.farm.name}
                        onClick={() => show("farms", asset_data?.farm.farm_id)}
                      />
                      <TextField
                        label="Created At"
                        focused={true}
                        value={asset_data?.created_at}
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
                  <Alert severity="error">Failed to fetch asset data</Alert>
                )}
              </TabPanel>

              <TabPanel value="2">
                <LatestTelemetryTable
                  entity_id={id ? id.toString() : ""}
                  entity_type={"assets"}
                />
              </TabPanel>
              <TabPanel value="3" sx={{ maxWidth: "800px" }}>
                {asset_data?.type === "Outdoor Field" ? (
                  <Alert severity="error">
                    You can't set threshold on an Outdoor Fields
                  </Alert>
                ) : (
                  <ThresholdTable asset_id={id ? id.toString() : ""} />
                )}
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
            Copied Asset ID to clipboard
          </Alert>
        </Snackbar>
      </Show>
    </>
  );
};
