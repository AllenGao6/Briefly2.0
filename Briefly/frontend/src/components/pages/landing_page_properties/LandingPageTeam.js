import { makeStyles } from "@material-ui/styles";
import { Paper, Grid, Typography, CardMedia } from "@material-ui/core";
import { teamInfo } from "./data.js";
import stack from "../../../assets/background/stack.jpg";
import React from "react";

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
  captionMargins: {
    marginTop: "100px",
    marginBottom: "50px",
    fontSize: "45px",
  },
  teamContainer: {
    width: "80%",
  },
  teamMemberStrip: {
    marginBottom: "50px",
    backgroundColor: theme.palette.common.silver,
  },
}));

const MemberInfoStrip = (props) => {
  const classes = useStyles();
  return (
    <Grid
      justify="center"
      alignItems="flex-start"
      direction={props.reversed ? "row-reverse" : "row"}
      style={{ marginBottom: 50 }}
      container
    >
      <Grid item align-self="flex-start">
        <Paper>
          <CardMedia
            component="img"
            alt="profile image"
            image={props.memberInfo.headImage}
            title={props.memberInfo.name}
            height="auto"
            width="auto"
            style={{
              minHeight: "280px",
              minWidth: "280px",
              maxHeight: "280px",
              maxWidth: "280px",
            }}
          ></CardMedia>
        </Paper>
      </Grid>
      <Grid item style={{ width: 50 }}></Grid>
      <Grid
        item
        container
        direction="column"
        style={{ width: "60%", padding: 40, borderRadius: "20px" }}
        className={classes.teamMemberStrip}
      >
        <Typography className={classes.secondaryCaption} style={{ fontSize: "3rem" }}>
          {props.memberInfo.name}
        </Typography>
        <Typography className={classes.emphasizedBody1} style={{ fontSize: "1.2rem" }}>
          {props.memberInfo.description}
        </Typography>
      </Grid>
    </Grid>
  );
};

export const TeamSection = () => {
  const classes = useStyles();
  return (
    <Grid justify="center" alignItems="center" container direction="column" id="team">
      <Grid item className={classes.teamContainer}>
        <Typography className={classes.captionMargins} variant="h2" align="center">
          Team
        </Typography>
        <Grid container justify="center" direction="column">
          {teamInfo.map((memberInfo, idx) => (
            <MemberInfoStrip
              key={`${memberInfo}-${idx}`}
              reversed={idx % 2 === 1}
              memberInfo={memberInfo}
            />
          ))}
        </Grid>
      </Grid>
      <Grid item className={classes.teamContainer}>
        <Typography className={classes.captionMargins} variant="h2" align="center">
          Technical Stacks
        </Typography>
        <Grid container justify="center" direction="column">
          <img src={stack} alt="tech stack" style={{ width: "100%", height: "100%" }} />
        </Grid>
      </Grid>
    </Grid>
  );
};
