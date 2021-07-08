import React from "react";
import ReactPlayer from "react-player";

export default function ControlledVideoPlayer() {
  return (
    <ReactPlayer
      controls
      width="600px"
      height="495px"
      url={
        "https://briefly41.s3.us-west-1.amazonaws.com/static/Collection1/video/10/earth.mp4"
      }
    />
  );
}
