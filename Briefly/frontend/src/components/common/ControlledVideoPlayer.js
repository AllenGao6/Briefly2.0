import React, { useState, useRef } from "react";
import ReactPlayer from "react-player";
import {
  Typography,
  Container,
  makeStyles,
  withStyles,
  Grid,
  Button,
  IconButton,
  Slider,
  Tooltip,
  useTheme,
  Paper,
  Hidden,
} from "@material-ui/core";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import FastRewindIcon from "@material-ui/icons/FastRewind";
import FastForwardIcon from "@material-ui/icons/FastForward";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import VolumeUp from "@material-ui/icons/VolumeUp";
import VolumeOff from "@material-ui/icons/VolumeOff";
import FullScreenIcon from "@material-ui/icons/Fullscreen";
import Popover from "@material-ui/core/Popover";
import screenfull from "screenfull";

const format = (seconds) => {
  if (isNaN(seconds)) {
    return "00:00";
  }
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, "0");

  if (hh) {
    return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
  }

  return `${mm}:${ss}`;
};

const useStyles = makeStyles((theme) => ({
  playerWrapper: {
    width: "100%",
    position: "relative",
  },
  controlsWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    zIndex: 1,
  },
  controlIcons: {
    color: "#777",
    fontSize: 50,
    transform: "scale(0.9)",
    transition: "all 0.3",
    "&:hover": {
      color: "#fff",
      transform: "scale(1)",
    },
  },
  bottomIcons: {
    color: "#BBB",
    "&:hover": {
      color: "#fff",
    },
  },
  volumeSlider: {
    width: 120,
    color:
      theme.palette.type === "dark"
        ? theme.palette.common.orange
        : theme.palette.common.blue,
  },
}));

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

const PrettoSlider = withStyles((theme) => ({
  root: {
    padding: 0,
    height: 0,
    color:
      theme.palette.type === "dark"
        ? theme.palette.common.orange
        : theme.palette.common.blue,
  },
  thumb: {
    height: 16,
    width: 16,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -6,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 4,
    borderRadius: 4,
  },
  rail: {
    height: 4,
    borderRadius: 4,
  },
}))(Slider);

let count = 0;

