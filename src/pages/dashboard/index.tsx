import React from "react";
import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import {
  FarmListMap,
  StatsCard,
  VerticalLinearStepper,
} from "../../components/dashboard";

export const DashboardPage: React.FC = () => {
  return (
    <Grid container rowSpacing={4} columnSpacing={2}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h6" fontWeight={700}>
          Dashboard
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <StatsCard entity_type="farms" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <StatsCard entity_type="assets" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <StatsCard entity_type="devices" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <StatsCard entity_type="messages" />
      </Grid>

      <Grid
        item
        md={8}
        sx={{ display: { sm: "none", md: "block", lg: "none" } }}
      />

      {/* row 2 */}
      <Grid item xs={12} md={7} lg={8}>
        <Typography variant="h6" fontWeight={700}>
          Maps
        </Typography>
        <Paper sx={{ height: "750px", p: 2, mt: 2 }}>
          <FarmListMap />
        </Paper>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Typography variant="h6" fontWeight={700}>
          Get Started
        </Typography>
        <Paper sx={{ height: "750px", p: 2, mt: 2 }}>
          <VerticalLinearStepper />
        </Paper>
      </Grid>
    </Grid>
  );
};
