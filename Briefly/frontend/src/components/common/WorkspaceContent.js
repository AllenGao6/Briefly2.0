import React, { useRef } from "react";
import {
  Grid,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
  useScrollTrigger,
  Button,
} from "@material-ui/core";
import clsx from "clsx";
import SplitPane from "react-split-pane";
import "../../../static/css/split.css"; // do not delete!
// local component
import SummaryContent from "../workspace/SummaryContent";
import MediaDisplay from "../workspace/MediaDisplay";
import Transcripts from "../workspace/Transcripts";
import ReactPlayer from "react-player";

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
  const mediaRef = useRef(null);
  const invisiblePlayerRef = useRef(null);

  let getScreenshotFunc = null;

  const matchesDark = theme.palette.type === "dark";
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));

  const handleScreenshot = (time, imageRef, canvasRef) => {
    const player = invisiblePlayerRef.current;
    player.seekTo(time);
    // store event listener function into a global variable
    getScreenshotFunc = () => handleSeeked(imageRef, canvasRef);
    player.getInternalPlayer().addEventListener("seeked", getScreenshotFunc);
  };

  // player.seekTo() is async, so we have to create a calback function to create screenshot
  const handleSeeked = (imageRef, canvasRef) => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    const player = invisiblePlayerRef.current;

    canvas.width = player.getInternalPlayer().videoWidth;
    canvas.height = player.getInternalPlayer().videoHeight;

    canvas
      .getContext("2d")
      .drawImage(player.getInternalPlayer(), 0, 0, canvas.width, canvas.height);

    image.src = canvas.toDataURL("image/png");
    // canvas.toBlob((blob) => {
    //   image.src = URL.createObjectURL(blob);
    // });

    // reset width and height back to zero
    canvas.width = 0;
    canvas.height = 0;

    // remove event listener to prevent other screenshot been updated (important)
    player.getInternalPlayer().removeEventListener("seeked", getScreenshotFunc);
    getScreenshotFunc = null;
  };

  if (!media) return <div></div>;
  if (mediaType === "text") {
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
            border: matchesDark ? "15px solid #515151" : "15px solid #dfe4ea",
            boxSizing: "border-box",
          }}
          minSize={1}
          maxSize={-46}
          primary="second"
          resizerStyle={{
            backgroundColor: matchesDark ? "#515151" : null,
          }}
        >
          <MediaDisplay media={media} mediaType={mediaType} ref={mediaRef} />
          <SummaryContent
            media={media}
            mediaType={mediaType}
            collectionId={collectionId}
            getScreenshot={handleScreenshot}
          />
        </SplitPane>
      </div>
    );
  } else {
    return (
      <div
        className={clsx(classes.root, {
          [classes.contentShift]: open && !matchesXS,
        })}
      >
        <ReactPlayer
          ref={invisiblePlayerRef}
          url={media[mediaType]}
          style={{ display: "none" }}
          config={{
            file: {
              attributes: {
                crossOrigin: "anonymous",
              },
            },
          }}
        />
        <SplitPane
          split="vertical"
          defaultSize="40%"
          style={{
            height: "-moz-calc(100vh - 69px)",
            height: "-webkit-calc(100vh - 69px)",
            border: matchesDark ? "15px solid #515151" : "15px solid #dfe4ea",
            boxSizing: "border-box",
          }}
          minSize={1}
          maxSize={-46}
          primary="second"
          resizerStyle={{
            backgroundColor: matchesDark ? "#515151" : null,
          }}
        >
          <SplitPane
            split="horizontal"
            defaultSize="50%"
            className={classes.splitPane}
            primary="first"
            minSize={1}
            maxSize={-17}
            resizerStyle={{
              backgroundColor: matchesDark ? "#515151" : null,
            }}
          >
            <MediaDisplay media={media} mediaType={mediaType} ref={mediaRef} />
            <Transcripts media={media} />
          </SplitPane>
          <SummaryContent
            media={media}
            mediaType={mediaType}
            collectionId={collectionId}
            getScreenshot={handleScreenshot}
          />
        </SplitPane>
      </div>
    );
  }
}
