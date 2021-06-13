import { makeStyles } from "@material-ui/styles";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  useScrollTrigger,
  Tabs,
  Tab,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Grid,
  Hidden,
  Dialog,
  DialogContent,
  ListItemIcon,
  Avatar,
} from "@material-ui/core";
import DashboardBar from "../common/DashboardBar";
import NestedGrid from "../common/CollectionGrid";
import Navigator from "../common/Navigator";
import DashboardContent from "../common/DashboardContent"

// User View
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
}));

export default function Dashboard(props) {
  const classes = useStyles();
  const theme = useTheme();
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // prevent user from manually entering "/dashboard" Url
  useEffect(() => {
    if (!props.user) {
      // props.history.replace("/");
    }
  }, [props.user]);

  return (
    <React.Fragment>
      <Navigator open={mobileOpen} onClose={handleDrawerToggle} />
      <DashboardBar
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        {...props}
      />
      <DashboardContent open={mobileOpen} />
    </React.Fragment>
  );
}
