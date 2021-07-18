import React, { useEffect, useState, useRef } from "react";
import {
  Grid,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
  useScrollTrigger,
} from "@material-ui/core";
import clsx from "clsx";
import { darken, lighten } from "@material-ui/core/styles";
import SplitPane from "react-split-pane";
import "../../../static/css/split.css"; // do not delete!
// local component
import SummaryContent from "../workspace/SummaryContent";
import MediaDisplay from "../workspace/MediaDisplay";
import Transcripts from "../workspace/Transcripts";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 69,
    background:
      theme.palette.type === "dark" ? theme.palette.primary.main : "white",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    position: "relative",
  },
  divider: {
    background: theme.palette.type === "dark" ? "white" : "black",
  },
  contentShift: {
    marginLeft: 256,
    width: `calc(100% - ${256}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  block: {
    height: "100%",
    width: "100%",
  },
}));

export default function WorkspaceContent({
  open,
  media,
  mediaType,
  collectionId,
}) {
  const theme = useTheme();
  const classes = useStyles();
  const [played, setPlayed] = useState(0);
  const mediaRef = useRef(null);
  const canvasRef = useRef(null);
  // const [images, setImages] = useState([]);

  const matchesDark = theme.palette.type === "dark";
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));

  // const populateScreenshot = () => {
  //   return [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((time) =>
  //     handleScreenshot(time)
  //   );
  // };

  // useEffect(() => {
  //   setImages(populateScreenshot());
  // }, [mediaRef.current]);

  // const handleScreenshot = (time) => {
  //   const canvas = canvasRef.current;
  //   const player = mediaRef.current;
  //   if (!player) return null;

  //   // seek to this time
  //   player.seekTo(time);

  //   canvas.width = 160;
  //   canvas.height = 90;

  //   canvas
  //     .getContext("2d")
  //     .drawImage(player.getInternalPlayer(), 0, 0, canvas.width, canvas.height);
  //   const imageUrl = canvas.toDataURL();

  //   // reset width and height back to zero
  //   canvas.width = 0;
  //   canvas.height = 0;
  //   // re-seek the original time
  //   // player.seekTo(0);
  //   console.log(imageUrl);

  //   return imageUrl;
  // };

  return (
    <div
      className={clsx(classes.root, {
        [classes.contentShift]: open && !matchesXS,
      })}
    >
      <SplitPane
        split="vertical"
        defaultSize="50%"
        style={{
          height: "-moz-calc(100vh - 69px)",
          height: "-webkit-calc(100vh - 69px)",
          border: "15px solid #dfe4ea",
        }}
        minSize={1}
        maxSize={-46}
        primary="second"
      >
        <SplitPane
          split="horizontal"
          defaultSize="90%"
          className={classes.splitPane}
          primary="first"
          minSize={1}
          maxSize={-46}
        >
          <MediaDisplay
            media={media}
            mediaType={mediaType}
            played={played}
            setPlayed={setPlayed}
            ref={mediaRef}
          />
          <Transcripts media={media} />
        </SplitPane>
        <SummaryContent
          media={media}
          mediaType={mediaType}
          collectionId={collectionId}
          setPlayed={setPlayed}
        />
      </SplitPane>
      <canvas ref={canvasRef} />
    </div>
  );
}

{
  /*<Grid container style={{ marginTop: 20 }} spacing={3}>
        {bookmarks.map((bookmark, i) => (
          <Grid item key={i}>
            <Paper onClick={() => playerRef.current.seekTo(bookmark.time)}>
              <img crossOrigin="anonymous" src={bookmark.image} />
              <Typography>Bookmark at {bookmark.display}</Typography>
            </Paper>
          </Grid>
        ))}<canvas ref={canvasRef} />
      </Grid>*/
}
