import React, { useState } from "react";
import {
  Grid,
  Tabs,
  Tab,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  Input,
  Divider,
  useMediaQuery,
  TextField,
  Checkbox,
  Paper,
  IconButton,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/styles";
import EmptyIcon from "@material-ui/icons/HourglassEmpty";
import ResetIcon from "@material-ui/icons/Cached";
import AddIcon from "@material-ui/icons/AddBoxOutlined";
import BulletPointList from "../common/BulletPointList";
import { connect } from "react-redux";
import { summarizeMedia } from "../../redux/actions/summarize_actions";
import {
  loadVideosInCollection,
  updateVideoInCollection,
  resetVideoSummarization,
} from "../../redux/actions/video_actions";
import {
  loadAudiosInCollection,
  updateAudioInCollection,
  resetAudioSummarization,
} from "../../redux/actions/audio_actions";

const useStyles = makeStyles((theme) => {
  const matchesDark = theme.palette.type === "dark";

  return {
    tabContainer: {
      background: matchesDark ? theme.palette.primary.dark : "white",
      width: "100%",
      color: matchesDark ? "white" : undefined,
    },
    tab: {
      fontWeight: 800,
    },
    sectionContainer: {
      background: matchesDark
        ? theme.palette.primary.main
        : theme.palette.common.cloud,
      height: "-moz-calc(100vh - 99px - 48px)",
      height: "-webkit-calc(100vh - 99px - 48px)",
    },
    icon: {
      color: matchesDark ? "white" : theme.palette.common.grey,
    },
    container: {
      display: "flex",
      flexWrap: "wrap",
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    divider: {
      background: theme.palette.type === "dark" ? "white" : "black",
    },
    cardOutline: {
      width: "100%",
      paddingLeft: 15,
      paddingRight: 15,
      paddingTop: 5,
      paddingBottom: 5,
    },
    summaryStatus: {
      padding: 10,
      borderRadius: 15,
    },
    text: {
      color: matchesDark ? "white" : theme.palette.common.grey,
    },
    specialText: {
      fontStyle: "italic",
      color: matchesDark
        ? theme.palette.common.orange
        : theme.palette.common.blue,
      paddingLeft: "0.5rem",
      fontWeight: 1000,
    },
  };
});

function SummaryContent({
  media,
  mediaType,
  collectionId,
  summarizeMedia,
  loadVideosInCollection,
  loadAudiosInCollection,
  updateVideoInCollection,
  updateAudioInCollection,
  resetVideoSummarization,
  resetAudioSummarization,
  getScreenshot,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const matchesDark = theme.palette.type === "dark";
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));

  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [numSentences, setNumSentences] = useState(5);
  const [optimalSentence, setOptimalSentence] = useState(false);
  const [modelType, setModelType] = useState(0);

  const updateMediaInCollection = async (id, media, mediaId) => {
    switch (mediaType) {
      case "video":
        await updateVideoInCollection(id, media, mediaId);
        break;
      case "audio":
        await updateAudioInCollection(id, media, mediaId);
        break;
      case "text":
      default:
        break;
    }
  };

  const resetMediaSummarization = async (id, mediaId) => {
    switch (mediaType) {
      case "video":
        await resetVideoSummarization(id, mediaId);
        break;
      case "audio":
        await resetAudioSummarization(id, mediaId);
        break;
      case "text":
      default:
        break;
    }
  };

  const handleTranscriptChange = (transcript, summary) => {
    const transcripts = JSON.parse(media.summarization);
    const newTranscripts = [
      ...transcripts.filter((item) => item.id !== transcript.id),
      { ...transcript, sentence: summary.trim() },
    ];
    const newMedia = {
      summarization: JSON.stringify(newTranscripts),
    };
    updateMediaInCollection(collectionId, newMedia, media.id);
  };

  const handleTranscriptDelete = (transcript) => {
    const transcripts = JSON.parse(media.summarization);
    const newTranscripts = transcripts.filter(
      (item) => item.id !== transcript.id
    );
    const newMedia = {
      summarization: JSON.stringify(newTranscripts),
    };
    updateMediaInCollection(collectionId, newMedia, media.id);
    console.log("handleTranscriptDelete");
  };

  const handleTranscriptReset = () => {
    resetMediaSummarization(collectionId, media.id);
  };

  const handleAddTranscript = (time, display_time, sentence) => {
    const transcripts = JSON.parse(media.summarization);
    let id = 0;
    transcripts.forEach((transcript) => {
      if (transcript.id >= id) id = transcript.id + 1;
    });
    transcripts.push({
      id: id,
      sentence: sentence,
      time: time,
      display_time: `[${display_time}]`,
    });
    const newMedia = {
      summarization: JSON.stringify(transcripts),
    };
    updateMediaInCollection(collectionId, newMedia, media.id);
  };

  const summarize = async () => {
    const summaryConfig = {
      model: getModelType(),
      num_sentence: optimalSentence ? null : numSentences,
    };
    const summary = await summarizeMedia(
      collectionId,
      media.id,
      mediaType,
      summaryConfig
    );
    if (summary) {
      switch (mediaType) {
        case "video":
          loadVideosInCollection(collectionId);
          break;
        case "audio":
          loadAudiosInCollection(collectionId);
          break;
        case "text":
        default:
          break;
      }
    }
  };

  const handleTabChange = (e, value) => {
    setValue(value);
  };

  const handleModelTypeChange = (event) => {
    setModelType(Number(event.target.value));
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getModelType = () => {
    switch (modelType) {
      case 1:
        return "Bert";
      case 2:
        return "GPT-2";
      case 3:
        return "XLNet";
      default:
        return "Bert";
    }
  };

  const Summary = () => {
    if (!media.is_summarized) {
      return (
        <React.Fragment>
          <Grid item>
            <EmptyIcon
              className={classes.icon}
              style={{ width: "7rem", height: "7rem" }}
            />
          </Grid>
          <Grid item>
            <Typography variant="h5">No summarization yet.</Typography>
          </Grid>
          <Grid item style={{ marginTop: "1.5rem" }}>
            <Button
              variant="contained"
              color={matchesDark ? "secondary" : "primary"}
              style={{ color: "white" }}
              onClick={handleClickOpen}
            >
              Start Summarization
            </Button>
          </Grid>
        </React.Fragment>
      );
    } else {
      return (
        <Grid
          item
          container
          className={classes.summaryStatus}
          direction="column"
        >
          <Grid item style={{ height: 60 }}>
            <Paper className={classes.cardOutline}>
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <Grid item container direction="column">
                    <Grid item container alignItems="center">
                      <Typography variant="h6" className={classes.text}>
                        Model Type:
                      </Typography>
                      <Typography variant="h6" className={classes.specialText}>
                        {media.model_type}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      container
                      alignItems="center"
                      style={{ marginTop: 5 }}
                    >
                      <Typography variant="h6" className={classes.text}>
                        Bullet Points:
                      </Typography>
                      <Typography variant="h6" className={classes.specialText}>
                        {media.num_sentences}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <IconButton onClick={handleTranscriptReset}>
                    <ResetIcon className={classes.icon} />
                  </IconButton>
                  <IconButton onClick={handleAddTranscript}>
                    <AddIcon className={classes.icon} />
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item>
            <Paper
              className={classes.cardOutline}
              style={{
                marginTop: 10,
                padding: 0,
              }}
            >
              <BulletPointList
                transcripts={JSON.parse(media.summarization)}
                getScreenshot={getScreenshot}
                onTranscriptChange={handleTranscriptChange}
                onTranscriptDelete={handleTranscriptDelete}
              />
            </Paper>
          </Grid>
        </Grid>
      );
    }
  };

  return (
    <Grid container direction="column" style={{ minWidth: 300 }}>
      <Grid item container>
        <Tabs
          value={value}
          onChange={handleTabChange}
          className={classes.tabContainer}
          indicatorColor={matchesDark ? "secondary" : "primary"}
        >
          <Tab className={classes.tab} label="Summary"></Tab>
          <Tab className={classes.tab} label="Pop Quiz"></Tab>
          <Tab className={classes.tab} label="More..."></Tab>
        </Tabs>
      </Grid>
      <Grid
        item
        container
        className={classes.sectionContainer}
        justify={"center"}
        alignItems="center"
        direction="column"
      >
        <Summary />
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        fullScreen={matchesXS}
        maxWidth="xs"
      >
        <DialogTitle>
          <Typography variant="h5">Summarization Configuration</Typography>
        </DialogTitle>
        <Divider variant="middle" classes={{ root: classes.divider }} />
        <DialogContent>
          <Grid container direction="column">
            <Grid item container>
              <FormControl
                fullWidth
                className={classes.formControl}
                color={matchesDark ? "secondary" : "primary"}
              >
                <InputLabel id="model-type-label">Model Type</InputLabel>
                <Select
                  labelId="model-type-label"
                  id="model-type-select"
                  value={modelType}
                  onChange={handleModelTypeChange}
                  input={<Input />}
                >
                  <MenuItem value={0}>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={1}>BERT</MenuItem>
                  <MenuItem value={2}>GPT-2</MenuItem>
                  <MenuItem value={3}>XLNet</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item container justify="center">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={optimalSentence}
                    onChange={() => setOptimalSentence(!optimalSentence)}
                    name="Optimal Sentence"
                    color={matchesDark ? "secondary" : "primary"}
                  />
                }
                label="Optimal Number of Sentences"
              />
            </Grid>
            {!optimalSentence && (
              <Grid item container>
                <FormControl className={classes.formControl} fullWidth>
                  <TextField
                    type="number"
                    value={numSentences}
                    InputProps={{
                      inputProps: {
                        max: 100,
                        min: 1,
                      },
                    }}
                    color={matchesDark ? "secondary" : "primary"}
                    label="Number of Sentences"
                    onChange={(e) => setNumSentences(e.target.value)}
                  />
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color={matchesDark ? "secondary" : "primary"}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleClose();
              summarize();
            }}
            color={matchesDark ? "secondary" : "primary"}
            disabled={modelType === 0}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = {
  summarizeMedia,
  loadVideosInCollection,
  loadAudiosInCollection,
  updateVideoInCollection,
  updateAudioInCollection,
  resetVideoSummarization,
  resetAudioSummarization,
};

export default connect(mapStateToProps, mapDispatchToProps)(SummaryContent);
