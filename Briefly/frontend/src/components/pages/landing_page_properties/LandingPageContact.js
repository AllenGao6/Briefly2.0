import { makeStyles, useTheme } from "@material-ui/styles";
import React, { useState } from "react";
import { Button, Grid, TextareaAutosize, Typography } from "@material-ui/core";
import { contactInfo, ratingComment } from "./data.js";
import StarOutlineRoundedIcon from "@material-ui/icons/StarOutlineRounded";
import StarRoundedIcon from "@material-ui/icons/StarRounded";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";

const useStyles = makeStyles((theme) => ({
  secondaryCaption: {
    ...theme.typography.secondaryCaption,
  },
  captionMargins: {
    marginTop: "100px",
    marginBottom: "50px",
    fontSize: "45px",
  },
  contactArea: {
    backgroundColor: theme.palette.common.cloud,
  },
}));

const InfoStrip = (props) => {
  const theme = useTheme();
  const classes = useStyles();
  return (
    <Grid container direction="column">
      <Grid
        container
        alignItems="baseline"
        style={{ backgroundColor: theme.palette.common.silver, maxWidth: 200 }}
      >
        <ArrowForwardIosRoundedIcon />
        <Typography className={classes.secondaryCaption} style={{ color: "#2c3e50" }}>
          {props.data.type}
        </Typography>
      </Grid>
      <Typography className={classes.secondaryCaption} style={{ marginLeft: 40, color: "#2c3e50" }}>
        {props.data.info}
      </Typography>
    </Grid>
  );
};

const InfoSection = (props) => (
  <Grid container>
    {props.data.map((item, idx) => (
      <InfoStrip key={`${item}-${idx}`} data={item} />
    ))}
  </Grid>
);

const createArray = (length) => [...Array(length)];

const MyStar = ({ selected = false, onSelect = (f) => f }) => {
  {
    return selected ? (
      <StarRoundedIcon style={{ fontSize: "500%", color: "#f1c40f" }} onClick={onSelect} />
    ) : (
      <StarOutlineRoundedIcon style={{ fontSize: "500%" }} onClick={onSelect} />
    );
  }
};

const Rating = ({ totalStars = 5 }) => {
  const classes = useStyles();
  const [rated, setRated] = useState(false);
  const [rating, setRating] = useState(0);
  return (
    <>
      <Grid style={{ padding: 10 }}>
        {createArray(totalStars).map((star, idx) => (
          <MyStar
            key={`mystar-${star}-${idx}`}
            selected={rating > idx}
            onSelect={() => {
              setRating(idx + 1);
              setRated(true);
            }}
          />
        ))}
      </Grid>
      <Typography>
        {rated ? (
          <Typography
            className={classes.secondaryCaption}
            style={{ fontSize: "50px", color: "#c0392b" }}
          >
            {ratingComment[rating - 1]}
          </Typography>
        ) : (
          <Typography
            className={classes.secondaryCaption}
            style={{ fontSize: "50px", color: "#7f8c8d" }}
          >
            Click to rate the page.
          </Typography>
        )}
      </Typography>
      <TextareaAutosize
        aria-label="minimum height"
        rowsMin={5}
        style={{ width: "80%" }}
        placeholder="Some Feedbacks ..."
        colsmin={50}
      />

      <Button
        disabled={!rated}
        variant="contained"
        color="secondary"
        onClick={() => alert("Thank you! Your feedback is valuable.")}
        style={{ margin: 10, textTransform: "none" }}
      >
        <Typography className={classes.secondaryCaption} style={{ color: "#2c3e50" }}>
          Submit
        </Typography>
      </Button>
    </>
  );
};

export const ContactSection = () => {
  const classes = useStyles();

  return (
    <Grid justify="center" alignItems="center" container direction="column" id="about-us">
      <Typography className={classes.captionMargins} variant="h2" align="center">
        Contact Us
      </Typography>
      <Grid container justify="center" alignItems="baseline">
        <Grid item style={{ width: "40%" }}>
          <InfoSection data={contactInfo} />
        </Grid>
        <Grid
          item
          container
          direction="column"
          alignItems="center"
          justify="flex-start"
          className={classes.contactArea}
          style={{ maxWidth: "50%" }}
        >
          <Rating />
        </Grid>
      </Grid>
    </Grid>
  );
};
