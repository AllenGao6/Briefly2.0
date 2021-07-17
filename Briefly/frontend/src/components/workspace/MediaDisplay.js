import React, { useState } from "react";
import ControlledVideoPlayer from "../common/ControlledVideoPlayer";
import { Grid } from "@material-ui/core";

export default function MediaDisplay({ media, mediaType }) {
  const [played, setPlayed] = useState(0);

  return (
    <div
      style={{
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
      }}
    >
      <div style={{ maxWidth: 800 }}>
        <ControlledVideoPlayer
          mediaUrl={media && media[mediaType]}
          played={played}
          setPlayed={setPlayed}
        />
      </div>
    </div>
  );
}
