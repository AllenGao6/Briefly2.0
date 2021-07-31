import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/styles";
import {
  InputBase,
  FormHelperText,
  FormControl,
  Collapse,
  Divider,
  Typography,
  Grid,
  Button,
  useMediaQuery,
  ListItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
} from "@material-ui/core";
import { darken } from "@material-ui/core/styles";

import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PublishIcon from "@material-ui/icons/Publish";

import { connect } from "react-redux";
import { seekTo } from "../../redux/actions/player_actions";

const useStyles = makeStyles((theme) => ({
  divider: {
    background: theme.palette.type === "dark" ? "white" : "black",
  },
  text: {
    color: theme.palette.type === "dark" ? "white" : theme.palette.common.grey,
    lineHeight: 1.4,
  },
  secondary: {
    marginRight: "1rem",
    "& .MuiTypography-colorTextSecondary": {
      color: "white",
      background: theme.palette.common.green,
      padding: "3px 8px",
      borderRadius: 8,
      marginTop: 5,
    },
    "& .MuiTypography-displayBlock": {
      display: "inline-block",
    },
  },
  timestampButton: {
    color: "white",
    background: theme.palette.common.green,
    padding: "3px 8px",
    borderRadius: 8,
    "&:hover": {
      background: darken(theme.palette.common.green, 0.2),
    },
  },
  icon: {
    color:
      theme.palette.type === "dark"
        ? theme.palette.common.orange
        : theme.palette.common.blue,
    fontSize: "1.75rem",
  },
  summaryText: {
    border: "1px solid",
    borderRadius: 5,
    borderColor:
      theme.palette.type === "dark"
        ? theme.palette.common.orange
        : theme.palette.common.blue,
    padding: 5,
  },
  deleteButton: {
    color: theme.palette.common.red,
  },
  editButton: {
    color: theme.palette.common.blue,
  },
}));

function BulletPoint({
  transcript,
  onTranscriptChange,
  onTranscriptDelete,
  seekTo,
  getScreenshot,
  mediaType,
}) {
  const classes = useStyles();
  const theme = useTheme();
  // reference
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  // constant
  const time = transcript.time;
  // local states
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [summary, setSummary] = useState(transcript.sentence);
  const [editable, setEditable] = useState(false);

  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));
  const matchesDark = theme.palette.type === "dark";

  const handleToggleScreenshot = () => {
    setOpen(!open);
    if (imageRef.current === null) getScreenshot(time, imageRef, canvasRef);
  };

  const handleDelete = () => {
    onTranscriptDelete(transcript);
  };

  const handleEdit = () => {
    if (editable) handleSummaryContentChange();
    setEditable(!editable);
  };

  const handleSummaryContentChange = () => {
    onTranscriptChange(transcript, summary);
  };

  return (
    <React.Fragment>
      <ListItem dense={true}>
        <Grid container direction="column">
          <Grid item container justify="space-between" alignItems="center">
            <Grid item>
              <Button
                variant="contained"
                className={classes.timestampButton}
                onClick={() => seekTo(time)}
              >
                {transcript.displayed_time.slice(
                  1,
                  transcript.displayed_time.length - 1
                )}
              </Button>
            </Grid>
            <Grid item>
              <IconButton
                onClick={() => setOpenDialog(true)}
                className={classes.deleteButton}
              >
                <Tooltip title="Delete" arrow>
                  <DeleteIcon />
                </Tooltip>
              </IconButton>
              <IconButton
                onClick={handleEdit}
                className={classes.editButton}
                disabled={summary.trim().length === 0}
              >
                {editable ? (
                  <Tooltip title="Update">
                    <PublishIcon />
                  </Tooltip>
                ) : (
                  <Tooltip title="Edit">
                    <EditIcon />
                  </Tooltip>
                )}
              </IconButton>
            </Grid>
          </Grid>
          <Grid item style={{ paddingTop: 5, lineHeight: 0.5 }}>
            {editable ? (
              <FormControl fullWidth>
                <InputBase
                  aria-describedby="summary-helper-text"
                  value={summary}
                  fullWidth
                  multiline
                  onChange={(e) => setSummary(e.currentTarget.value)}
                  className={classes.summaryText}
                />
                {summary.trim().length === 0 ? (
                  <FormHelperText
                    id="summary-helper-text"
                    style={{ color: theme.palette.common.red }}
                  >
                    Summary content must not be empty!
                  </FormHelperText>
                ) : undefined}
              </FormControl>
            ) : (
              <Typography variant="h6" className={classes.text}>
                {transcript.sentence}
              </Typography>
            )}
          </Grid>
        </Grid>
      </ListItem>
      {mediaType === "video" ? <Grid container justify="center">
        <IconButton
          onClick={handleToggleScreenshot}
          style={{ padding: 0, paddingBottom: 5 }}
        >
          {open ? (
            <ExpandLessIcon className={classes.icon} />
          ) : (
            <ExpandMoreIcon className={classes.icon} />
          )}
        </IconButton>
      </Grid> : null}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Grid
          container
          justify="center"
          alignItems="center"
          style={{ paddingLeft: 16, paddingRight: 16, paddingBottom: 16 }}
        >
          <Grid item>
            <img
              ref={imageRef}
              alt="default"
              crossOrigin="anonymous"
              style={{ objectFit: "cover", width: "100%", borderRadius: 10 }}
            />
          </Grid>
        </Grid>
      </Collapse>
      <Divider variant="middle" className={classes.divider} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        fullScreen={matchesXS}
        maxWidth="sm"
      >
        <DialogTitle style={{ paddingBottom: 8 }}>
          <Typography variant="h5">Confirmation</Typography>
        </DialogTitle>
        <Divider variant="middle" classes={{ root: classes.divider }} />
        <DialogContent style={{ height: 50 }}>
          <Typography
            variant="h6"
            style={{
              fontSize: "1.2rem",
              color: matchesDark ? "white" : theme.palette.common.grey,
            }}
          >
            Are you sure you want to delete this summarized point?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            color={matchesDark ? "secondary" : "primary"}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpenDialog(false);
              handleDelete();
            }}
            style={{ color: theme.palette.common.red }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = {
  seekTo,
};

export default connect(mapStateToProps, mapDispatchToProps)(BulletPoint);
