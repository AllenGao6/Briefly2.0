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
}));

export default function WorkspaceContent({ open }) {
  const theme = useTheme();
  const classes = useStyles();
  const matchesDark = theme.palette.type === "dark";
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));

  const [value, setValue] = useState(0);
  const descriptionHeight = 400;
  const trigger = useScrollTrigger({
    target: window ? window : undefined,
    disableHysteresis: true,
    threshold: descriptionHeight,
  });

  return (
    <Grid
      container
      className={clsx(classes.root, {
        [classes.contentShift]: open && !matchesXS,
      })}
      direction="column"
      justify="flex-start"
    >
      {/* <Divider variant="middle" classes={{ root: classes.divider }} /> */}
      <Grid
        item
        style={{
          paddingTop: trigger ? "5rem" : "2rem",
          zIndex: 0,
          minHeight: "100vh",
        }}
      >
        <Typography variant="h2">Start From Here...</Typography>
      </Grid>
    </Grid>
  );
}
