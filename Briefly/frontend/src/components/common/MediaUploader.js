import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/styles";
import { Button, Grid } from "@material-ui/core";
import PublishRoundedIcon from "@material-ui/icons/PublishRounded";
import ControlledVideoPlayer from "./ControlledVideoPlayer";

const useStyles = makeStyles((theme) => ({
  uploadButton: {
    width: "100%",
    transition: "all 0.3s",
    "&:hover": {
      background:
        theme.palette.type === "dark"
          ? theme.palette.common.orange
          : theme.palette.common.blue,
    },
  },
  padding: {
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: "1rem",
  },
}));

export default function MediaUploader({
  mediaType,
  onUploadFinish,
  isCreating,
  action,
  mediaUrl,
}) {
  const fileInputRef = useRef(null);
  const classes = useStyles();
  // controlling state for video player
  const [played, setPlayed] = useState(0);

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <React.Fragment>
      {mediaUrl ? (
        <ControlledVideoPlayer
          mediaUrl={mediaUrl}
          played={played}
          setPlayed={setPlayed}
        />
      ) : null}
      {action === "Update" ? null : (
        <Grid item xs={12} className={classes.padding}>
          <input
            type="file"
            style={{ display: "none" }}
            ref={fileInputRef}
            accept={`${mediaType}/*`}
            onChange={onUploadFinish}
          />
          <Button
            variant="outlined"
            onClick={() => fileInputRef.current.click()}
            className={classes.uploadButton}
            disabled={isCreating}
          >
            <PublishRoundedIcon
              style={{ fontSize: "2.5rem", paddingRight: "1rem" }}
            />
            {`Upload ${capitalize(mediaType)}`}
          </Button>
        </Grid>
      )}
    </React.Fragment>
  );
}

/*
    (e) => {
          // setImageUrl(URL.createObjectURL(e.target.files[0]));
          // setImageFile(e.target.files[0]);
        }
    */
