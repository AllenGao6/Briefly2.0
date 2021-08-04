import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/styles";
import {
  Divider,
  Typography,
  Grid,
  Button,
  ListItem,
  List,
} from "@material-ui/core";
import { lighten, darken } from "@material-ui/core/styles";

import { connect } from "react-redux";
import { seekTo } from "../../redux/actions/player_actions";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    overflow: "auto",
    height: "100%",
    scrollbarColor: "dark",
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
  text: {
    color: theme.palette.type === "dark" ? "white" : theme.palette.common.grey,
    lineHeight: 1.4,
  },
  timestampButton: {
    color: "white",
    background: theme.palette.common.blue,
    padding: "3px 8px",
    borderRadius: 8,
    "&:hover": {
      background: darken(theme.palette.common.green, 0.2),
    },
  },
  transcriptContainer: {
    background:
      theme.palette.type === "dark"
        ? "rgb(81, 81, 81)"
        : theme.palette.common.cloud,
    borderRadius: 8,
    cursor: "pointer",
    transition: "all 0.2s",
    paddingLeft: 10,
    paddingRight: 10,
    "&:hover": {
      background:
        theme.palette.type === "dark"
          ? lighten("rgb(81, 81, 81)", 0.1)
          : darken(theme.palette.common.cloud, 0.1),
    },
  },
  divider: {
    background: theme.palette.type === "dark" ? "white" : "black",
    width: "100%",
  },
}));

function TranscriptList({ audioText, seekTo }) {
  const classes = useStyles();
  const theme = useTheme();
  // console.log(audioText);

  return (
    <List className={classes.root}>
      {audioText
        .sort((a, b) => a.time - b.time)
        .map((audio_text, i) => (
          <ListItem
            key={audio_text.id}
            dense={true}
            style={{ paddingLeft: 10, paddingRight: 10 }}
          >
            <Grid
              container
              direction="row"
              onClick={() => seekTo(audio_text.time)}
              className={classes.transcriptContainer}
            >
              {/* <Grid container justify="flex-end" alignItems="center">
                <Grid item>
                  <Button
                    variant="contained"
                    className={classes.timestampButton}
                    onClick={() => seekTo(audio_text.time)}
                  >
                    {audio_text.displayed_time.slice(
                      1,
                      audio_text.displayed_time.length - 1
                    )}
                  </Button>
                </Grid>
              </Grid> */}
              <Grid item style={{ paddingBottom: 10, paddingTop: 10 }}>
                <Typography variant="h6" className={classes.text}>
                  {audio_text.sentence}
                </Typography>
              </Grid>
              {/* <Grid item container justify="center">
                <Divider variant="middle" className={classes.divider} />
              </Grid> */}
            </Grid>
          </ListItem>
        ))}
    </List>
  );
}
function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = {
  seekTo,
};

export default connect(mapStateToProps, mapDispatchToProps)(TranscriptList);
