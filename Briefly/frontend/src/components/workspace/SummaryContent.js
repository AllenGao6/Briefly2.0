import React, { useState, useRef } from "react";
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
  Tooltip,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/styles";
import EmptyIcon from "@material-ui/icons/HourglassEmpty";
import ResetIcon from "@material-ui/icons/Cached";
import AddIcon from "@material-ui/icons/AddBoxOutlined";
import BulletPointList from "../common/BulletPointList";
import QuizList from "../common/QuizList";
import ControlledVideoPlayer from "../common/ControlledVideoPlayer";
import { connect } from "react-redux";
import { summarizeMedia } from "../../redux/actions/summarize_actions";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import GetAppIcon from '@material-ui/icons/GetApp';
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
import {generateQuiz, resetAudioQuiz, resetVideoQuiz} from "../../redux/actions/quizGeneration_actions";
import clsx from "clsx";
import store from "store";
import { PDFDownloadLink } from "@react-pdf/renderer";

const format = (seconds) => {
  if (isNaN(seconds)) {
    return "00:00";
  }
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours().toString().padStart(2, "0");
  const mm = date.getUTCMinutes().toString().padStart(2, "0");
  const ss = date.getUTCSeconds().toString().padStart(2, "0");

  if (hh) {
    return `${hh}:${mm}:${ss}`;
  }

  return `00:${mm}:${ss}`;
};

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
  generateQuiz,
  getScreenshot,
  resetAudioQuiz,
  resetVideoQuiz,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const matchesDark = theme.palette.type === "dark";
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));

  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [numSentences, setNumSentences] = useState(5);
  const [optimalSentence, setOptimalSentence] = useState(false);
  const [modelType, setModelType] = useState(0);
  const [played, setPlayed] = useState(0);
  const [addContent, setAddContent] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(media.is_processing);
  const [isGenerating, setGenerating] = useState(false);
  const [answerVisible, setAnswerVisible] = useState(false);
  const mediaRef = useRef(null);
  const [answer, setAnswer] = useState("")

  const updateMediaInCollection = async (id, media, mediaId) => {
    switch (mediaType) {
      case "video":
        await updateVideoInCollection(id, media, mediaId);
        break;
      case "audio":
        await updateAudioInCollection(id, media, mediaId);
        break;
      case "text":
        await updateAudioInCollection(id, media, mediaId);
        break;
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
        await resetAudioSummarization(id, mediaId);
        break;
      default:
        break;
    }
  };

  const resetMediaQuiz = async (id, mediaId) => {
    switch (mediaType) {
      case "video":
        await resetVideoQuiz(id, mediaId);
        break;
      case "audio":
        await resetAudioQuiz(id, mediaId);
        break;
      case "text":
        await resetAudioQuiz(id, mediaId);
        break;
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
    //console.log("handleTranscriptDelete");
  };

  const handleReset = (type) => {
    if(type==="summ")
      resetMediaSummarization(collectionId, media.id);
    if(type==="quiz"){
      store.each(function(value, key){
        if(key !== 'accessToken')
          store.remove(key);
      })
      resetMediaQuiz(collectionId, media.id);
    }
  };

  const handleAddTranscript = () => {
    const displayed_time = format(
      mediaRef.current ? mediaRef.current.getCurrentTime() : "00:00:00"
    );
    const transcripts = JSON.parse(media.summarization);
    let id = 0;
    transcripts.forEach((transcript) => {
      id = Math.max(transcript.id + 1, id);
    });
    transcripts.push({
      id: id,
      sentence: addContent,
      time: played,
      displayed_time: `[${displayed_time}]`,
    });
    const newMedia = {
      summarization: JSON.stringify(transcripts),
    };
    updateMediaInCollection(collectionId, newMedia, media.id);
    setAddContent("");
    setPlayed(0);
  };

  //call backend for service request
  const summarize = async () => {
    setIsSummarizing(true);
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
          loadAudiosInCollection(collectionId);
          break;
        default:
          break;
      }
    }
    setIsSummarizing(false);
  };

  const generate_quiz = async () =>{
    setGenerating(true);
    const QuizGenConfig = {
      task : 'QA_pair_gen',
      based_text : 'summ',
      question : null
    };
    const quiz = await generateQuiz(
      collectionId,
      media.id,
      mediaType,
      QuizGenConfig
    );
    if (quiz) {
      switch (mediaType) {
        case "video":
          loadVideosInCollection(collectionId);
          break;
        case "audio":
          loadAudiosInCollection(collectionId);
          break;
        case "text":
          loadAudiosInCollection(collectionId);
          break;
        default:
          break;
      }
    }
    setGenerating(false);
  }
  
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

  const handleAnswer = () =>{
    setAnswerVisible(!answerVisible);
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

  const PopQuiz = () => {
    //console.log(media);
    if (media.quiz === null) {
      return (
        <React.Fragment>
          <Grid item style={{ minHeight: isSummarizing ? "10rem" : undefined }}>
            <EmptyIcon
              className={clsx(
                classes.icon,
                isGenerating ? "rotated" : undefined
              )}
              style={{ width: "7rem", height: "7rem" }}
            />
          </Grid>
          <Grid item>
            <Typography variant="h5">
              {isGenerating ? "Generating Pop Quiz..." : "No Pop Quiz yet."}
            </Typography>
          </Grid>
          {isGenerating ? undefined : (
            <Grid item style={{ marginTop: "1.5rem" }}>
              <Button
                variant="contained"
                color={matchesDark ? "secondary" : "primary"}
                style={{ color: "white" }}
                onClick={() => {generate_quiz();}}
              >
                Generate Pop Quiz
              </Button>
            </Grid>
          )}
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
                        Quiz Type:
                      </Typography>
                      <Typography variant="h6" className={classes.specialText}>
                        {"Short Answer"}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      container
                      alignItems="center"
                      style={{ marginTop: 5 }}
                    >
                      <Typography variant="h6" className={classes.text}>
                        Question count:
                      </Typography>
                      <Typography variant="h6" className={classes.specialText}>
                        {JSON.parse(media.quiz).length}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <IconButton onClick={() =>{handleReset("quiz")}}>
                    <Tooltip title="Reset" arrow>
                      <ResetIcon className={classes.icon} />
                    </Tooltip>
                  </IconButton>
                  <IconButton onClick={() =>{handleAnswer()}}>
                    {answerVisible ? 
                      <Tooltip title="Hide Answers" arrow>
                        <VisibilityIcon className={classes.icon} />
                      </Tooltip> : 
                      <Tooltip title="Show Answers" arrow>
                      <VisibilityOffIcon className={classes.icon} />
                    </Tooltip>}
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
              <QuizList
                quizes={JSON.parse(media.quiz)}  
                answerVisible={answerVisible}     
              />
            </Paper>
          </Grid>
        </Grid>
      );
    }
  };

  const More = () => {
    return <h1>this will be implemented</h1>;
  };

  const ServiceType = (value) => {
    if(mediaType === 'text')
      value += 1;
    if (value === 0) return <Summary />;
    else if (value === 1) return <PopQuiz />;
    else return <More />;
  };

  const Summary = () => {
    if (!media.is_summarized) {
      return (
        <React.Fragment>
          <Grid item style={{ minHeight: isSummarizing ? "10rem" : undefined }}>
            <EmptyIcon
              className={clsx(
                classes.icon,
                isSummarizing ? "rotated" : undefined
              )}
              style={{ width: "7rem", height: "7rem" }}
            />
          </Grid>
          <Grid item>
            <Typography variant="h5">
              {isSummarizing ? "Summarizing..." : "No summarization yet."}
            </Typography>
          </Grid>
          {isSummarizing ? undefined : (
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
          )}
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
                        {JSON.parse(media.summarization).length}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <IconButton onClick={() =>{handleReset("summ")}}>
                    <Tooltip title="Reset" arrow>
                      <ResetIcon className={classes.icon} />
                    </Tooltip>
                  </IconButton>
                  <IconButton onClick={() => setOpenAddDialog(true)}>
                    <Tooltip title="Add" arrow>
                      <AddIcon className={classes.icon} />
                    </Tooltip>
                  </IconButton>
                  <PDFDownloadLink
                    document={<h1>this is a test</h1>}
                    fileName="movielist.pdf"
                  >
                    <IconButton>
                    <Tooltip title="Export Notes" arrow>
                      <GetAppIcon className={classes.icon} />
                    </Tooltip>
                  </IconButton>
                  </PDFDownloadLink> 
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
                mediaType={mediaType}
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
          {mediaType !== 'text'? <Tab className={classes.tab} label="Summary"></Tab> : null}
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
        {ServiceType(value)}
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
      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        fullWidth
        fullScreen={matchesXS}
        maxWidth="md"
      >
        <DialogTitle>
          <Typography variant="h5">Add Timestamped Bullet Point</Typography>
        </DialogTitle>
        <Divider variant="middle" classes={{ root: classes.divider }} />
        <DialogContent>
          <Grid container direction="column">
            <Grid
              item
              container
              style={{
                paddingLeft: 24,
                paddingRight: 24,
                marginBottom: "1rem",
              }}
            >
              <TextField
                id="add-bulletpoint-text"
                label="Content"
                value={addContent}
                placeholder="Write whatever important content here."
                multiline
                fullWidth
                rows={5}
                color={matchesDark ? "secondary" : "primary"}
                onChange={(e) => setAddContent(e.target.value)}
              />
            </Grid>
            <Grid item container style={{ paddingLeft: 24, paddingRight: 24 }}>
              <Typography variant="h5" style={{ fontSize: "1rem" }}>
                Drag the slider to the desired timestamp below:
              </Typography>
            </Grid>
            <Grid item container justify="center">
              {mediaType === "video" && (
                <ControlledVideoPlayer
                  mediaUrl={media.video}
                  played={played}
                  setPlayed={setPlayed}
                  background={"white"}
                  ref={mediaRef}
                />
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenAddDialog(false)}
            color={matchesDark ? "secondary" : "primary"}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpenAddDialog(false);
              handleAddTranscript();
            }}
            color={matchesDark ? "secondary" : "primary"}
            disabled={addContent.length === 0}
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
  generateQuiz,
  resetAudioQuiz,
  resetVideoQuiz,
};

export default connect(mapStateToProps, mapDispatchToProps)(SummaryContent);
