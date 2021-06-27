import React from "react";
import CollectionGrid from "./CollectionGrid";
import { Grid, makeStyles, Divider } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.cloud,
  },
}));

export default function DashboardContent({
  open,
  collectionDialog,
  collectionDelete,
}) {
  const classes = useStyles();

  return (
    <Grid
      container
      className={classes.root}
      direction="column"
      justify="flex-start"
    >
      <Grid item></Grid>
      <Grid item></Grid>
      <Grid item>
        <CollectionGrid
          open={open}
          collectionDialog={collectionDialog}
          collectionDelete={collectionDelete}
        />
      </Grid>
    </Grid>
  );
}
