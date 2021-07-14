import React, { useEffect, useState } from "react";
import {
  Grid,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
  useScrollTrigger,
} from "@material-ui/core";
import clsx from "clsx";
import { darken, lighten } from "@material-ui/core/styles";
import SplitPane from "react-split-pane";
import "../../../static/css/split.css"; // do not delete!

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 69,
    background:
      theme.palette.type === "dark" ? theme.palette.primary.main : "white",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  divider: {
    background: theme.palette.type === "dark" ? "white" : "black",
  },
  contentShift: {
    marginLeft: 256,
    width: `calc(100% - ${256}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  block: {
    height: "100%",
    width: "100%",
  },
  splitPane: {},
}));

export default function WorkspaceContent({ open }) {
  const theme = useTheme();
  const classes = useStyles();
  const matchesDark = theme.palette.type === "dark";
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <div
      className={clsx(classes.root, {
        [classes.contentShift]: open && !matchesXS,
      })}
      style={{ position: "relative" }}
    >
      {/* <Divider variant="middle" classes={{ root: classes.divider }} /> */}
      <SplitPane
        split="vertical"
        defaultSize="50%"
        className={classes.splitPane}
        style={{ height: "100vh" }}
      >
        <SplitPane
          split="horizontal"
          defaultSize="50%"
          className={classes.splitPane}
        >
          <div></div>
          <div></div>
        </SplitPane>
        <SplitPane
          split="horizontal"
          defaultSize="50%"
          className={classes.splitPane}
        >
          <div></div>
          <div></div>
        </SplitPane>
      </SplitPane>
    </div>
  );
}
