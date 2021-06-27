import React from "react";
import CollectionGrid from "./CollectionGrid";
import {
  Grid,
  makeStyles,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 85,
    background:
      theme.palette.type === "dark"
        ? theme.palette.primary.main
        : theme.palette.cloud,
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

export default function DashboardContent({
  open,
  collectionDialog,
  collectionDelete,
}) {
  const theme = useTheme();
  const classes = useStyles();
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <Grid
      container
      className={clsx(classes.root, {
        [classes.contentShift]: open && !matchesXS,
      })}
      direction="column"
      justify="flex-start"
    >
      <Grid item style={{ paddingLeft: "2rem", paddingBottom: "0.7rem" }}>
        <Typography variant="h3">Dashboard</Typography>
      </Grid>
      <Divider variant="middle" classes={{ root: classes.divider }} />
      <Grid item style={{ paddingTop: "2rem" }}>
        <CollectionGrid
          open={open}
          collectionDialog={collectionDialog}
          collectionDelete={collectionDelete}
        />
      </Grid>
    </Grid>
  );
}
