import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import ImgMediaCard from "./CollectionCard";
import clsx from "clsx"

const useStyles = makeStyles((theme) => ({
  gridsContainer: {
    width: "100%",
    marginTop: 64,
    background:
      theme.palette.type === "dark" ? theme.palette.primary.main : "inherit",
  },
  contentShift: {
    marginLeft: 256,
    width: `calc(100% - ${256}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  }
}));

export default function NestedGrid({ open }) {
  const classes = useStyles();

  function FormRow() {
    return (
      <React.Fragment>
        <Grid item>
          <ImgMediaCard />
        </Grid>
        <Grid item>
          <ImgMediaCard />
        </Grid>
        <Grid item>
          <ImgMediaCard />
        </Grid>
      </React.Fragment>
    );
  }

  return (
    <Grid
      container
      spacing={4}
      className={classes.gridsContainer}
      justify="center"
      direction="column"
      className={clsx({
        [classes.contentShift]: open
      }, classes.gridsContainer)}
    >
      <Grid container item spacing={3} justify="center">
        <FormRow />
      </Grid>
      <Grid container item spacing={3} justify="center">
        <FormRow />
      </Grid>
      <Grid container item spacing={3} justify="center">
        <FormRow />
      </Grid>
    </Grid>
  );
}
