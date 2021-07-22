import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { useTheme } from "@material-ui/styles";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Typography, Grid, Button } from "@material-ui/core";
import { Divider } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import { darken, lighten } from "@material-ui/core/styles";
import defaultImage from "../../assets/dummy/book.png";

import { connect } from "react-redux";
import { seekTo } from "../../redux/actions/player_actions";

const useStyles = makeStyles((theme) => ({
  divider: {
    background: theme.palette.type === "dark" ? "white" : "black",
  },
  text: {
    color: theme.palette.type === "dark" ? "white" : theme.palette.common.grey,
    lineHeight: 1.4,
  },
  secondary: {
    marginRight: "1rem",
    "& .MuiTypography-colorTextSecondary": {
      color: "white",
      background: theme.palette.common.green,
      padding: "3px 8px",
      borderRadius: 8,
      marginTop: 5,
    },
    "& .MuiTypography-displayBlock": {
      display: "inline-block",
    },
  },
  timestampButton: {
    color: "white",
    background: theme.palette.common.green,
    padding: "3px 8px",
    borderRadius: 8,
    "&:hover": {
      background: darken(theme.palette.common.green, 0.2),
    },
  },
  icon: {
    color:
      theme.palette.type === "dark"
        ? theme.palette.common.orange
        : theme.palette.common.blue,
    fontSize: "1.75rem",
  },
}));

function BulletPoint({ transcript, time, seekTo, getScreenshot }) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  const handleClick = () => {
    setOpen(!open);
    if (imageRef.current === null) getScreenshot(time, imageRef, canvasRef);
  };

  transcript = {
    id: 1,
    displayed_time: "00:05:24",
    time: 0.2,
    sentence:
      "Briefly will win the challenge. Will win the challenge. Win the challenge. The challenge. Challenge. <null>. Briefly will win the challenge. Will win the challenge. Win the challenge.",
  };

  return (
    <React.Fragment>
      <ListItem dense={true}>
        <Grid container direction="column">
          <Grid item container justify="space-between" alignItems="center">
            <Grid item>
              <Button
                variant="contained"
                className={classes.timestampButton}
                onClick={() => seekTo(time)}
              >
                {transcript.displayed_time}
              </Button>
            </Grid>
            <Grid item>
              <IconButton>
                <DeleteIcon style={{ color: theme.palette.common.red }} />
              </IconButton>
              <IconButton>
                <EditIcon style={{ color: theme.palette.common.blue }} />
              </IconButton>
            </Grid>
          </Grid>
          <Grid item style={{ paddingTop: 5 }}>
            <Typography variant="h6" className={classes.text}>
              {transcript.sentence}
            </Typography>
          </Grid>
        </Grid>
      </ListItem>
      <Grid container justify="center">
        <IconButton
          onClick={handleClick}
          style={{ padding: 0, paddingBottom: 5 }}
        >
          {open ? (
            <ExpandLessIcon className={classes.icon} />
          ) : (
            <ExpandMoreIcon className={classes.icon} />
          )}
        </IconButton>
      </Grid>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Grid
          container
          justify="center"
          alignItems="center"
          style={{ paddingLeft: 16, paddingRight: 16, paddingBottom: 16 }}
        >
          <Grid item>
            <img
              ref={imageRef}
              alt="default"
              crossOrigin="anonymous"
              style={{ objectFit: "cover", width: "100%", borderRadius: 10 }}
            />
          </Grid>
        </Grid>
      </Collapse>
      <Divider variant="middle" className={classes.divider} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </React.Fragment>
  );
}

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = {
  seekTo,
};

export default connect(mapStateToProps, mapDispatchToProps)(BulletPoint);
