import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/styles";
import PublishRoundedIcon from "@material-ui/icons/PublishRounded";
import ControlledVideoPlayer from "./ControlledVideoPlayer";
import {
  InputBase,
  FormHelperText,
  FormControl,
  TextField,
  Typography,
  Grid,
  Button,
} from "@material-ui/core";

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
  root: {
    "& label.Mui-focused": {
      color: "green",
    },
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "green",
      },
    },
  },
}));

export default function MediaUploader({
  textInput,
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
  const playerRef = useRef(null);
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return (
    <React.Fragment>
      {mediaUrl && mediaType === "video" ? (
        <ControlledVideoPlayer
          mediaUrl={mediaUrl}
          played={played}
          setPlayed={setPlayed}
          background="white"
          ref={playerRef}
        />
      ) : null}
      {mediaType === "text" ? (
        <Grid item xs={12} className={classes.padding}>
          <form
            className={classes.root}
            fullwidth="true"
            noValidate
            autoComplete="off"
          >
            <TextField
              key={`textarea_create`}
              style={{ width: "100%", justifyItems: "center" }}
              color="primary"
              value={textInput}
              onChange={onUploadFinish}
              label="Input Text"
              placeholder="Input Text Here"
              multiline
              rows={5}
              variant="outlined"
              error={false}
            />
          </form>
        </Grid>
      ) : null}
      {action === "Update" || mediaType === "text" ? null : (
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