export default function ControlledVideoPlayer({ mediaUrl, played, setPlayed }) {
  const theme = useTheme();
  const classes = useStyles();
  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const controlRef = useRef(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [seeking, setSeeking] = useState(false);
  const [timeDisplayFormat, setTimeDisplayFormat] = useState("normal");
  const [bookmarks, setBookmarks] = useState([]);
  const [fullScreen, setFullScreen] = useState(false);
  const [playing, setPlaying] = useState(false);

  const currentTime = playerRef.current
    ? playerRef.current.getCurrentTime()
    : "00:00";
  const duration = playerRef.current
    ? playerRef.current.getDuration()
    : "00:00";
  const elapesedTime =
    timeDisplayFormat === "normal"
      ? format(currentTime)
      : `-${format(duration - currentTime)}`;
  const totalDuration = format(duration);

  const secondaryColor =
    theme.palette.type === "dark"
      ? theme.palette.common.orange
      : theme.palette.common.blue;
  const mainColor =
    theme.palette.type === "dark" ? "white" : theme.palette.common.grey;

  const handlePopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 7);
  };

  const handleForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 7);
  };

  const handleVolumeChange = (e, newValue) => {
    setVolume(parseFloat(newValue / 100));
    setMuted(newValue === 0 ? true : false);
  };

  const handleVolumeSeekUp = (e, newValue) => {
    setVolume(parseFloat(newValue / 100));
    setMuted(newValue === 0 ? true : false);
  };

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate);
  };

  const handleToggleFullScreen = () => {
    screenfull.toggle(playerContainerRef.current);
    setFullScreen(!fullScreen);
  };

  const handleProgress = (changeState) => {
    const { played } = changeState;
    if (count > 3) {
      controlRef.current.style.visibility = "hidden";
      count = 0;
    }
    if (controlRef.current.style.visibility == "visible") {
      count += 1;
    }

    if (!seeking) setPlayed(played);
  };

  const handleSeekChange = (e, newValue) => {
    setPlayed(parseFloat(newValue / 100));
  };

  const handleSeekMouseDown = (e) => {
    setSeeking(true);
  };

  const handleSeekMouseUp = (e, newValue) => {
    setSeeking(false);
    setPlayed(parseFloat(newValue / 100));
    playerRef.current.seekTo(newValue / 100);
  };

  const handleChangeDisplayFormat = () => {
    setTimeDisplayFormat(
      timeDisplayFormat === "normal" ? "remaining" : "normal"
    );
  };

  const handleMouseMove = () => {
    controlRef.current.style.visibility = "visible";
    count = 0;
  };

  const addBookmark = () => {
    const canvas = canvasRef.current;
    canvas.width = 160;
    canvas.height = 90;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      playerRef.current.getInternalPlayer(),
      0,
      0,
      canvas.width,
      canvas.height
    );
    const imageUrl = canvas.toDataURL();
    canvas.width = 0;
    canvas.height = 0;

    setBookmarks([
      ...bookmarks,
      { time: currentTime, display: elapesedTime, image: imageUrl },
    ]);
  };

  const open = Boolean(anchorEl);
  const id = open ? "playbackrate-popover" : undefined;

  return (
    <Container>
      <Grid
        ref={playerContainerRef}
        container
        className={classes.playerWrapper}
        onMouseMove={handleMouseMove}
        style={{
          background: fullScreen
            ? "black"
            : theme.palette.type === "dark"
            ? theme.palette.primary.main.light
            : "white",
        }}
      >
        {/* React Player */}　
        <ReactPlayer
          ref={playerRef}
          volume={volume}
          url={mediaUrl}
          width="100%"
          height="100%"
          muted={muted}
          playing={playing}
          playbackRate={playbackRate}
          onProgress={handleProgress}
          config={{
            file: {
              attributes: {
                crossOrigin: "anonymous",
              },
            },
          }}
        />
        {/* Player Control */}
        <div className={classes.controlsWrapper} ref={controlRef}>
          {/* Control Header */}
          <Grid
            container
            alignItems="center"
            justify="space-between"
            style={{ padding: 16, paddingTop: "2rem" }}
          >
            <Grid item>
              <Typography variant="h4" style={{ color: "white" }}>
                Make More Time!
              </Typography>
            </Grid>
            <Hidden xsDown>
              <Grid item>
                <Button
                  onClick={addBookmark}
                  variant="contained"
                  style={{ color: "white", background: secondaryColor }}
                  startIcon={<BookmarkIcon />}
                >
                  Bookmark
                </Button>
              </Grid>
            </Hidden>
          </Grid>
          {/* Control Middle */}
          <Grid container alignItems="center" justify="center">
            <IconButton onClick={handleRewind} className={classes.controlIcons}>
              <FastRewindIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              onClick={() => setPlaying(!playing)}
              className={classes.controlIcons}
            >
              {playing ? (
                <PauseIcon fontSize="inherit" />
              ) : (
                <PlayArrowIcon fontSize="inherit" />
              )}
            </IconButton>
            <IconButton
              onClick={handleForward}
              className={classes.controlIcons}
            >
              <FastForwardIcon fontSize="inherit" />
            </IconButton>
          </Grid>
          {/* Control Bottom */}
          <Grid
            item
            container
            justify="space-between"
            alignItems="center"
            style={{ padding: "1rem", paddingBottom: 0 }}
          >
            {/* Video Slider */}
            <Grid item xs={12} style={{ paddingBottom: 0 }}>
              <PrettoSlider
                min={0}
                max={100}
                value={played * 100}
                ValueLabelComponent={(props) => (
                  <ValueLabelComponent {...props} value={elapesedTime} />
                )}
                onChange={handleSeekChange}
                onMouseDown={handleSeekMouseDown}
                onChangeCommitted={handleSeekMouseUp}
              />
            </Grid>
            {/* Other Controls (can be fully customized) */}
            <Grid item>
              <Grid container alignItems="center">
                <IconButton
                  onClick={() => setPlaying(!playing)}
                  className={classes.bottomIcons}
                >
                  {playing ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
                <Hidden xsDown>
                  <IconButton
                    onClick={() => setMuted(!muted)}
                    className={classes.bottomIcons}
                  >
                    {muted ? <VolumeOff /> : <VolumeUp />}
                  </IconButton>
                  <Slider
                    min={0}
                    max={100}
                    value={volume * 100}
                    className={classes.volumeSlider}
                    onChange={handleVolumeChange}
                    onChangeCommitted={handleVolumeSeekUp}
                  />
                </Hidden>
                <Button
                  onClick={handleChangeDisplayFormat}
                  variant="text"
                  className={classes.bottomIcons}
                  style={{ marginLeft: 16 }}
                >
                  {elapesedTime}/{totalDuration}
                </Button>
              </Grid>
            </Grid>
            <Grid item style={{ paddingBottom: 0 }}>
              <Grid container alignItems="center">
                <Button
                  variant="text"
                  className={classes.bottomIcons}
                  onClick={handlePopover}
                >
                  {playbackRate}X
                </Button>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  style={{ zIndex: 999999999 }}
                >
                  <Grid container direction="column-reverse">
                    {[0.5, 1.0, 1.5, 2.0].map((rate, i) => (
                      <React.Fragment>
                        <Button
                          onClick={() => handlePlaybackRateChange(rate)}
                          variant="text"
                          key={`rate-${rate}-${i}-key-button`}
                        >
                          <Typography
                            style={{
                              color:
                                playbackRate === rate
                                  ? secondaryColor
                                  : mainColor,
                            }}
                          >
                            {rate} X
                          </Typography>
                        </Button>
                      </React.Fragment>
                    ))}
                  </Grid>
                </Popover>
                <IconButton
                  onClick={handleToggleFullScreen}
                  className={classes.bottomIcons}
                >
                  <FullScreenIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Grid>
      {/*<Grid container style={{ marginTop: 20 }} spacing={3}>
        {bookmarks.map((bookmark, i) => (
          <Grid item key={i}>
            <Paper onClick={() => playerRef.current.seekTo(bookmark.time)}>
              <img crossOrigin="anonymous" src={bookmark.image} />
              <Typography>Bookmark at {bookmark.display}</Typography>
            </Paper>
          </Grid>
        ))}
        <canvas ref={canvasRef} />
      </Grid>*/}
    </Container>
  );
}
