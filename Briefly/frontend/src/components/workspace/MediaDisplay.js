import React, { useState, forwardRef, useEffect } from "react";
import ControlledVideoPlayer from "../common/ControlledVideoPlayer";
import { Grid, Divider, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/styles";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 530,
    width: "100%",
    minHeight: 270,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background:
      theme.palette.type === "dark"
        ? theme.palette.common.grey
        : theme.palette.common.cloud,
    flexDirection: "column",
  },
  divider: {
    background: theme.palette.type === "dark" ? "white" : "black",
    width: "90%",
    marginTop: 10,
  },
}));

function MediaDisplay({ media, mediaType, seekTime }, mediaRef) {
  const theme = useTheme();
  const classes = useStyles();
  const [played, setPlayed] = useState(0);

  useEffect(() => {
    setPlayed(seekTime);
    if (mediaRef.current) mediaRef.current.seekTo(seekTime);
  }, [seekTime]);

  if (!media) return <div className={classes.root}></div>;
  return (
    <div className={classes.root}>
      <Typography variant="h4">{media.title}</Typography>
      <Divider variant="middle" className={classes.divider} />
      <ControlledVideoPlayer
        mediaUrl={media[mediaType]}
        played={played}
        setPlayed={setPlayed}
        background={theme.palette.common.cloud}
        ref={mediaRef}
      />
    </div>
  );
}

const ForwardMediaDisplay = forwardRef(MediaDisplay);

function mapStateToProps(state) {
  return {
    seekTime: state.playerReducer.seekTime,
  };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(ForwardMediaDisplay);
