import { useContext } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ColorModeContext } from "../../contexts";

interface CustomLinkFieldProps {
  field_name: string;
  field_data_name: string;
  onClick?: () => void;
}

export const CustomLinkField: React.FC<CustomLinkFieldProps> = ({
  field_name,
  field_data_name,
  onClick,
}) => {
  const { mode } = useContext(ColorModeContext);

  const backgroundColor = mode === "light" ? "#f0f0f0" : "#3d3d3d";

  return (
    <Box
      my="20px"
      pl="12px"
      pb="8px"
      pt="8px"
      color="#67BE23"
      bgcolor={backgroundColor}
      sx={{
        borderBottom: "2px solid",
        borderTopRightRadius: "6px",
        borderTopLeftRadius: "6px",
      }}
    >
      <Typography component="div" fontWeight={400} fontSize="0.75rem">
        {field_name}
      </Typography>
      <Typography
        component="a"
        variant="body1"
        onClick={onClick}
        sx={{
          display: "inline-block",
          textDecoration: "underline",
          width: "100%",
          "&:hover": { cursor: "pointer" },
        }}
      >
        {field_data_name}
      </Typography>
    </Box>
  );
};
