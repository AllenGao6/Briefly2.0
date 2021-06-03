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
  const [marginLeft, setMarginLeft] = useState(0);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
    setMarginLeft(marginLeft === 0 ? 256 : 0);
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
        marginLeft={matchesXS ? 0 : marginLeft}
        {...props}
      />
      <NestedGrid style={{ marginLeft: matchesXS ? 0 : marginLeft }} />
    </React.Fragment>
  );
}
