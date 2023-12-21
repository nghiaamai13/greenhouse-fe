import { Link } from "react-router-dom";
import Box from "@mui/material/Box";

import { BikeWhiteIcon, FineFoodsIcon } from "../../components/icons";
import { Button } from "@mui/material";

type TitleProps = {
  collapsed: boolean;
};

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
  return (
    <Button fullWidth variant="text" disableRipple>
      <Link to="/">
        <img src={"/assets/logo.png"} alt="Greenhouse" width="28px" />
      </Link>
    </Button>
  );
};
