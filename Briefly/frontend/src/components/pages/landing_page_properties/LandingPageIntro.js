import { makeStyles } from "@material-ui/styles";
import React, { useState } from "react";
import { Paper, Grid, Typography } from "@material-ui/core";
import { icons2, captions2, descriptions2 } from "./data.js";

const useStyles = makeStyles((theme) => ({
  secondaryCaption: {
    ...theme.typography.secondaryCaption,
  },
  emphasizedBody1: {
    ...theme.typography.emphasizedBody1,
    fontFamily: "Ubuntu",
    fontWeight: 400,
    fontSize: "1.0rem",
    color: "#2c3e50",
  },
  body1: {
    ...theme.typography.body1,
    fontFamily: "Ubuntu",
    fontWeight: 400,
    fontSize: "1.0rem",
    color: "#7f8c8d",
  },

  // components
  backgroundContainer: {
    backgroundColor: "#ecf0f1",
  },
  introCardItem: {
    maxWidth: "380px",
    maxHeight: "350px",
    marginTop: "10px",
    marginBottom: "10px",
    padding: "15px",
    color: "#ecf0f1",
    backgroundColor: "#ecf0f1",
  },
  introContainer: {
    width: "100%",
  },
  introCardContentContainer: {
    minHeight: 350,
    paddingLeft: 10,
    paddingRight: 10,
    color: "#ecf0f1",
  },
  introCardContent: {
    color: "#7f8c8d",
  },
  captionMargins: {
    marginTop: "100px",
    marginBottom: "50px",
    fontSize: "45px",
  },
}));

const MyCard = (props) => {
  const [hovering, setHovering] = useState(false);
  const classes = useStyles();
  return (
    <Paper
      elevation={hovering ? 5 : 0}
      onMouseOver={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={classes.introCardItem}
    >
      <Grid container>
        <Grid item xs={1}></Grid>

        <Grid
          item
          container
          direction="column"
          justify="flex-start"
          className={classes.introCardContentContainer}
        >
          <Grid item style={{ maxHeight: 100 }}>
            <Typography align="center" style={{ color: "#2c3e50" }}>
              {hovering ? props.icon[1] : props.icon[0]}
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.secondaryCaption} align="center">
              {props.caption}
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              className={hovering ? classes.emphasizedBody1 : classes.body1}
              align="space-evenly"
            >
              {props.description}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

const lengthArray = (length) => [...Array(length)];

export const IntroSection = () => {
  const classes = useStyles();
  return (
    <Grid justify="center" alignItems="center" container direction="column" id="new-intro">
      <Typography className={classes.captionMargins} variant="h2" align="center">
        What is Briefly?
      </Typography>
      <Grid container justify="space-evenly" className={classes.introContainer}>
        {lengthArray(6).map((item, idx) => (
          <MyCard
            key={idx}
            icon={icons2[idx]}
            caption={captions2[idx]}
            description={descriptions2[idx]}
          />
        ))}
      </Grid>
    </Grid>
  );
};
