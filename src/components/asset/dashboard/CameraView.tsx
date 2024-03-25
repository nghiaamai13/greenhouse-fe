import { Component, useEffect, useState } from "react";
import { Box, Link, Stack, Typography } from "@mui/material";
import { CustomTooltip } from "../../customTooltip";

interface CameraViewProps {
  cameraName: string;
  url: string;
}

export const CameraView: React.FC<CameraViewProps> = ({ cameraName, url }) => {
  const handleViewClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.open(url, "_blank");
  };
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Box
        sx={{
          width: "480px",
          height: "360px",
          flexShrink: 0,
        }}
      >
        <iframe
          src={url}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            cursor: "pointer",
          }}
          allowFullScreen
        ></iframe>
      </Box>

      <CustomTooltip title="View Camera">
        <Link
          href={url}
          onClick={handleViewClick}
          sx={{
            cursor: "pointer",
            textDecoration: "none",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          {cameraName}
        </Link>
      </CustomTooltip>
    </Box>
  );
};

export default CameraView;
