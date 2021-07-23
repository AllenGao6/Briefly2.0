import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import BulletPoint from "./BulletPoint";

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: "scroll",
    height: "-moz-calc(100vh - 99px - 48px - 60px - 30px)",
    height: "-webkit-calc(100vh - 99px - 48px - 60px - 30px)",
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

export default function BulletPointList({
  transcripts,
  getScreenshot,
  onTranscriptChange,
  onTranscriptDelete,
}) {
  const classes = useStyles();

  return (
    <List className={classes.root} disablePadding>
      {transcripts
        .sort((a, b) => a.time - b.time)
        .map((transcript, i) => (
          <BulletPoint
            key={`$bullet-point-${transcript.id}-${i}`}
            transcript={transcript}
            onTranscriptChange={onTranscriptChange}
            onTranscriptDelete={onTranscriptDelete}
            getScreenshot={getScreenshot}
          />
        ))}
    </List>
  );
}
