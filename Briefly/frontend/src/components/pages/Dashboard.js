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
import NestedGrid from '../common/CollectionGrid'

// User View
const useStyles = makeStyles((theme) => ({}));

export default function Dashboard(props) {
  const classes = useStyles();
  const theme = useTheme();

  // prevent user from manually entering "/dashboard" Url
  useEffect(() => {
    if (!props.user) {
      // props.history.replace("/");
    }
  }, [props.user]);

  return (
    <React.Fragment>
      <DashboardBar {...props} />
      <NestedGrid />
    </React.Fragment>
  );
}
