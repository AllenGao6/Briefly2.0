import { makeStyles } from "@material-ui/styles";
import React from "react";
import ReactPlayer from "react-player";
import { Card, Grid, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  captionMargins: {
    marginTop: "100px",
    marginBottom: "50px",
    fontSize: "45px",
  },
}));

const PlayingVideo = () => (
  <ReactPlayer
    controls
    width="800px"
    height="450px"
    url={"https://www.youtube.com/watch?v=xyoajzO-h7Y"}
  />
);

export const MissionSection = () => {
  const classes = useStyles();
  return (
    <Grid justify="center" alignItems="center" container direction="column" id="demo">
      <Typography className={classes.captionMargins} variant="h2" align="center">
        Briefly's Mission
      </Typography>
      <Grid container justify="center">
        <Card>
          <PlayingVideo />
        </Card>
      </Grid>
    </Grid>
  );
};
