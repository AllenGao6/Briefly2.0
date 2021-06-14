import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import ImgMediaCard from "./CollectionCard";
import clsx from "clsx"

const useStyles = makeStyles((theme) => ({
  gridsContainer: {
    width: "100%",
    paddingTop: 100,
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
  },
  rowContainer: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 20,
    width: "100%"
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
      className={classes.gridsContainer}
      justify="center"
      alignItems="center"
      direction="column"
      className={clsx({
        [classes.contentShift]: open
      }, classes.gridsContainer)}
    >
      <Grid container item spacing={3} justify="center" className={classes.rowContainer}>
        <FormRow />
      </Grid>
      <Grid container item spacing={3} justify="center" className={classes.rowContainer}>
        <FormRow />
      </Grid>
      <Grid container item spacing={3} justify="center" className={classes.rowContainer}>
        <FormRow />
      </Grid>
    </Grid>
  );
}
