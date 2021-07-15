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
// local component
import SummaryContent from "../workspace/SummaryContent";
import MediaDisplay from "../workspace/MediaDisplay";
import Transcripts from "../workspace/Transcripts";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 69,
    background:
      theme.palette.type === "dark" ? theme.palette.primary.main : "white",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    position: "relative",
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
}));

export default function WorkspaceContent({ open, media, mediaType }) {
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
    >
      <SplitPane
        split="vertical"
        defaultSize="50%"
        style={{
          height: "-moz-calc(100vh - 69px)",
          height: "-webkit-calc(100vh - 69px)",
          border: "15px solid rgba(0, 0, 0, 0.1)",
        }}
        minSize={1}
        maxSize={-46}
        primary="second"
      >
        <SplitPane
          split="horizontal"
          defaultSize="50%"
          className={classes.splitPane}
          primary="second"
          minSize={1}
          maxSize={-46}
        >
          <MediaDisplay media={media} mediaType={mediaType} />
          <Transcripts media={media} />
        </SplitPane>
        <SummaryContent media={media} />
      </SplitPane>
    </div>
  );
}
