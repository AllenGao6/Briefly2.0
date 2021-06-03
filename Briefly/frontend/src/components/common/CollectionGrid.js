import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import ImgMediaCard from "./CollectionCard";

const useStyles = makeStyles((theme) => ({
  gridsContainer: {
    width: "100%",
    marginTop: 64,
    background:
      theme.palette.type === "dark" ? theme.palette.primary.main : "inherit",
  },
}));

export default function NestedGrid({ style }) {
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
      style={style}
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
