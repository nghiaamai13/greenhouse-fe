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
  Grid,
  IconButton,
  Dialog,
} from "@mui/material";
import { useApiUrl, useCustom, useParsed, useShow } from "@refinedev/core";

import MapIcon from "@mui/icons-material/Map";
import { IResourceComponentsProps } from "@refinedev/core/dist/contexts/resource";
import React, { useState } from "react";

import { IAsset, IFarm } from "../../interfaces";
import { Breadcrumb, Show } from "@refinedev/mui";
import OutdoorField from "../../components/asset/dashboard/OutdoorField";
import Greenhouse from "../../components/asset/dashboard/Greenhouse";
import DevicesTable from "../../components/farm/DevicesTable";
import AssetTable from "../../components/farm/AssetTable";
import LocationPicker from "../../components/farm/LocationPicker";
import { CustomTooltip } from "../../components";

export const FarmShow: React.FC<IResourceComponentsProps> = () => {
  const { id } = useParsed();
  const apiUrl = useApiUrl();
  const [activeTab, setActiveTab] = useState("1");
  const [copiedId, setCopiedId] = useState(false);
  const [openMapDialog, setOpenMapDialog] = useState(false);

  const {
    queryResult: { data: farm },
  } = useShow<IFarm>();
  const farm_data = farm?.data;

  const { data: outdoorFieldData, isLoading: outdoorFieldIsLoading } =
    useCustom<IAsset[]>({
      url: `${apiUrl}/farms/${id}/assets/outdoor_fields`,
      method: "get",
    });

  const { data: greenhouseData, isLoading: greenhouseDataIsLoading } =
    useCustom<IAsset[]>({
      url: `${apiUrl}/farms/${id}/assets/greenhouses`,
      method: "get",
    });

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
              {farm_data?.name}
            </Typography>
            <Typography sx={{ mt: "5px" }}>Farm details</Typography>
          </Box>
        }
      >
        <Paper sx={{ maxWidth: "100%", minHeight: "72vh" }}>
          <List sx={{ paddingX: { xs: 2, md: 0 }, flex: 1 }}>
            <TabContext value={activeTab}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleTabChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Dashboard" value="1" />
                  <Tab label="Details" value="2" />
                  <Tab label="Entities" value="3" />
                </TabList>
              </Box>
              {/* TABS */}
              <TabPanel value="2">
                {farm_data ? (
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
                        Copy farm id
                      </Button>
                      <Button
                        sx={{ marginRight: "8px" }}
                        variant="contained"
                        color="primary"
                        onClick={() => setActiveTab("1")}
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
                        label="Location"
                        focused={true}
                        value={farm_data?.location || ""}
                        fullWidth
                        variant="filled"
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <CustomTooltip title="Show on map">
                              <IconButton
                                color="primary"
                                onClick={() => setOpenMapDialog(true)}
                              >
                                <MapIcon />
                              </IconButton>
                            </CustomTooltip>
                          ),
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
                  </Stack>
                ) : (
                  <Alert severity="error">Failed to fetch farm data</Alert>
                )}
              </TabPanel>

              <TabPanel value="3">
                <Stack direction="column" sx={{ flex: 1 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={4}>
                      <AssetTable
                        farm_id={farm_data ? farm_data.farm_id : ""}
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <DevicesTable
                        farm_id={farm_data ? farm_data.farm_id : ""}
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </TabPanel>
              <TabPanel value="1">
                <Stack direction="column" sx={{ flex: 1 }}>
                  <Box>
                    <Typography variant="h5" color="#7FC7D9">
                      Outdoor Fields
                    </Typography>
                    {outdoorFieldData && outdoorFieldData.data.length > 0 ? (
                      outdoorFieldData.data.map((field) => (
                        <OutdoorField
                          key={field.asset_id}
                          asset_id={field.asset_id}
                          name={field.name}
                        />
                      ))
                    ) : (
                      <Typography>No outdoor fields</Typography>
                    )}
                  </Box>
                  <Box>
                    <Typography variant="h5" color="primary">
                      Greenhouses
                    </Typography>
                    {greenhouseData && greenhouseData.data.length > 0 ? (
                      greenhouseData.data.map((field) => (
                        <Greenhouse
                          key={field.asset_id}
                          asset_id={field.asset_id}
                          name={field.name}
                        />
                      ))
                    ) : (
                      <Typography>No greenhouses</Typography>
                    )}
                  </Box>
                </Stack>
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
          <Alert severity="success">Copied Farm ID to clipboard</Alert>
        </Snackbar>

        <Dialog
          open={openMapDialog}
          onClose={() => setOpenMapDialog(false)}
          PaperProps={{
            sx: {
              width: "500px",
              height: "500px",
              p: 2,
            },
          }}
        >
          <LocationPicker
            lat={farm_data?.location[0]}
            lng={farm_data?.location[1]}
            searchable={false}
            changeable={false}
            onChange={() => {}}
          />
        </Dialog>
      </Show>
    </>
  );
};
